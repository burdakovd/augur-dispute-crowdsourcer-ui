// @flow

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import nullthrows from "nullthrows";
import App from "./App";

ReactDOM.render(<App />, nullthrows(document.getElementById("root")));
