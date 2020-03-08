/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
/* SPDX-License-Identifier: Apache-2.0
 *
 * BenchExec is a framework for reliable benchmarking.
 * This file is part of BenchExec.
 * Copyright (C) Dirk Beyer. All rights reserved.
 */
import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Overview from "../components/Overview";

const fs = require("fs");

// We use jest snapshots for integration tests, and they become quite large.
// It is not really recommended by jest to do this, but this still seems like
// the best option for us. So at least we apply some custom serializers that
// help shrink the size and reduce irrelevant syntactic differences.

// Top-level serializer that does post-processing on the final string
expect.addSnapshotSerializer({
  print: (val, serialize) =>
    serialize(val.toJSON())
      .split("\n")
      // filter empty lines
      .filter(s => !s.match(/^ *$/))
      // filter handler attributes (nothing important visible)
      .filter(s => !s.match(/^ *on[a-zA-Z]*=\{\[Function\]\}$/))
      // reduce indentation to one space
      .map(s => {
        const trimmed = s.trimStart();
        return " ".repeat((s.length - trimmed.length) / 2) + trimmed;
      })
      .join("\n"),
  test: val => val && val.hasOwnProperty("toJSON")
});

// Serializer that simplifies HTML elements with several children,
// if all children are strings by joining the strings (better readable)
expect.addSnapshotSerializer({
  print: (val, serialize) => {
    val.children = [val.children.filter(s => !s.match(/^ *$/)).join("")];
    return serialize(val);
  },
  test: val =>
    val &&
    Array.isArray(val.children) &&
    val.children.length > 1 &&
    val.children.every(o => typeof o === "string")
});

// Serializer that simplifies HTML elements with one empty child
// (normalizes <div></div> to <div />)
expect.addSnapshotSerializer({
  print: (val, serialize) => {
    delete val.children;
    return serialize(val);
  },
  test: val =>
    val &&
    Array.isArray(val.children) &&
    val.children.length === 1 &&
    !val.children[0]
});

// Serializer that simplies the dangerouslySetInnerHTML attribute
expect.addSnapshotSerializer({
  print: (val, serialize) => serialize(val.__html),
  test: val => val && val.hasOwnProperty("__html")
});

const testDir = "../test_integration/expected/";

// Provide a way to render children into a DOM node that exists outside the hierarchy of the DOM component
ReactDOM.createPortal = dom => {
  return dom;
};

const testSnapshotOf = (name, componentFunc) => {
  fs.readdirSync(testDir)
    .filter(file => file.endsWith(".html"))
    .filter(file => fs.statSync(testDir + file).size < 100000)
    .forEach(file => {
      it(`${name} for ${file}`, () => {
        const content = fs.readFileSync(testDir + file, { encoding: "UTF-8" });
        const data = JSON.parse(content);

        const overview = renderer
          .create(<Overview data={data} />)
          .getInstance();
        const component = renderer.create(componentFunc(overview));

        expect(component).toMatchSnapshot();
      });
    });
};

export default testSnapshotOf;
