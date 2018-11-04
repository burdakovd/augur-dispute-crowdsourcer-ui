// @flow

import type { Addresses } from "../../addresses";

import { List as ImmList } from "immutable";

export type SearchResults = ImmList<string>;
export type MarketInfo = {|
  name: string,
  marketType: string,
  numTicks: number,
  outcomes: Array<string>,
  participants: Array<{
    outcome: ?{
      name: string,
      invalid: boolean
    },
    size: string
  }>,
  currentRoundCrowdsourcers: Array</*size*/ string>,
  isCrowdsourcing: boolean
|};
export type PoolInfo = {|
  address: string,
  startTime: number,
  endTime: number,
  feeWindowID: number,
  state: ?{|
    rep: string,
    disputeTokensAddress: ?string,
    disputeTokens: ?string,
    executor: string,
    collectedFees: boolean
  |}
|};
export type PersonalPoolInfo = {|
  contribution: string,
  feeNumerator: string,
  REPWithdrawalLimit: string,
  hasWithdrawnProceeds: boolean
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
    }
  | {
      type: "GOT_CONTRACT_ADDRESSES",
      network: number,
      addresses: Addresses
    }
  | {
      type: "SUBSCRIBE_POOL_EVENTS",
      network: number,
      market: string,
      round: number,
      outcome: ?number
    }
  | {
      type: "UNSUBSCRIBE_POOL_EVENTS",
      network: number,
      market: string,
      round: number,
      outcome: ?number
    }
  | {
      type: "GOT_POOL_INFO",
      network: number,
      market: string,
      round: number,
      outcome: ?number,
      info: PoolInfo
    }
  | {
      type: "NEED_PERSONAL_ADDRESS"
    }
  | {
      type: "GOT_PERSONAL_ADDRESS",
      address: string
    }
  | {
      type: "SUBSCRIBE_PERSONAL_POOL_EVENTS",
      network: number,
      account: string,
      pool: string
    }
  | {
      type: "UNSUBSCRIBE_PERSONAL_POOL_EVENTS",
      network: number,
      account: string,
      pool: string
    }
  | {
      type: "GOT_PERSONAL_POOL_INFO",
      network: number,
      account: string,
      pool: string,
      info: PersonalPoolInfo
    };

export type Dispatch = (action: Action) => any;
