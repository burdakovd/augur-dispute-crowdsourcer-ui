// @flow

import { Map as ImmMap } from "immutable";
import type { Addresses } from "../addresses";
import type {
  MarketInfo,
  SearchResults,
  PoolInfo,
  PersonalPoolInfo
} from "./actions/types";

export type State = {|
  query: string,
  network: ?number,
  searchResultsProgress: number,
  searchResults: ImmMap<number, ImmMap<string, SearchResults>>,
  marketInfo: ImmMap<number, ImmMap<string, MarketInfo>>,
  contractAddresses: ImmMap<number, Addresses>,
  poolInfo: ImmMap<string, PoolInfo>,
  personalPoolInfo: ImmMap<
    number,
    // account, pool
    ImmMap<string, ImmMap<string, PersonalPoolInfo>>
  >,
  personalAddress: ?string
|};

function getInitialState(): State {
  return {
    query: "",
    searchResultsProgress: 0,
    network: null,
    searchResults: ImmMap(),
    marketInfo: ImmMap(),
    contractAddresses: ImmMap(),
    poolInfo: ImmMap(),
    personalPoolInfo: ImmMap(),
    personalAddress: null
  };
}

export default getInitialState;
