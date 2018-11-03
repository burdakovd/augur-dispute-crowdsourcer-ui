// @flow

import { delay } from "redux-saga";
import type { Action } from "../actions/types";

import { takeLatest, all, call, put, select } from "redux-saga/effects";
import getWeb3 from "./getWeb3";

function* handleSearchQuery(): * {
  // wait before search in case the user is still typing
  yield call(delay, 200);

  const query = yield select(state => state.query);
  const network = yield select(state => state.network);

  if (network == null) {
    return;
  }

  console.log("handled query", network, query);
}

function* initiateSearchQueries(): * {
  yield (takeLatest: any)(
    ["SEARCH_QUERY_CHANGED", "NETWORK_CHANGED"],
    handleSearchQuery
  );
}

function* handleWeb3Network(): * {
  const web3: Web3 = yield call(getWeb3);
  const network = yield call(() => web3.eth.net.getId());
  yield put({ type: "NETWORK_CHANGED", id: `${network}` });
}

function* root(): * {
  yield all([call(initiateSearchQueries), call(handleWeb3Network)]);
}

export default root;
