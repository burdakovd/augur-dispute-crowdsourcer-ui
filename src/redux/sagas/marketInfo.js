// @flow

import { Map as ImmMap, Set as ImmSet } from "immutable";
import { fork, call, select, take, put } from "redux-saga/effects";
import invariant from "invariant";
import fetchMarketData from "./util/fetchMarketData";
import getAugur from "./util/getAugur";
import { getPublicWeb3 } from "./util/getWeb3";

function onlyx<T>(a: Array<T>): T {
  invariant(a.length === 1, "Must have one element");
  return a[0];
}

function* fetch(network: number, id: string): * {
  // sadly Metamask web3 is much less reliably reads from contracts than Infura
  // so using Infura web3 for reads
  const publicWeb3 = yield call(getPublicWeb3, network);
  const augur = yield call(getAugur, network);

  const untrustedInfo = yield call(async () =>
    new Promise((resolve, reject) =>
      augur.markets.getMarketsInfo(
        {
          marketIds: [id]
        },
        function(error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
    ).then(a => onlyx(a))
  );

  // TODO: make this more robust
  // TODO: fallback to public web3?
  // TODO: retry with exponential delay?
  // TODO: throttle to only one fetch in parallel
  // TODO: fetch dispute rounds separately (the are the most costly) and only
  // for the markets that fit on screen currently
  const trustedInfo = yield call(
    fetchMarketData,
    publicWeb3,
    id,
    untrustedInfo.creationBlock
  );

  yield put({
    type: "MARKET_INFO_FETCHED",
    network,
    id,
    info: trustedInfo
  });
}

function* index(): * {
  var handled: ImmMap<number, ImmSet<string>> = ImmMap();

  while (true) {
    const { id } = yield take("MARKET_INFO_NEEDED");
    const network = yield select(state => state.network);

    if (!handled.get(network, ImmSet()).contains(id)) {
      handled = handled.update(network, ImmSet(), s => s.add(id));
      yield fork(fetch, network, id);
    }
  }
}

export default index;
