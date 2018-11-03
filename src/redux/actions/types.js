// @flow

import { List as ImmList } from "immutable";

export type SearchResults = ImmList<string>;
export type MarketInfo = {|
  name: string,
  marketType: string,
  outcomes: Array<string>,
  participants: Array<{
    outcome: ?{
      name: string,
      invalid: boolean
    },
    size: string
  }>,
  isCrowdsourcing: boolean
|};

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
    }
  | {
      type: "MARKET_INFO_NEEDED",
      id: string
    }
  | {
      type: "MARKET_INFO_FETCHED",
      network: number,
      id: string,
      info: MarketInfo
    };

export type Dispatch = (action: Action) => any;
