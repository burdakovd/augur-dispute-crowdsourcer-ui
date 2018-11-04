// @flow

import nullthrows from "nullthrows";
import React from "react";
import Button from "react-bootstrap/lib/Button";
import Panel from "react-bootstrap/lib/Panel";
import Table from "react-bootstrap/lib/Table";
import Web3 from "web3";
import { getPersonalWeb3 } from "../redux/sagas/util/getWeb3";
import AddressLink from "./AddressLink";
import { Map as ImmMap } from "immutable";
import type { MarketInfo, PoolInfo } from "../redux/actions/types";
import type { State } from "../redux/state";
import { connect } from "react-redux";
import getContractAddresses from "../addresses";
import poolAbi from "../abi/pool";

const DisputePoolCard = ({
  market,
  round,
  outcomeIndex,
  marketInfo,
  poolInfo
}: {
  market: string,
  round: number,
  outcomeIndex: ?number,
  marketInfo: MarketInfo,
  poolInfo: PoolInfo
}) => {
  return (
    <Panel bsStyle="primary">
      <Panel.Heading>
        <Panel.Title componentClass="h3">Dispute pool contract</Panel.Title>
      </Panel.Heading>
      <Table bordered>
        <tbody>
          <tr>
            <td>Factory address</td>
            <td>
              <FactoryAddressLink />
            </td>
          </tr>
          <tr>
            <td>Pool address</td>
            <td>
              {poolInfo != null && marketInfo != null ? (
                Web3.utils.toBN(poolInfo.address).eq(Web3.utils.toBN(0)) ? (
                  <span>
                    Pool for this dispute doesn't exist yet{" "}
                    <Button
                      bsStyle="primary"
                      onClick={() =>
                        createPool({
                          market,
                          round,
                          outcomeIndex,
                          poolInfo,
                          marketInfo
                        })
                          .then(receipt =>
                            alert(
                              `Transaction to create pool have been confirmed: ${
                                receipt.transactionHash
                              }.`
                            )
                          )
                          .catch(e => {
                            console.error(e);
                            alert(e);
                          })
                      }
                    >
                      Create
                    </Button>
                  </span>
                ) : (
                  <PoolAddressLink address={poolInfo.address} />
                )
              ) : (
                "loading..."
              )}
            </td>
          </tr>
          <tr>
            <td>Pool holdings (funds usable for dispute)</td>
            <td>TBD</td>
          </tr>
          <tr>
            <td>Pool holdings (fees)</td>
            <td>TBD</td>
          </tr>
        </tbody>
      </Table>
    </Panel>
  );
};

const createPool = async ({
  market,
  round,
  outcomeIndex,
  marketInfo,
  poolInfo
}: {
  market: string,
  round: number,
  outcomeIndex: ?number,
  marketInfo: MarketInfo,
  poolInfo: PoolInfo
}) => {
  const web3 = await getPersonalWeb3();
  const network = await web3.eth.net.getId();
  const addresses = await getContractAddresses(network);
  const factory = await new web3.eth.Contract(
    poolAbi.CrowdsourcerFactory,
    addresses.CrowdsourcerFactory
  );
  if (window.ethereum) {
    await window.ethereum.enable();
  }
  const sender = await web3.eth
    .getAccounts()
    .then(accounts => nullthrows(accounts[0]));
  const receipt = await factory.methods
    .getInitializedCrowdsourcer(
      market,
      web3.utils.toHex(poolInfo.feeWindowID),
      marketInfo.outcomes
        .map(
          (_, i) =>
            outcomeIndex == null
              ? Math.floor(marketInfo.numTicks / marketInfo.outcomes.length)
              : outcomeIndex === i
                ? marketInfo.numTicks
                : 0
        )
        .map(n => web3.utils.toHex(n)),
      outcomeIndex == null
    )
    .send({ from: sender });
  console.log(receipt);
  return receipt;
};

const FactoryAddressLink = connect((state: State) => ({
  network: state.network,
  address: ((state.contractAddresses || ImmMap()).get(state.network || 0) || {})
    .CrowdsourcerFactory
}))(
  ({ network, address }) =>
    network != null && address != null ? (
      <AddressLink address={address} network={network} />
    ) : (
      "Loading..."
    )
);

const PoolAddressLink = connect((state: State) => ({
  network: state.network
}))(
  ({ network, address }) =>
    network != null ? (
      <AddressLink address={address} network={network} />
    ) : (
      "Loading..."
    )
);

export default (connect: any)((state: State, ownProps: *) => ({
  poolInfo:
    state.network == null
      ? null
      : state.poolInfo.get(
          `${state.network}:${ownProps.market}:${ownProps.round}:${
            ownProps.outcomeIndex == null ? "-1" : ownProps.outcomeIndex
          }`
        )
}))(DisputePoolCard);
