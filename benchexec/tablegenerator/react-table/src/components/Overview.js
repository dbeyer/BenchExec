/* SPDX-License-Identifier: Apache-2.0
 *
 * BenchExec is a framework for reliable benchmarking.
 * This file is part of BenchExec.
 * Copyright (C) Dirk Beyer. All rights reserved.
 */
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Table from "./ReactTable.js";
import Summary from "./Summary.js";
import Info from "./Info.js";
import SelectColumn from "./SelectColumn.js";
import ScatterPlot from "./ScatterPlot.js";
import QuantilePlot from "./QuantilePlot.js";
import LinkOverlay from "./LinkOverlay.js";
import Reset from "./Reset.js";
import { prepareTableData } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

//example data for development
if (process.env.NODE_ENV !== "production") {
  window.data = require("../data/data.json");
}

export default class Overview extends React.Component {
  constructor(props) {
    super(props);
    //imported data
    const { tableHeader, tools, columns, table, stats } = prepareTableData(
      window.data
    );

    this.originalTable = table;
    this.originalTools = tools;

    this.columns = columns;
    this.stats = stats;
    this.tableHeader = tableHeader;

    this.filteredData = [];

    //data is handled and changed here; To use it in other components hand it over with component
    //To change data in component (e.g. filter): function to change has to be in overview
    this.state = {
      tools,
      table,

      showSelectColumns: false,
      showLinkOverlay: false,
      filtered: [],
      tabIndex: 0,

      quantilePreSelection: tools[0].columns[1]
    };
  }

  // -----------------------SelectColumns-----------------------
  toggleSelectColumns = ev => {
    this.setState(prevState => ({
      showSelectColumns: !prevState.showSelectColumns
    }));
  };

  // -----------------------Link Overlay-----------------------
  toggleLinkOverlay = (ev, hrefRow) => {
    ev.preventDefault();

    this.setState(prevState => ({
      showLinkOverlay: !prevState.showLinkOverlay,
      link: hrefRow
    }));
  };

  // -----------------------Filter-----------------------
  setFilter = filteredData => {
    this.filteredData = filteredData.map(row => {
      return row._original;
    });
  };
  filterPlotData = filter => {
    this.setState({
      table: this.filteredData,
      filtered: filter
    });
  };
  resetFilters = () => {
    this.setState({
      table: this.originalTable,
      filtered: []
    });
  };

  // -----------------------Common Functions-----------------------
  getRunSets = ({ tool, date, niceName }) => {
    return `${tool} ${date} ${niceName}`;
  };

  getRowName = row => row.id.filter(s => s).join(" | ");

  changeTab = (_, column, tab) => {
    this.setState({
      tabIndex: tab,
      quantilePreSelection: column
    });
  };

  render() {
    return (
      <div className="App">
        <main>
          <div className="overview">
            <Tabs
              selectedIndex={this.state.tabIndex}
              onSelect={tabIndex =>
                this.setState({
                  tabIndex,
                  showSelectColumns: false,
                  showLinkOverlay: false
                })
              }
            >
              <TabList>
                <Tab>Summary</Tab>
                <Tab>Table</Tab>
                <Tab>Quantile Plot</Tab>
                <Tab>Scatter Plot</Tab>
                <Tab>
                  Info <FontAwesomeIcon icon={faQuestionCircle} />
                </Tab>
                <Reset
                  isFiltered={!!this.state.filtered.length}
                  resetFilters={this.resetFilters}
                  filteredCount={this.state.table.length}
                  totalCount={this.originalTable.length}
                />
              </TabList>
              <TabPanel>
                <Summary
                  tools={this.state.tools}
                  tableHeader={this.tableHeader}
                  selectColumn={this.toggleSelectColumns}
                  stats={this.stats}
                  getRunSets={this.getRunSets}
                  changeTab={this.changeTab}
                />
              </TabPanel>
              <TabPanel>
                <Table
                  tableHeader={this.tableHeader}
                  data={this.originalTable}
                  tools={this.state.tools}
                  selectColumn={this.toggleSelectColumns}
                  getRunSets={this.getRunSets}
                  setFilter={this.setFilter}
                  filterPlotData={this.filterPlotData}
                  filtered={this.state.filtered}
                  toggleLinkOverlay={this.toggleLinkOverlay}
                  changeTab={this.changeTab}
                />
              </TabPanel>
              <TabPanel>
                <QuantilePlot
                  table={this.state.table}
                  tools={this.state.tools}
                  preSelection={this.state.quantilePreSelection}
                  getRunSets={this.getRunSets}
                  getRowName={this.getRowName}
                />
              </TabPanel>
              <TabPanel>
                <ScatterPlot
                  table={this.state.table}
                  columns={this.columns}
                  tools={this.state.tools}
                  getRunSets={this.getRunSets}
                  getRowName={this.getRowName}
                />
              </TabPanel>
              <TabPanel>
                <Info selectColumn={this.toggleSelectColumns}></Info>
              </TabPanel>
            </Tabs>
          </div>
          <div>
            {this.state.showSelectColumns && (
              <SelectColumn
                close={this.toggleSelectColumns}
                currColumns={this.columns}
                tableHeader={this.tableHeader}
                getRunSets={this.getRunSets}
                tools={this.state.tools}
              />
            )}
            {this.state.showLinkOverlay && (
              <LinkOverlay
                close={this.toggleLinkOverlay}
                link={this.state.link}
                toggleLinkOverlay={this.toggleLinkOverlay}
              />
            )}
          </div>
        </main>
      </div>
    );
  }
}
