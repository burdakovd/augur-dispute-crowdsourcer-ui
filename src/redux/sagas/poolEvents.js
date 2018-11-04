// @flow

import type Web3 from "web3";
import type { Addresses } from "../../addresses";

import { Map as ImmMap, Set as ImmSet } from "immutable";
import nullthrows from "nullthrows";
import { fork, call, select, take, put, cancel } from "redux-saga/effects";
import invariant from "invariant";
import getContractAddresses from "../../addresses";
import fetchMarketData from "./util/fetchMarketData";
import getAugur from "./util/getAugur";
import augurAbi from "../../abi/augur";
import poolAbi from "../../abi/pool";
import { getPublicWeb3 } from "./util/getWeb3";

function* monitor(
  network: number,
  market: string,
  round: number,
  outcome: ?number
): * {
  const web3: Web3 = yield call(getPublicWeb3, network);
  const addresses: Addresses = yield call(getContractAddresses, network);
  const factory = new web3.eth.Contract(
    poolAbi.CrowdsourcerFactory,
    addresses.CrowdsourcerFactory
  );
  const numTicks = yield call(
    async () =>
      await new web3.eth.Contract(augurAbi.Market, market).methods
        .getNumTicks()
        .call()
        .then(s => {
          invariant(
            s === "10000",
            `Only supporting binary/categorical markets for now, got numTicks=${s}`
          );
          return Number.parseInt(s);
        })
  );
  const universeAddress = yield call(
    async () =>
      await new web3.eth.Contract(augurAbi.Market, market).methods
        .getUniverse()
        .call()
  );
  const disputeRoundDuration = yield call(
    async () =>
      await new web3.eth.Contract(augurAbi.Universe, universeAddress).methods
        .getDisputeRoundDurationInSeconds()
        .call()
  );

  // need to get market info
  var marketInfo = yield select(state =>
    state.marketInfo.get(network, ImmMap()).get(market)
  );
  if (marketInfo == null) {
    yield put({
      type: "MARKET_INFO_NEEDED",
      id: market
    });
    while (true) {
      const action = yield take("MARKET_INFO_FETCHED");
      if (action.network === network && action.id === market) {
        marketInfo = action.info;
        break;
      }
    }
  }

  const feeWindowStartTime = yield call(async () => {
    const feeWindowAddress = await new web3.eth.Contract(
      augurAbi.Market,
      market
    ).methods
      .getFeeWindow()
      .call();
    invariant(
      !web3.utils.toBN(feeWindowAddress).eq(web3.utils.toBN(0)),
      "must have started dispute rounds"
    );
    const currentFeeWindowStartTime = await new web3.eth.Contract(
      augurAbi.FeeWindow,
      feeWindowAddress
    ).methods
      .getStartTime()
      .call();
    return web3.utils
      .toBN(currentFeeWindowStartTime)
      .add(
        web3.utils
          .toBN(disputeRoundDuration)
          .mul(web3.utils.toBN(round - marketInfo.participants.length))
      )
      .toNumber();
  });

  const getPoolAddress = async () => {
    return await factory.methods
      .maybeGetCrowdsourcer(
        market,
        web3.utils.toHex(
          feeWindowStartTime / Number.parseInt(disputeRoundDuration)
        ),
        marketInfo.outcomes
          .map(
            (_, i) =>
              outcome == null
                ? Math.floor(numTicks / marketInfo.outcomes.length)
                : outcome === i
                  ? numTicks
                  : 0
          )
          .map(n => web3.utils.toHex(n)),
        outcome == null
      )
      .call();
  };

  while (true) {
    const address = yield call(getPoolAddress);

    yield put({
      type: "GOT_POOL_INFO",
      network,
      round,
      market,
      outcome,
      info: {
        address,
        startTime: feeWindowStartTime,
        endTime: feeWindowStartTime + Number.parseInt(disputeRoundDuration)
      }
    });

    break;
  }
}

function* index(): * {
  var monitors: ImmMap<string, *> = ImmMap();

  while (true) {
    const action = yield take([
      "SUBSCRIBE_POOL_EVENTS",
      "UNSUBSCRIBE_POOL_EVENTS"
    ]);
    const { network, market, round, outcome } = action;
    const key = `${network}:${market}:${round}:${
      outcome == null ? "-1" : outcome
    }`;
    console.log(action.type, { key });

    if (action.type === "SUBSCRIBE_POOL_EVENTS") {
      invariant(monitors.get(key) == null, "subscribed twice");
      const worker = yield fork(monitor, network, market, round, outcome);
      monitors = monitors.set(key, worker);
    } else {
      const worker = monitors.get(key);
      yield cancel(nullthrows(worker));
      monitors = monitors.delete(key);
    }
  }
}

export default index;
