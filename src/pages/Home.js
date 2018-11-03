// @flow

import React, { Component } from "react";
import ReactDOM from "react-dom";
import FormGroup from "react-bootstrap/lib/FormGroup";
import FormControl from "react-bootstrap/lib/FormControl";
import nullthrows from "nullthrows";
import { Map as ImmMap } from "immutable";
import { connect } from "react-redux";
import type { State } from "../redux/state";
import type { Dispatch } from "../redux/actions/types";
import networkIDtoName from "../networks";
import "./Home.css";

type SearchParams = {|
  query: string,
  network: ?string,
  progress: number,
  results: ?SearchResults,
  onQueryUpdated: string => void
|};

class SearchPage extends Component<SearchParams> {
  searchInput: *;

  render() {
    return (
      <div className="Home-search-page">
        <div>
          {this.props.network == null
            ? "Connecting to Ethereum network..."
            : `Connected to Ethereum network: ${ImmMap(networkIDtoName).get(
                `${this.props.network}`,
                this.props.network
              )}`}
        </div>
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
        <div>{`${this.props.results || ".".repeat(this.props.progress)}`}</div>
      </div>
    );
  }

  componentDidMount() {
    (ReactDOM.findDOMNode(nullthrows(this.searchInput)): any).focus();
  }
}

const mapStateToProps: State => * = (state: State) => ({
  query: state.query,
  network: state.network,
  results: state.searchResults.get(state.network, ImmMap()).get(state.query),
  progress: state.searchResultsProgress
});

const mapDispatchToProps: Dispatch => * = (dispatch: Dispatch) => {
  return {
    onQueryUpdated: newQuery => {
      dispatch({
        type: "SEARCH_QUERY_CHANGED",
        query: newQuery
      });
    }
  };
};

const Home = (connect: any)(mapStateToProps, mapDispatchToProps)(SearchPage);

export default Home;
