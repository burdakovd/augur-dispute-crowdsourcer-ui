// @flow

import type { State } from "./state";
import type { Action } from "./actions/types";
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
  }

  return state;
}

export default reduce;
