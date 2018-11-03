// @flow

export type Action =
  | { type: "SEARCH_QUERY_CHANGED", query: string }
  | {
      type: "NETWORK_CHANGED",
      id: string
    }
  | { type: "PERFORM_SEARCH", query: string };

export type Dispatch = (action: Action) => any;
