/* SPDX-License-Identifier: Apache-2.0
 *
 * BenchExec is a framework for reliable benchmarking.
 * This file is part of BenchExec.
 * Copyright (C) Dirk Beyer. All rights reserved.
 */
import React from "react";
import { formatColumnTitle, getRunSetName } from "../utils/utils";

export const SelectColumnsButton = ({ handler, ...other }) => (
  <span onClick={handler} className="selectColumns" {...other}>
    Click here to select columns
  </span>
);

export const StandardColumnHeader = ({
  column,
  title = "Click here to sort. Hold shift to multi-sort",
  ...other
}) => (
  <div title={title} {...other}>
    {formatColumnTitle(column)}
  </div>
);

export const RunSetHeader = ({ runSet, ...other }) => (
  <span className="header__tool-infos" {...other}>
    {getRunSetName(runSet)}
  </span>
);

export const StandardCell = ({
  cell,
  href = cell.value.href,
  toggleLinkOverlay,
  force = false,
  ...other
}) => {
  const { html } = cell.value;
  const raw = html ? undefined : cell.value.raw;
  if (!force && !(raw || html)) {
    return null;
  }
  if (href) {
    return (
      <a
        href={href}
        onClick={ev => toggleLinkOverlay(ev, href)}
        dangerouslySetInnerHTML={html ? { __html: html } : undefined}
        {...other}
      >
        {raw}
      </a>
    );
  }
  return (
    <div
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
      {...other}
    >
      {raw}
    </div>
  );
};

const SeparatorColumn = Object.freeze({
  headerClassName: "separator",
  columns: Object.freeze([
    Object.freeze({
      resizable: false,
      sortable: false,
      filterable: false,
      accessor: undefined,
      width: 2,
      headerClassName: "separator",
      className: "separator"
    })
  ])
});

export const createRunSetColumns = (runSet, runSetIdx, createColumn) => [
  SeparatorColumn,
  {
    Header: <RunSetHeader runSet={runSet} />,
    columns: runSet.columns.map((column, columnIdx) =>
      createColumn(runSetIdx, column, columnIdx)
    )
  }
];
