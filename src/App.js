// @flow

import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Pool from "./pages/Pool";

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/:market/:round/invalid" exact component={Pool} />
      <Route path="/:market/:round/valid/:outcome" exact component={Pool} />
      <Route component={() => <span>404 Not found</span>} />
    </Switch>
  </Router>
);

export default App;
