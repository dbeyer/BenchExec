/* SPDX-License-Identifier: Apache-2.0
 *
 * BenchExec is a framework for reliable benchmarking.
 * This file is part of BenchExec.
 * Copyright (C) Dirk Beyer. All rights reserved.
 */
import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";

import {createRunSetColumns, StandardCell, StandardColumnHeader, SelectColumnsButton} from "./TableComponents";
import {getRawOrDefault, isNumericColumn, applyNumericFilter, applyTextFilter, numericSortMethod, textSortMethod, determineColumnWidth} from "../utils/utils";
import FilterInputField from "./FilterInputField";

// Special markers we use as category for empty run results
const RUN_ABORTED = "aborted"; // result tag was present but empty (failure)
const RUN_EMPTY = "empty"; // result tag was not present in results XML
const SPECIAL_CATEGORIES = {[RUN_EMPTY]: "Empty rows", [RUN_ABORTED]: "—"};

const ReactTableFixedColumns = withFixedColumns(ReactTable);
export default class Table extends React.Component {
  constructor(props) {
    super(props);

    this.data = this.props.data;
    this.state = {
      fixed: true,
    };

    // Collect all status and category values for filter drop-down
    this.statusValues = this.findAllValuesOfColumn((tool, column) => column.type === "status", (runResult, value) => getRawOrDefault(value));
    this.categoryValues = this.findAllValuesOfColumn((tool, column) => column.type === "status", (runResult, value) => runResult.category);

    this.infos = ["displayName", "tool", "limit", "host", "os", "system", "date", "runset", "branch", "options", "property"];
    this.typingTimer = -1;
    this.height = window.innerHeight - 50;
  }

  // fix columns
  handleInputChange = ({target}) => {
    const value = target.checked;
    const {name} = target;

    this.setState({
      [name]: value,
    });
  };

  findAllValuesOfColumn = (columnFilter, valueAccessor) =>
    this.props.tools.map((tool, j) =>
      tool.columns.map((column, i) => {
        if (!columnFilter(tool, column)) {
          return undefined;
        }
        const values = this.data.map(row => valueAccessor(row.results[j], row.results[j].values[i])).filter(Boolean);
        return [...new Set(values)].sort();
      }),
    );

  createTaskIdColumn = () => ({
    Header: () => (
      <div className="fixed">
        <form>
          <label title="Fix the first column">Fixed task:</label>
          <input name="fixed" type="checkbox" checked={this.state.fixed} onChange={this.handleInputChange} />
        </form>
      </div>
    ),
    fixed: this.state.fixed ? "left" : "",
    columns: [
      {
        minWidth: window.innerWidth * 0.3,
        Header: <SelectColumnsButton handler={this.props.selectColumn} />,
        fixed: this.state.fixed ? "left" : "",
        accessor: "id",
        Cell: cell => {
          const content = cell.value.map(id => (
            <span key={id} className="row_id">
              {id}
            </span>
          ));
          const {href} = cell.original;
          return href ? (
            <a
              key={href}
              className="row__name--cellLink"
              href={href}
              title="Click here to show source code"
              onClick={ev => this.props.toggleLinkOverlay(ev, href)}
            >
              {content}
            </a>
          ) : (
            <span title="This task has no associated file">{content}</span>
          );
        },
        filterMethod: (filter, row, column) => {
          const id = filter.pivotId || filter.id;
          return row[id].some(v => v && v.includes(filter.value));
        },
        Filter: FilterInputField,
      },
    ],
  });

  createStatusColumn = (runSetIdx, column, columnIdx) => ({
    id: `${runSetIdx}_${column.display_title}_${columnIdx}`,
    Header: <StandardColumnHeader column={column} />,
    show: column.isVisible,
    minWidth: determineColumnWidth(column, 10),
    accessor: row => row.results[runSetIdx].values[columnIdx],
    Cell: cell => {
      const {category} = cell.original.results[runSetIdx];
      let {href} = cell.original.results[runSetIdx];
      let tooltip;
      if (category === "aborted") {
        href = undefined;
        tooltip = "Result missing because run was aborted or not executed";
      } else if (category === "empty") {
        tooltip = "Result missing because task was not part of benchmark set";
      } else if (href) {
        tooltip = "Click here to show output of tool";
      }
      return <StandardCell cell={cell} href={href} className={category} toggleLinkOverlay={this.props.toggleLinkOverlay} title={tooltip} force={true} />;
    },
    sortMethod: textSortMethod,
    filterMethod: (filter, row) => {
      const cellValue = getRawOrDefault(row[filter.id]);
      if (!filter.value || filter.value === "all ") {
        return true;
      }
      if (filter.value.endsWith(" ")) {
        // category filters are marked with space at end
        const {category} = row._original.results[runSetIdx];
        return category === filter.value.trim();
      }
      return filter.value === cellValue;
    },
    Filter: ({filter, onChange}) => {
      const categoryValues = this.categoryValues[runSetIdx][columnIdx];
      return (
        <select onChange={event => onChange(event.target.value)} style={{width: "100%"}} value={filter ? filter.value : "all "}>
          <option value="all ">Show all</option>
          {categoryValues
            .filter(category => category in SPECIAL_CATEGORIES)
            .map(category => (
              // category filters are marked with space at end
              <option value={`${category} `} key={category}>
                {SPECIAL_CATEGORIES[category]}
              </option>
            ))}
          <optgroup label="Category">
            {categoryValues
              .filter(category => !(category in SPECIAL_CATEGORIES))
              .map(category => (
                // category filters are marked with space at end
                <option value={`${category} `} key={category}>
                  {category}
                </option>
              ))}
          </optgroup>
          <optgroup label="Status">
            {this.statusValues[runSetIdx][columnIdx].map(status => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </optgroup>
        </select>
      );
    },
  });

  createColumn = (runSetIdx, column, columnIdx) => {
    if (column.type === "status") {
      return this.createStatusColumn(runSetIdx, column, columnIdx);
    }

    return {
      id: `${runSetIdx}_${column.display_title}_${columnIdx}`,
      Header: <StandardColumnHeader column={column} />,
      show: column.isVisible,
      minWidth: determineColumnWidth(column),
      accessor: row => row.results[runSetIdx].values[columnIdx],
      Cell: cell => <StandardCell cell={cell} toggleLinkOverlay={this.props.toggleLinkOverlay} />,
      filterMethod: isNumericColumn(column) ? applyNumericFilter : applyTextFilter,
      Filter: filter => <FilterInputField numeric={isNumericColumn(column)} {...filter} />,
      sortMethod: isNumericColumn(column) ? numericSortMethod : textSortMethod,
    };
  };

  render() {
    const resultColumns = this.props.tools.map((runSet, runSetIdx) => createRunSetColumns(runSet, runSetIdx, this.createColumn)).flat();

    return (
      <div className="mainTable">
        <ReactTableFixedColumns
          data={this.data}
          filterable={true}
          filtered={this.props.filtered}
          columns={[this.createTaskIdColumn()].concat(resultColumns)}
          defaultPageSize={250}
          pageSizeOptions={[50, 100, 250, 500, 1000, 2500]}
          className="-highlight"
          minRows={0}
          onFilteredChange={filtered => {
            this.props.filterPlotData(filtered);
          }}
          style={{maxHeight: this.height}}
        >
          {(state, makeTable, instance) => {
            this.props.setFilter(state.sortedData);
            return makeTable();
          }}
        </ReactTableFixedColumns>
      </div>
    );
  }
}
