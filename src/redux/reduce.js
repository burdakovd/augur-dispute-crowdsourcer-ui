// @flow

import type { State } from "./state";
import type { Action } from "./actions/types";
import getInitialState from "./state";

function reduce(state: State = getInitialState(), action: Action): State {
  if (action.type === "SEARCH") {
    return {
      ...state,
      query: action.query
    };
  }

  return state;
}

export default reduce;
