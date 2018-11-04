// @flow

import { Map as ImmMap } from "immutable";
import nullthrows from "nullthrows";
import { fork, take, cancel, call, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import invariant from "invariant";
import { getPublicWeb3 } from "./util/getWeb3";
import type { Web3 } from "web3";
import poolAbi from "../../abi/pool";

function* monitor(network: number, account: string, poolAddress: string): * {
  const web3: Web3 = yield call(getPublicWeb3, network);
  const pool = new web3.eth.Contract(poolAbi.Crowdsourcer, poolAddress);
  const accounting = yield call(() =>
    pool.methods
      .getAccounting()
      .call()
      .then(address => new web3.eth.Contract(poolAbi.Accounting, address))
  );
  const REP = yield call(() =>
    pool.methods
      .getREP()
      .call()
      .then(address => new web3.eth.Contract(poolAbi.IERC20, address))
  );

  const fetch = async () => {
    const [
      contribution,
      feeNumerator,
      hasWithdrawnProceeds,
      REPWithdrawalLimit
    ] = await Promise.all([
      accounting.methods.m_contributionPerContributor(account).call(),
      accounting.methods.m_feeNumeratorPerContributor(account).call(),
      pool.methods.m_proceedsCollected(account).call(),
      REP.methods.allowance(account, poolAddress).call()
    ]);

    return {
      type: "GOT_PERSONAL_POOL_INFO",
      network,
      account,
      pool: poolAddress,
      info: {
        contribution,
        feeNumerator,
        hasWithdrawnProceeds,
        REPWithdrawalLimit
      }
    };
  };

  const channel = yield call(() =>
    eventChannel(emitter => {
      console.log("starting web3 subscription");
      const subscription = web3.eth.subscribe(
        "logs",
        {
          address: poolAddress
        },
        (e, r) => {
          if (e) {
            console.error(e);
          } else {
            emitter(nullthrows(r));
          }
        }
      );
      const subscription2 = web3.eth.subscribe(
        "logs",
        {
          address: REP.options.address,
          topics: [null, web3.utils.padLeft(account, 64)]
        },
        (e, r) => {
          if (e) {
            console.error(e);
          } else {
            emitter(nullthrows(r));
          }
        }
      );

      return () => {
        console.log("closing web3 subscription");
        subscription.unsubscribe();
        subscription2.unsubscribe();
      };
    })
  );

  try {
    while (true) {
      const data = yield call(fetch);
      yield put(data);
      yield take(channel);
    }
  } finally {
    channel.close();
  }
}

function* index(): * {
  var monitors: ImmMap<string, *> = ImmMap();

  while (true) {
    const action = yield take([
      "SUBSCRIBE_PERSONAL_POOL_EVENTS",
      "UNSUBSCRIBE_PERSONAL_POOL_EVENTS"
    ]);
    const { network, account, pool } = action;
    const key = `${network}:${account}:${pool}`;
    console.log(action.type, { key });

    if (action.type === "SUBSCRIBE_PERSONAL_POOL_EVENTS") {
      invariant(monitors.get(key) == null, "subscribed twice");
      const worker = yield fork(monitor, network, account, pool);
      monitors = monitors.set(key, worker);
    } else {
      const worker = monitors.get(key);
      yield cancel(nullthrows(worker));
      monitors = monitors.delete(key);
    }
  }
}

export default index;
