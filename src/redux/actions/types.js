// @flow

import { List as ImmList } from "immutable";

export type SearchResults = ImmList<string>;

export type Action =
  | { type: "SEARCH_QUERY_CHANGED", query: string }
  | {
      type: "NETWORK_CHANGED",
      id: number
    }
  | { type: "PERFORM_SEARCH", query: string }
  | {
      type: "SEARCH_RESULTS_PROGRESS",
      progress: number
    }
  | {
      type: "SEARCH_RESULTS",
      network: number,
      query: string,
      results: SearchResults
    };

export type Dispatch = (action: Action) => any;
