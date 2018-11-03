// @flow

import { Map as ImmMap } from "immutable";
import type { MarketInfo, SearchResults } from "./actions/types";

export type State = {|
  query: string,
  network: ?number,
  searchResultsProgress: number,
  searchResults: ImmMap<number, ImmMap<string, SearchResults>>,
  marketInfo: ImmMap<number, ImmMap<string, MarketInfo>>
|};

function getInitialState(): State {
  return {
    query: "",
    searchResultsProgress: 0,
    network: null,
    searchResults: ImmMap(),
    marketInfo: ImmMap()
  };
}

export default getInitialState;
