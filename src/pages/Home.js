// @flow

import type { Dispatch } from "../redux/actions/types";
import type { State } from "../redux/state";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import FormGroup from "react-bootstrap/lib/FormGroup";
import FormControl from "react-bootstrap/lib/FormControl";
import nullthrows from "nullthrows";
import { connect } from "react-redux";
import "./Home.css";

type SearchParams = {|
  query: string,
  onQueryUpdated: string => void
|};

class SearchPage extends Component<SearchParams> {
  searchInput: *;

  render() {
    return (
      <div className="Home-search-page">
        <form>
          <FormGroup controlId="search">
            <FormControl
              type="text"
              placeholder="search by market id or name"
              value={this.props.query}
              ref={ref => {
                this.searchInput = ref;
              }}
              onChange={e => this.props.onQueryUpdated(e.target.value)}
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

const mapStateToProps = (state: State) => ({
  query: state.query
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onQueryUpdated: newQuery => {
      dispatch({
        type: "SEARCH",
        query: newQuery
      });
    }
  };
};

const Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPage);

export default Home;
