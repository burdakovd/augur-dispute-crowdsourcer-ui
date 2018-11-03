// @flow

import { all, call, put } from "redux-saga/effects";

import getWeb3 from "./util/getWeb3";
import type { Web3 } from "web3";
import search from "./search";
import marketInfo from "./marketInfo";

function* handleWeb3Network(): * {
  const web3: Web3 = yield call(getWeb3);
  const network = yield call(() => web3.eth.net.getId());
  yield put({ type: "NETWORK_CHANGED", id: network });
}

function* index(): * {
  yield all([call(search), call(marketInfo), call(handleWeb3Network)]);
}

export default index;
