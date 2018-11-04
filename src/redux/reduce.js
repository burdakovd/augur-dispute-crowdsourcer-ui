// @flow

import type { State } from "./state";
import type { Action } from "./actions/types";
import { Map as ImmMap } from "immutable";
import getInitialState from "./state";

function reduce(state: State = getInitialState(), action: Action): State {
  if (action.type === "SEARCH_QUERY_CHANGED") {
    return {
      ...state,
      query: action.query
    };
  } else if (action.type === "NETWORK_CHANGED") {
    return {
      ...state,
      network: action.id
    };
  } else if (action.type === "SEARCH_RESULTS") {
    const { network, query, results } = action;

    return {
      ...state,
      searchResults: state.searchResults.update(network, m =>
        (m || ImmMap()).update(query, _ => results)
      )
    };
  } else if (action.type === "SEARCH_RESULTS_PROGRESS") {
    return {
      ...state,
      searchResultsProgress: action.progress
    };
  } else if (action.type === "MARKET_INFO_FETCHED") {
    const { network, id, info } = action;
    return {
      ...state,
      marketInfo: state.marketInfo.update(network, m =>
        (m || ImmMap()).update(id, _ => info)
      )
    };
  } else if (action.type === "GOT_CONTRACT_ADDRESSES") {
    const { network, addresses } = action;
    return {
      ...state,
      contractAddresses: state.contractAddresses.set(network, addresses)
    };
  } else if (action.type === "GOT_POOL_INFO") {
    const { network, market, round, outcome, info } = action;
    const key = `${network}:${market}:${round}:${
      outcome == null ? "-1" : outcome
    }`;
    return {
      ...state,
      poolInfo: state.poolInfo.set(key, info)
    };
  }

  return state;
}

export default reduce;
