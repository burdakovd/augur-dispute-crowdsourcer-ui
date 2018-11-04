// @flow

import type Web3 from "web3";
import type { MarketInfo } from "../../actions/types";
import abiDecodeShortStringAsInt256 from "speedomatic/src/abi-decode-short-string-as-int256";
import { Range as ImmRange, List as ImmList, Map as ImmMap } from "immutable";
import augurABI from "../../../abi/augur";
import invariant from "invariant";
import type { Addresses } from "../../../addresses";
import getContractAddresses from "../../../addresses";

async function fetchMarketData(
  web3: Web3,
  marketID: string,
  creationBlock: number
): Promise<MarketInfo> {
  const market = new web3.eth.Contract(augurABI.Market, marketID);

  const [
    // eslint-disable-next-line no-unused-vars
    _,
    marketCreationInfo,
    numParticipants,
    numTicks
  ] = await Promise.all([
    // We need to ensure that market belongs to
    // trusted universe.
    ensureMarketIsLegitAndIsFromTrustedUniverse(web3, marketID),
    fetchMarketCreationInfo(web3, marketID, creationBlock),
    market.methods
      .getNumParticipants()
      .call()
      .then(Number.parseInt),
    market.methods
      .getNumTicks()
      .call()
      .then(Number.parseInt)
  ]);

  const outcomes = {
    BINARY: () => ["NO", "YES"],
    CATEGORICAL: () => marketCreationInfo.outcomes,
    SCALAR: () => ["(?0 scalar)", "(?1 scalar)"]
  }[marketCreationInfo.marketType]();

  const outcomePayoutHashesArray = await Promise.all(
    ImmList(ImmRange(0, outcomes.length))
      .push(null)
      .map(
        async outcomeIndex =>
          await market.methods
            .derivePayoutDistributionHash(
              ImmRange(0, outcomes.length)
                .map(
                  i =>
                    outcomeIndex != null
                      ? i === outcomeIndex
                        ? numTicks
                        : 0
                      : Math.floor(numTicks / outcomes.length)
                )
                .map(n => web3.utils.toHex(n))
                .toArray(),
              outcomeIndex == null
            )
            .call()
      )
      .toArray()
  );
  const outcomePayoutHashes = ImmMap(
    outcomePayoutHashesArray.map((hash, i) => [hash, i])
  );

  const getParticipantInfo = async index => {
    const participantAddress = await market.methods
      .getReportingParticipant(index)
      .call();
    const participant = new web3.eth.Contract(
      augurABI.DisputeCrowdsourcer,
      participantAddress
    );
    const [size, payoutDistributionHash] = await Promise.all([
      participant.methods.getSize().call(),
      participant.methods.getPayoutDistributionHash().call()
    ]);
    const outcomeIndex = outcomePayoutHashes.get(payoutDistributionHash);

    const outcome =
      outcomeIndex === null
        ? null
        : outcomeIndex === outcomes.length
          ? { name: "INVALID", invalid: true }
          : { name: outcomes[outcomeIndex], invalid: false };

    return {
      outcome: outcome,
      size
    };
  };

  const participants = await Promise.all(
    ImmRange(0, numParticipants)
      .toArray()
      .map(async index => await getParticipantInfo(index))
  );

  const currentRoundCrowdsourcers = await Promise.all(
    outcomePayoutHashesArray.map(
      async hash =>
        await market.methods
          .getCrowdsourcer(hash)
          .call()
          .then(
            crowdsourcer =>
              web3.utils.toBN(crowdsourcer).eq(web3.utils.toBN(0))
                ? "0"
                : new web3.eth.Contract(
                    augurABI.DisputeCrowdsourcer,
                    crowdsourcer
                  ).methods
                    .getSize()
                    .call()
          )
    )
  );

  const feeWindow = await market.methods
    .getFeeWindow()
    .call()
    .then(address => new web3.eth.Contract(augurABI.FeeWindow, address));

  const isCrowdsourcing = await feeWindow.methods.isActive().call();

  return {
    name: marketCreationInfo.description,
    marketType: marketCreationInfo.marketType,
    outcomes: outcomes,
    numTicks: numTicks,
    participants: participants,
    currentRoundCrowdsourcers: currentRoundCrowdsourcers,
    isCrowdsourcing
  };
}

function onlyx<T>(a: Array<T>): T {
  invariant(a.length === 1, "Must have one element");
  return a[0];
}

async function fetchMarketCreationInfo(
  web3: Web3,
  marketID: string,
  creationBlock: number
): Promise<*> {
  const addresses = await getAddressesForNetworkOfWeb3(web3);

  const marketCreatedEventInputsABI = onlyx(
    augurABI.Augur.filter(
      ({ name, type }) => type === "event" && name === "MarketCreated"
    )
  ).inputs;

  const MarketCreatedEventSignature =
    "0xb2e65de73007eef46316e4f18ab1f301b4d0e31aa56733387b469612f90894df";

  // Here we take externally-provided transactions as a proof
  // of how market was created. We need to verify:
  // 1. Trusted Augur contract logged "MarketCreated" event in tx
  // 2. Event is about this market
  const event = await web3.eth
    .getPastLogs({
      fromBlock: web3.utils.toHex(creationBlock),
      toBlock: web3.utils.toHex(creationBlock),
      address: addresses.Augur,
      topics: [MarketCreatedEventSignature]
    })
    .then(logs =>
      logs
        .filter(
          ({ address }) =>
            address.toLowerCase() === addresses.Augur.toLowerCase()
        )
        .filter(({ topics }) => topics[0] === MarketCreatedEventSignature)
        .map(({ data, topics }) =>
          web3.eth.abi.decodeLog(
            marketCreatedEventInputsABI,
            data,
            topics.slice(1)
          )
        )
        .filter(event => event.market.toLowerCase() === marketID.toLowerCase())
    )
    .then(onlyx);

  return {
    description: event.description,
    marketType: ["BINARY", "CATEGORICAL", "SCALAR"][event.marketType],
    outcomes: event.outcomes.map(o =>
      abiDecodeShortStringAsInt256(o).toString()
    )
  };
}

async function getAddressesForNetworkOfWeb3(web3: Web3): Promise<Addresses> {
  const network = await web3.eth.net.getId();
  return await getContractAddresses(network);
}

async function ensureMarketIsLegitAndIsFromTrustedUniverse(
  web3: Web3,
  marketID: string
): Promise<void> {
  const augurAddresses = await getAddressesForNetworkOfWeb3(web3);
  const trustedUniverse = new web3.eth.Contract(
    augurABI.Universe,
    augurAddresses.Universe
  );

  const isLegitMarket = await trustedUniverse.methods
    .isContainerForMarket(marketID)
    .call();

  // comparing with `!== true` is silly, but I want to avoid
  // chance of considering market legit due to some silly type conversions
  // e.g. string 'false' is truthy in JS, and if method somehow returns
  // `'false'`, it may be interpreted as `true`
  if (isLegitMarket !== true) {
    throw Error(
      `Trusted universe ${augurAddresses.Universe} did not recognize market
      ${marketID} as legitimate (it returned ${isLegitMarket}).
      Failing to avoid scam.`
    );
  }
}

export default fetchMarketData;
