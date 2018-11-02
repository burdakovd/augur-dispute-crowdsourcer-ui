// @flow

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import nullthrows from "nullthrows";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  nullthrows(document.getElementById("root"))
);
