// @flow

import nullthrows from "nullthrows";
import { all, call, put, take } from "redux-saga/effects";

import getContractAddresses from "../../addresses";
import { getPersonalWeb3 } from "./util/getWeb3";
import type { Web3 } from "web3";
import search from "./search";
import marketInfo from "./marketInfo";
import poolEvents from "./poolEvents";
import personalPoolEvents from "./personalPoolEvents";

function* handleWeb3Network(): * {
  const web3: Web3 = yield call(() => getPersonalWeb3());
  const network = yield call(() => web3.eth.net.getId());
  yield put({ type: "NETWORK_CHANGED", id: network });
  const addresses = yield call(getContractAddresses, network);
  yield put({ type: "GOT_CONTRACT_ADDRESSES", network, addresses });
}

function* getPersonalAddress(): * {
  yield take("NEED_PERSONAL_ADDRESS");
  const web3: Web3 = yield call(getPersonalWeb3);
  try {
    if (window.ethereum) {
      yield call(() => window.ethereum.enable());
    }
    const address = yield call(() =>
      web3.eth.getAccounts().then(accounts => nullthrows(accounts[0]))
    );
    yield put({ type: "GOT_PERSONAL_ADDRESS", address });
  } catch (e) {
    alert(
      `Failed to get your Ethereum address (maybe Metamask is locked). Some functions will not work. ${e}`
    );
  }
}

function* index(): * {
  yield all([
    call(search),
    call(marketInfo),
    call(handleWeb3Network),
    call(getPersonalAddress),
    call(poolEvents),
    call(personalPoolEvents)
  ]);
}

export default index;
