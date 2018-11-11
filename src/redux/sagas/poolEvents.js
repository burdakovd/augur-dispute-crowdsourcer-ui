// @flow

import type Web3 from "web3";
import type { Addresses } from "../../addresses";

import { Map as ImmMap } from "immutable";
import nullthrows from "nullthrows";
import { fork, call, select, take, put, cancel } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import invariant from "invariant";
import getContractAddresses from "../../addresses";
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

  const isOurParticipant = participant =>
    participant.outcome != null &&
    (participant.outcome.invalid
      ? outcome == null
      : outcome != null &&
        participant.outcome.name === marketInfo.outcomes[outcome]);

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
  const feeWindowID =
    feeWindowStartTime / Number.parseInt(disputeRoundDuration);

  const getPoolAddress = async () => {
    return await factory.methods
      .maybeGetCrowdsourcer(
        market,
        web3.utils.toHex(feeWindowID),
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

  var address = null;

  const factoryLogsChannel = yield call(() =>
    eventChannel(emitter => {
      console.log("starting web3 subscription");
      const subscription = web3.eth.subscribe(
        "logs",
        {
          address: nullthrows(factory.options.address)
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
      };
    })
  );

  try {
    while (true) {
      address = yield call(getPoolAddress);
      yield put({
        type: "GOT_POOL_INFO",
        network,
        round,
        market,
        outcome,
        info: {
          address,
          startTime: feeWindowStartTime,
          endTime: feeWindowStartTime + Number.parseInt(disputeRoundDuration),
          feeWindowID
        }
      });

      if (!web3.utils.toBN(address).eq(web3.utils.toBN(0))) {
        break;
      }

      // wait for events
      yield take(factoryLogsChannel);
    }
  } finally {
    factoryLogsChannel.close();
  }

  address = nullthrows(address);

  console.log(
    `Observed non-zero address of crowdsourcer pool: ${address}, proceeding with monitoring its state`
  );

  const pool = new web3.eth.Contract(poolAbi.Crowdsourcer, address);
  const REP = yield call(() =>
    pool.methods
      .getREP()
      .call()
      .then(address => new web3.eth.Contract(poolAbi.IERC20, address))
  );
  const accounting = yield call(() =>
    pool.methods
      .getAccounting()
      .call()
      .then(address => new web3.eth.Contract(poolAbi.Accounting, address))
  );
  const disputerAddress = yield call(() => pool.methods.getDisputer().call());

  const getBalances = async () => {
    const [repDisputer, hasDisputed, hasFinalized] = await Promise.all([
      REP.methods.balanceOf(disputerAddress).call(),
      pool.methods.hasDisputed().call(),
      pool.methods.isFinalized().call()
    ]);

    const [
      repCrowdsourcer,
      hasCollectedFees,
      executorAddress,
      contributions,
      offeredFees,
      [
        projectedFundsUsed,
        projectedFeeNumerator,
        projectedBoundaryParticipationNumerator,
        projectedBoundaryParticipationDenominator
      ]
    ] = await Promise.all([
      REP.methods.balanceOf(pool.options.address).call(),
      pool.methods.m_feesCollected().call(),
      new web3.eth.Contract(poolAbi.Disputer, disputerAddress).methods
        .m_feeReceiver()
        .call(),
      accounting.methods.getTotalContribution().call(),
      accounting.methods.getTotalFeesOffered().call(),
      (async () => {
        const {
          fundsUsed,
          feeNumerator,
          fundsUsedFromBoundaryBucket
        } = await (async () => {
          if (hasFinalized) {
            const [
              fundsUsed,
              feeNumerator,
              fundsUsedFromBoundaryBucket
            ] = await Promise.all([
              accounting.methods.m_fundsUsed().call(),
              accounting.methods.m_boundaryFeeNumerator().call(),
              accounting.methods.m_fundsUsedFromBoundaryBucket().call()
            ]);
            return { fundsUsed, feeNumerator, fundsUsedFromBoundaryBucket };
          }

          const fundsUsed = await (hasDisputed
            ? pool.methods
                .getDisputeToken()
                .call()
                .then(address => new web3.eth.Contract(poolAbi.IERC20, address))
                .then(
                  async token =>
                    await token.methods.balanceOf(disputerAddress).call()
                )
            : (async () => {
                if (round < marketInfo.participants.length) {
                  return "0";
                }

                const poolSize = marketInfo.participants
                  .map(p => web3.utils.toBN(p.size))
                  .reduce((x, y) => x.add(y), web3.utils.toBN(0))
                  .mul(web3.utils.toBN(2))
                  .sub(
                    marketInfo.participants
                      .filter(isOurParticipant)
                      .map(p => web3.utils.toBN(p.size))
                      .reduce((x, y) => x.add(y), web3.utils.toBN(0))
                      .mul(web3.utils.toBN(3))
                  );

                const currentContribution =
                  round === marketInfo.participants.length
                    ? web3.utils.toBN(
                        marketInfo.currentRoundCrowdsourcers[
                          outcome == null ? marketInfo.outcomes.length : outcome
                        ]
                      )
                    : web3.utils.toBN(0);

                const poolCanAccept = (n =>
                  n.gt(web3.utils.toBN(0)) ? n : web3.utils.toBN(0))(
                  poolSize.sub(currentContribution).sub(web3.utils.toBN(1))
                );

                return poolCanAccept.gt(web3.utils.toBN(repDisputer))
                  ? repDisputer
                  : poolCanAccept.toString();
              })());

          const {
            feeNumerator,
            fundsUsedFromBoundaryBucket
          } = await accounting.methods.getProjectedFee(fundsUsed).call();
          return { fundsUsed, feeNumerator, fundsUsedFromBoundaryBucket };
        })();

        const fundsInBoundaryBucket = await accounting.methods.m_contributionPerFeeNumerator(
          feeNumerator
        );

        return [
          fundsUsed,
          feeNumerator,
          fundsUsedFromBoundaryBucket,
          fundsInBoundaryBucket
        ];
      })()
    ]);

    const repBalance = web3.utils
      .toBN(repCrowdsourcer)
      .add(web3.utils.toBN(repDisputer));
    var disputeTokensBalance = null;
    var disputeTokensAddress = null;

    if (hasDisputed) {
      const disputeToken = await pool.methods
        .getDisputeToken()
        .call()
        .then(address => new web3.eth.Contract(poolAbi.IERC20, address));

      const [dtCrowdsourcer, dtDisputer] = await Promise.all([
        disputeToken.methods.balanceOf(pool.options.address).call(),
        disputeToken.methods.balanceOf(disputerAddress).call()
      ]);
      disputeTokensBalance = web3.utils
        .toBN(dtCrowdsourcer)
        .add(web3.utils.toBN(dtDisputer));
      disputeTokensAddress = disputeToken.options.address;
    }

    return {
      rep: repBalance.toString(),
      disputeTokens:
        disputeTokensBalance == null ? null : disputeTokensBalance.toString(),
      disputeTokensAddress,
      collectedFees: hasCollectedFees,
      executor: executorAddress,
      contributions,
      offeredFees,
      projectedFundsUsed,
      projectedFeeNumerator,
      projectedBoundaryParticipationNumerator,
      projectedBoundaryParticipationDenominator
    };
  };

  const crowdsourcerLogsChannel = yield call(() =>
    eventChannel(emitter => {
      console.log("starting web3 subscription");
      const subscription = web3.eth.subscribe(
        "logs",
        {
          address: nullthrows(address)
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
      };
    })
  );

  var balances = null;

  try {
    while (true) {
      balances = yield call(getBalances);
      yield put({
        type: "GOT_POOL_INFO",
        network,
        round,
        market,
        outcome,
        info: {
          address,
          startTime: feeWindowStartTime,
          endTime: feeWindowStartTime + Number.parseInt(disputeRoundDuration),
          feeWindowID,
          state: balances
        }
      });
      // wait for events
      yield take(crowdsourcerLogsChannel);
    }
  } finally {
    crowdsourcerLogsChannel.close();
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
