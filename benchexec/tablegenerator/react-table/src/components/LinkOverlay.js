/* SPDX-License-Identifier: Apache-2.0
 *
 * BenchExec is a framework for reliable benchmarking.
 * This file is part of BenchExec.
 * Copyright (C) Dirk Beyer. All rights reserved.
 */
import React from "react";
import ReactModal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { isOkStatus } from "../utils/utils";
import zip from "../vendor/zip.js/index.js";
import YAML from "yaml";
import path from "path-browserify";

const cachedZipFileEntries = {};

export default class LinkOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isYAML: this.isYAMLFile(this.props.link),
      content: `loading file: ${this.props.link}`,
      scrollBarWidth: 0,
      isSecondLevel: false,
    };

    this.loadContent(this.props.link);
  }

  componentDidMount() {
    setTimeout(() => {
      this.getScrollBarWidth();
    }, 100);
  }

  isYAMLFile(path) {
    return path.endsWith(".yml");
  }

  loadNewFile = relativeURL => {
    let newURL = path.join(this.props.link, "../" + relativeURL);
    this.setState({
      isYAML: this.isYAMLFile(relativeURL),
      isSecondLevel: true,
      content: `loading file: ${newURL}`,
    });
    this.loadContent(newURL);
  };

  loadOriginalFile = () => {
    this.setState({
      isYAML: this.isYAMLFile(this.props.link),
      isSecondLevel: false,
      content: `loading file: ${this.props.link}`,
    });
    this.loadContent(this.props.link);
  };

  // 1) Try loading url with normal Ajax request for uncompressed results.
  // 2) Try loading url from within ZIP archive using HTTP Range header for efficient access
  //    (this fails for ZIPs on the local disk).
  // 3) Try loading url from within ZIP archive without Range header.
  loadContent = async url => {
    console.log("load content", url);
    if (url) {
      try {
        const response = await fetch(url);
        //status 404/403 => error?
        if (isOkStatus(response.status)) {
          try {
            const content = await response.text();
            this.setState({ content });
          } catch (e) {
            console.log("Error: Stream not readable", url, e);
            this.attemptLoadingFromZIP(url);
          }
        } else {
          console.log("Error: Loading file not possible", response);
          this.attemptLoadingFromZIP(url);
        }
      } catch (e) {
        console.log("Error: Resource not found", url, e);
        this.attemptLoadingFromZIP(url);
      }
    }
  };

  setError = error => {
    this.setState({ error: `${error}` });
  };

  loadFileFromZipEntries = (entries, logfile, zipUrl) => {
    for (let entry of entries) {
      if (entry.filename.indexOf(logfile) >= 0) {
        entry.getData(new zip.TextWriter(), content =>
          this.setState({ content }),
        );
        return;
      }
    }
    this.setError(`Did not find file "${logfile}" in "${zipUrl}"`);
  };

  loadFileFromZip = (logZip, logfile, zipUrl) => {
    logZip.getEntries(entries => {
      cachedZipFileEntries[zipUrl] = entries;
      this.loadFileFromZipEntries(entries, logfile, zipUrl);
    });
  };

  attemptLoadingZIPManually(logfile, zipUrl) {
    try {
      // This is basically just for Chrome because HTTPReader fails there
      const xhr = new XMLHttpRequest();
      xhr.responseType = "arraybuffer";
      xhr.addEventListener(
        "load",
        () => {
          zip.createReader(
            new zip.ArrayBufferReader(xhr.response),
            reader => this.loadFileFromZip(reader, logfile, zipUrl),
            this.setError,
          );
        },
        false,
      );
      xhr.addEventListener("error", this.setError, false);
      xhr.open("GET", zipUrl);
      xhr.send();
    } catch (error) {
      this.setError(error);
    }
  }

  attemptLoadingFromZIP = async url => {
    console.log("Text is not received. Try as zip?", url);
    const splitPos = url.lastIndexOf("/");
    const zipUrl = url.substring(0, splitPos) + ".zip";
    const urlArray = url.split("/");
    const logfile = decodeURIComponent(
      `${urlArray[urlArray.length - 2]}/${urlArray[urlArray.length - 1]}`,
    ); // <folder>/<logfile>

    if (zipUrl in cachedZipFileEntries) {
      this.loadFileFromZipEntries(
        cachedZipFileEntries[zipUrl],
        logfile,
        zipUrl,
      );
    } else {
      try {
        zip.createReader(
          new zip.HttpRangeReader(zipUrl),
          reader => this.loadFileFromZip(reader, logfile, zipUrl),
          error => {
            if (error === "HTTP Range not supported.") {
              // try again without HTTP Range header
              this.setState({
                content:
                  `Loading file "${logfile}" ` +
                  `from ZIP archive "${zipUrl}" without using HTTP Range header.`,
              });
              // Try with HttpReader, but this fails in Chrome for local files,
              // so fall back to a manual XMLHttpRequest.
              zip.createReader(
                new zip.HttpReader(zipUrl),
                reader => this.loadFileFromZip(reader, logfile, zipUrl),
                error => {
                  console.log("Loading ZIP with HttpReader failed", error);
                  this.attemptLoadingZIPManually(logfile, zipUrl);
                },
              );
            } else {
              this.setError(error);
            }
          },
        );
      } catch (error) {
        this.setError(error);
      }
    }
  };

  getScrollBarWidth() {
    const modalBox = document.getElementsByClassName(
      "ReactModal__Content ReactModal__Content--after-open overlay",
    )[0];
    const scrollBarWidth = modalBox.offsetWidth - modalBox.clientWidth;
    this.setState({ scrollBarWidth: scrollBarWidth });
  }

  render() {
    ReactModal.setAppElement("#root");
    return (
      <ReactModal
        className="overlay"
        isOpen={true}
        onRequestClose={this.props.close}
      >
        <FontAwesomeIcon
          icon={faTimes}
          onClick={this.props.close}
          className="closing"
          style={{ right: 28 + this.state.scrollBarWidth }}
        />
        {!this.state.error ? (
          this.state.isYAML ? (
            <LinkOverlayYAML
              yamlText={this.state.content}
              loadNewFile={this.loadNewFile}
            />
          ) : (
            <div className="link-overlay-content-container">
              {this.state.isSecondLevel ? (
                <span
                  className="link-overlay-back-button"
                  onClick={this.loadOriginalFile}
                >
                  <FontAwesomeIcon
                    className="link-overlay-back-icon"
                    icon={faArrowLeft}
                  />
                  Back to YAML
                </span>
              ) : (
                ""
              )}
              <pre className="link-overlay-text">{this.state.content}</pre>
              <input />
            </div>
          )
        ) : (
          <div>
            <p>Error while loading content ({this.state.error}).</p>
            <p>
              This could be a problem of the{" "}
              <a href="https://en.wikipedia.org/wiki/Same-origin_policy">
                same-origin policy
              </a>{" "}
              of your browser.
            </p>
            {window.location.href.indexOf("file://") === 0 ? (
              <>
                <p>
                  If you are using Google Chrome, try launching it with a flag
                  --allow-file-access-from-files.
                </p>
                <p>
                  Reading files from within ZIP archives on the local disk does
                  not work with Google Chrome, if the target file is within a
                  ZIP archive you need to extract it.
                </p>
                <p>
                  Firefox can access files from local directories by default,
                  but this does not work for files that are not beneath the same
                  directory as this HTML page.
                </p>
              </>
            ) : null}
            <p>
              You can try to download the file:{" "}
              <a href={this.props.link}>{this.props.link}</a>
            </p>
          </div>
        )}
      </ReactModal>
    );
  }
}

/** Special Link Overlay for YAML files. */
class LinkOverlayYAML extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      splitterTag: "<splitter#9d81y23>",
      fileTag: "<file#092nt43>",
      content: this.props.yamlText,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.yamlText !== this.props.yamlText) {
      this.prepareTextForRendering();
    }
  }

  /**
   * Parses the YAML file and encloses all input and property files with a fileTag as well as a splitterTag,
   * so they can be rendered separately as links. Takes the following assumptions:
   * input_files is either a string or a list of strings
   * properties is a list of dicts, each with a "property_file" key
   */
  prepareTextForRendering = () => {
    const yamlObj = YAML.parseDocument(this.props.yamlText);

    const inputFiles = yamlObj.get("input_files");
    if (inputFiles) {
      if (Array.isArray(inputFiles.items)) {
        inputFiles.items.forEach(inputFileItem => {
          inputFileItem.value = this.encloseFileInTags(inputFileItem.value);
        });
      } else {
        yamlObj.set("input_files", this.encloseFileInTags(inputFiles));
      }
    }

    const properties = yamlObj.get("properties");
    if (properties) {
      properties.items.forEach(property => {
        property.items.forEach(propertyItem => {
          if (propertyItem.key.value === "property_file") {
            propertyItem.value.value = this.encloseFileInTags(
              propertyItem.value.value,
            );
          }
        });
      });
    }

    this.setState({ content: yamlObj.toString() });
  };

  encloseFileInTags = fileName => {
    return (
      this.state.splitterTag +
      this.state.fileTag +
      fileName +
      this.state.fileTag +
      this.state.splitterTag
    );
  };

  render() {
    const contentBySplitter = this.state.content.split(this.state.splitterTag);
    const jsxContent = [];

    contentBySplitter.forEach(contentPart => {
      let jsxContentPart;
      // If contentPart is enclosed with file tags (= if contentPart is a file which should be linked)
      if (
        contentPart.match(
          "^" + this.state.fileTag + "(?:.)+" + this.state.fileTag + "$",
        )
      ) {
        contentPart = contentPart.replace(
          new RegExp(this.state.fileTag, "g"),
          "",
        );
        jsxContentPart = (
          <span
            onClick={() => this.props.loadNewFile(contentPart)}
            className="link-overlay-file-link"
            key={contentPart}
          >
            {contentPart}
          </span>
        );
      } else {
        jsxContentPart = <span key={contentPart}>{contentPart}</span>;
      }
      jsxContent.push(jsxContentPart);
    });

    return (
      <div className="link-overlay-content-container">
        <pre className="link-overlay-text">{jsxContent}</pre>
      </div>
    );
  }
}
