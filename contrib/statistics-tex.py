#!/usr/bin/env python3

# This file is part of BenchExec, a framework for reliable benchmarking:
# https://github.com/sosy-lab/benchexec
#
# SPDX-FileCopyrightText: 2007-2020 Dirk Beyer <https://www.sosy-lab.org>
#
# SPDX-License-Identifier: Apache-2.0

import argparse
import collections
import itertools
import re
import string
import sys
import multiprocessing
from functools import partial

from benchexec import tablegenerator
from benchexec.tablegenerator.statistics import StatValue
from benchexec.tablegenerator import util

sys.dont_write_bytecode = True  # prevent creation of .pyc files


HEADER = r"""% The following definition defines a command for each value.
% The command name is the concatenation of the first six arguments.
% To override this definition, define \StoreBenchExecResult with \newcommand before including this file.
% Arguments: benchmark name, run-set name, category, status, column name, statistic, value
\providecommand\StoreBenchExecResult[7]{\expandafter\newcommand\csname#1#2#3#4#5#6\endcsname{#7}}%"""


def extract_measurement(column_title, run_result):
    for i, column in enumerate(run_result.columns):
        if column.title == column_title:
            return util.to_decimal(run_result.values[i])

    sys.exit("Measurement %s missing for task %s." % (column_title, run_result.task_id))


def format_command_part(name):
    name = re.sub("[^a-zA-Z]", "-", name)
    name = string.capwords(name, "-")
    name = name.replace("-", "")
    return name


class StatAccumulator(object):
    def __init__(self):
        self.count = 0
        self.measurements = {}

    def add(self, result, measurements):
        self.count += 1
        for measurement in measurements:
            current_measurement_list = self.measurements.setdefault(measurement, [])
            current_measurement_list.append(extract_measurement(measurement, result))

    def to_latex(self, name_parts):
        if not all(self.measurements.values()):
            return ""

        stat_list = [
            (k.title(), StatValue.from_list(v)) for k, v in self.measurements.items()
        ]
        assert len(name_parts) <= 4
        name_parts += [""] * (4 - len(name_parts))  # ensure length 4
        name = r"}{".join(map(format_command_part, name_parts))
        return "\n".join(
            itertools.chain.from_iterable(
                [[r"\StoreBenchExecResult{%s}{Count}{}{%s}%%" % (name, self.count)]]
                + [
                    [
                        r"\StoreBenchExecResult{%s}{%s}{}{%s}%%"
                        % (name, time_name, util.print_decimal(time_stats.sum)),
                        r"\StoreBenchExecResult{%s}{%s}{Avg}{%s}%%"
                        % (name, time_name, util.print_decimal(time_stats.avg)),
                        r"\StoreBenchExecResult{%s}{%s}{Median}{%s}%%"
                        % (name, time_name, util.print_decimal(time_stats.median)),
                        r"\StoreBenchExecResult{%s}{%s}{Min}{%s}%%"
                        % (name, time_name, util.print_decimal(time_stats.min)),
                        r"\StoreBenchExecResult{%s}{%s}{Max}{%s}%%"
                        % (name, time_name, util.print_decimal(time_stats.max)),
                        r"\StoreBenchExecResult{%s}{%s}{Stdev}{%s}%%"
                        % (name, time_name, util.print_decimal(time_stats.stdev)),
                    ]
                    for (time_name, time_stats) in stat_list
                ]
            )
        )


class StatsCollection(object):
    def __init__(self, prefix_list, total_stats, category_stats, status_stats):
        self.prefix_list = prefix_list
        self.total_stats = total_stats
        self.category_stats = category_stats
        self.status_stats = status_stats


def load_results(result_file, status_print, measurements):
    run_set_result = tablegenerator.RunSetResult.create_from_xml(
        result_file, tablegenerator.parse_results_file(result_file)
    )
    run_set_result.collect_data(False)

    total_stats = StatAccumulator()
    category_stats = collections.defaultdict(StatAccumulator)
    status_stats = collections.defaultdict(
        lambda: collections.defaultdict(StatAccumulator)
    )
    for run_result in run_set_result.results:
        total_stats.add(run_result, measurements)
        category_stats[run_result.category].add(run_result, measurements)
        if status_print == "full":
            status_stats[run_result.category][run_result.status].add(
                run_result, measurements
            )
        elif status_print == "short":
            short_status = re.sub(r" *\(.*", "", run_result.status)
            status_stats[run_result.category][short_status].add(
                run_result, measurements
            )
    assert len(run_set_result.results) == total_stats.count

    basenames = [
        util.prettylist(run_set_result.attributes.get("benchmarkname")),
        util.prettylist(run_set_result.attributes.get("name")),
    ]
    # status_stats must be transformed to a dictionary to get rid of the lambda-factory used above (can't be pickled)
    return StatsCollection(basenames, total_stats, category_stats, dict(status_stats))


def main(args=None):
    if args is None:
        args = sys.argv

    parser = argparse.ArgumentParser(
        fromfile_prefix_chars="@",
        description="""Dump LaTeX commands with summary values of the table.
           All the information from the footer of HTML tables is available.
           The output is written to stdout.
           Part of BenchExec: https://github.com/sosy-lab/benchexec/""",
    )

    parser.add_argument(
        "result",
        metavar="RESULT",
        type=str,
        nargs="+",
        help="XML file(s) with result produced by benchexec",
    )
    parser.add_argument(
        "--status",
        action="store",
        choices=["none", "short", "full"],
        default="short",
        help="whether to output statistics aggregated for each different status value, "
        "for each abbreviated status value, or not",
    )

    parser.add_argument(
        "--measurements",
        action="store",
        type=str,
        default="cputime,walltime",
        help="Specifies all measurements which should be extracted from the XML file(s). "
        "All measurements must me present in each task in each XML file.",
    )

    options = parser.parse_args(args[1:])

    options.measurements = options.measurements.replace(" ", "").split(",")

    pool = multiprocessing.Pool()
    stats = pool.map(
        partial(
            load_results, status_print=options.status, measurements=options.measurements
        ),
        options.result,
    )

    print(HEADER)
    for curr_stats in stats:
        basenames = curr_stats.prefix_list
        total_stats = curr_stats.total_stats
        category_stats = curr_stats.category_stats
        status_stats = curr_stats.status_stats

        print(total_stats.to_latex(basenames + ["total"]))

        for (category, counts) in sorted(category_stats.items()):
            print(counts.to_latex(basenames + [category]))
            categories = [
                (s, c) for (s, c) in status_stats.get(category, {}).items() if s
            ]
            for (status, counts2) in sorted(categories):
                print(counts2.to_latex(basenames + [category, status]))
                if (
                    category == "correct"
                    and status_stats.get("wrong", {}).get(status) is None
                ):
                    print(StatAccumulator().to_latex(basenames + ["wrong", status]))
                elif (
                    category == "wrong"
                    and status_stats.get("correct", {}).get(status) is None
                ):
                    print(StatAccumulator().to_latex(basenames + ["correct", status]))


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        sys.exit("Script was interrupted by user.")
