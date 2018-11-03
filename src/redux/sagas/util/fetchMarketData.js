// @flow

import type Web3 from "web3";
import type { MarketInfo } from "../../actions/types";
import abiDecodeShortStringAsInt256 from "speedomatic/src/abi-decode-short-string-as-int256";
import { List as ImmList, Range as ImmRange } from "immutable";
import augurABI from "../../../abi/augur";
import invariant from "invariant";
import type { Addresses } from "../../../addresses";
import getContractAddresses from "../../../addresses";

async function fetchMarketData(
  web3: Web3,
  marketID: string,
  creationBlock: number
): Promise<MarketInfo> {
  const [
    // eslint-disable-next-line no-unused-vars
    _,
    marketCreationInfo,
    numParticipants
  ] = await Promise.all([
    // We need to ensure that market belongs to
    // trusted universe.
    ensureMarketIsLegitAndIsFromTrustedUniverse(web3, marketID),
    fetchMarketCreationInfo(web3, marketID, creationBlock),
    new web3.eth.Contract(augurABI.Market, marketID).methods
      .getNumParticipants()
      .call()
  ]);

  return {
    name: marketCreationInfo.description,
    marketType: marketCreationInfo.marketType,
    outcomes: {
      BINARY: () => ["YES", "NO"],
      CATEGORICAL: () => marketCreationInfo.outcomes,
      SCALAR: () => ["(?0 scalar)", "(?1 scalar)"]
    }[marketCreationInfo.marketType](),
    numParticipants: numParticipants
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
  const [receipts, addresses] = await Promise.all([
    getTransactionReceiptsForBlock(web3, creationBlock),
    getAddressesForNetworkOfWeb3(web3)
  ]);

  const marketCreatedEventInputsABI = onlyx(
    augurABI.Augur.filter(
      ({ name, type }) => type === "event" && name === "MarketCreated"
    )
  ).inputs;

  // Here we take externally-provided transactions as a proof
  // of how market was created. We need to verify:
  // 1. Trusted Augur contract logged "MarketCreated" event in tx
  // 2. Event is about this market
  const logs = ImmList(receipts)
    .flatMap(receipt => receipt.logs)
    .filter(
      ({ address }) => address.toLowerCase() === addresses.Augur.toLowerCase()
    )
    .filter(
      ({ topics }) =>
        topics[0] ===
        "0xb2e65de73007eef46316e4f18ab1f301b4d0e31aa56733387b469612f90894df"
    )
    .map(({ data, topics }) =>
      web3.eth.abi.decodeLog(marketCreatedEventInputsABI, data, topics.slice(1))
    )
    .filter(event => event.market.toLowerCase() === marketID.toLowerCase())
    .toArray();

  const event = onlyx(logs);

  return {
    description: event.description,
    marketType: ["BINARY", "CATEGORICAL", "SCALAR"][event.marketType],
    outcomes: event.outcomes.map(o =>
      abiDecodeShortStringAsInt256(o).toString()
    )
  };
}

async function getTransactionReceiptsForBlock(
  web3: Web3,
  block: number
): Promise<Array<*>> {
  const numTransactions = await web3.eth.getBlockTransactionCount(block);
  return await Promise.all(
    ImmRange(0, numTransactions)
      .map(async index => {
        const transaction = await web3.eth.getTransactionFromBlock(
          block,
          index
        );
        return await web3.eth.getTransactionReceipt(transaction.hash);
      })
      .toArray()
  );
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