// @flow

import { all, call, put } from "redux-saga/effects";

import getContractAddresses from "../../addresses";
import { getPersonalWeb3 } from "./util/getWeb3";
import type { Web3 } from "web3";
import search from "./search";
import marketInfo from "./marketInfo";
import poolEvents from "./poolEvents";

function* handleWeb3Network(): * {
  const web3: Web3 = yield call(getPersonalWeb3);
  const network = yield call(() => web3.eth.net.getId());
  yield put({ type: "NETWORK_CHANGED", id: network });
  const addresses = yield call(getContractAddresses, network);
  yield put({ type: "GOT_CONTRACT_ADDRESSES", network, addresses });
}

function* index(): * {
  yield all([
    call(search),
    call(marketInfo),
    call(handleWeb3Network),
    call(poolEvents)
  ]);
}

export default index;
