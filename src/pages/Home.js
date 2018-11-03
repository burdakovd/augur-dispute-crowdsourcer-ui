// @flow

import React, { Component } from "react";
import ReactDOM from "react-dom";
import FormGroup from "react-bootstrap/lib/FormGroup";
import FormControl from "react-bootstrap/lib/FormControl";
import nullthrows from "nullthrows";
import { Map as ImmMap } from "immutable";
import { connect } from "react-redux";
import type { State } from "../redux/state";
import type { Dispatch, SearchResults } from "../redux/actions/types";
import MarketCard from "../components/MarketCard";
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
                `${nullthrows(this.props.network)}`,
                nullthrows(this.props.network)
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
        <div className="Home-search-results">
          {this.props.results ? (
            this.props.results.size ? (
              <Markets markets={this.props.results} />
            ) : (
              "No markets found for the query"
            )
          ) : (
            ".".repeat(this.props.progress)
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    (ReactDOM.findDOMNode(nullthrows(this.searchInput)): any).focus();
  }
}

const Markets = ({ markets }) => {
  return (
    <div>
      {markets.map((id, index) => <MarketCard key={index} id={id} />).toArray()}
    </div>
  );
};

const mapStateToProps: State => * = (state: State) => ({
  query: state.query,
  network: state.network,
  results:
    state.network == null
      ? null
      : state.searchResults.get(state.network, ImmMap()).get(state.query),
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
