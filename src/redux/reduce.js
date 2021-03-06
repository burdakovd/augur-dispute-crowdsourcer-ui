// @flow

import type { State } from "./state";
import type { Action } from "./actions/types";
import { Map as ImmMap } from "immutable";
import getInitialState, { getDefaultSearchResultsShown } from "./state";

function reduce(state: State = getInitialState(), action: Action): State {
  if (action.type === "SEARCH_QUERY_CHANGED") {
    return {
      ...state,
      query: action.query,
      searchResultsShown: getDefaultSearchResultsShown()
    };
  } else if (action.type === "MORE_RESULTS_REQUESTED") {
    return {
      ...state,
      searchResultsShown: state.searchResultsShown + 3
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
        (m || ImmMap()).set(query, results)
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
        (m || ImmMap()).set(id, info)
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
  } else if (action.type === "GOT_PERSONAL_ADDRESS") {
    return {
      ...state,
      personalAddress: action.address
    };
  } else if (action.type === "GOT_PERSONAL_POOL_INFO") {
    const { network, account, pool, info } = action;
    return {
      ...state,
      personalPoolInfo: state.personalPoolInfo.update(network, m =>
        (m || ImmMap()).update(account, m => (m || ImmMap()).set(pool, info))
      )
    };
  }

  return state;
}

export default reduce;
