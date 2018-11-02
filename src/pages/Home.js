// @flow

import React, { Component } from "react";
import ReactDOM from "react-dom";
import FormGroup from "react-bootstrap/lib/FormGroup";
import FormControl from "react-bootstrap/lib/FormControl";
import nullthrows from "nullthrows";
import "./Home.css";

class Home extends Component<*> {
  searchInput: *;

  render() {
    return (
      <div className="Home-search-page">
        <form>
          <FormGroup controlId="search">
            <FormControl
              type="text"
              placeholder="search by market id or name"
              ref={ref => {
                this.searchInput = ref;
              }}
            />
          </FormGroup>
        </form>
      </div>
    );
  }

  componentDidMount() {
    (ReactDOM.findDOMNode(nullthrows(this.searchInput)): any).focus();
  }
}

export default Home;
