// @flow

import React, { Component } from "react";
import ReactDOM from "react-dom";
import Button from "react-bootstrap/lib/Button";
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
  numShown: number,
  network: ?string,
  progress: number,
  results: ?SearchResults,
  onQueryUpdated: string => void,
  onMoreRequested: () => void
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
              <Markets
                markets={this.props.results}
                numShown={this.props.numShown}
                onMoreRequested={this.props.onMoreRequested}
              />
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

const Markets = ({ markets, numShown, onMoreRequested }) => {
  return (
    <div>
      <div>
        {markets
          .slice(0, numShown)
          .map((id, index) => <MarketCard key={index} id={id} />)
          .toArray()}
      </div>
      {markets.size > numShown ? (
        <Button onClick={onMoreRequested}>Load more...</Button>
      ) : null}
    </div>
  );
  // TODO: could fetch more on scrolling
};

const mapStateToProps: State => * = (state: State) => ({
  query: state.query,
  numShown: state.searchResultsShown,
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
    },
    onMoreRequested: () => {
      dispatch({
        type: "MORE_RESULTS_REQUESTED"
      });
    }
  };
};

const Home = (connect: any)(mapStateToProps, mapDispatchToProps)(SearchPage);

export default Home;
