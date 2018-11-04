// @flow

import { Map as ImmMap } from "immutable";
import type { Addresses } from "../addresses";
import type { MarketInfo, SearchResults, PoolInfo } from "./actions/types";

export type State = {|
  query: string,
  network: ?number,
  searchResultsProgress: number,
  searchResults: ImmMap<number, ImmMap<string, SearchResults>>,
  marketInfo: ImmMap<number, ImmMap<string, MarketInfo>>,
  contractAddresses: ImmMap<number, Addresses>,
  poolInfo: ImmMap<string, PoolInfo>
|};

function getInitialState(): State {
  return {
    query: "",
    searchResultsProgress: 0,
    network: null,
    searchResults: ImmMap(),
    marketInfo: ImmMap(),
    contractAddresses: ImmMap(),
    poolInfo: ImmMap()
  };
}

export default getInitialState;
