// @flow

import nullthrows from "nullthrows";
import React, { Component } from "react";
import Button from "react-bootstrap/lib/Button";
import Panel from "react-bootstrap/lib/Panel";
import { Map as ImmMap } from "immutable";
import type { PoolInfo, PersonalPoolInfo } from "../redux/actions/types";
import poolAbi from "../abi/pool";
import type { State } from "../redux/state";
import { connect } from "react-redux";
import Web3 from "web3";
import { getPersonalWeb3 } from "../redux/sagas/util/getWeb3";
import AddressLink from "./AddressLink";

const CollectProceedsCard = ({
  network,
  personalAddress,
  personalPoolInfo,
  poolAddress,
  poolInfo
}: {
  network: ?number,
  personalAddress: ?string,
  personalPoolInfo: ?PersonalPoolInfo,
  poolAddress: ?string,
  poolInfo: ?PoolInfo
}) => {
  return network != null &&
    poolAddress != null &&
    personalAddress != null &&
    personalPoolInfo != null &&
    poolInfo != null &&
    poolInfo.state != null ? (
    <Panel bsStyle="primary">
      <Panel.Heading>
        <Panel.Title componentClass="h3">Collect proceeds</Panel.Title>
      </Panel.Heading>
      <Panel.Body>
        {poolInfo.state.disputeTokensAddress == null ? (
          <p>Dispute hasn't happened yet, so can't collect proceeds.</p>
        ) : personalPoolInfo.hasWithdrawnProceeds ? (
          <p>
            You have already collected proceeds previously. You can't do it
            twice.
          </p>
        ) : (
          <div>
            <p>
              Get dispute tokens (
              <AddressLink
                network={network}
                address={poolInfo.state.disputeTokensAddress}
              />
              ), and refund REP (i.e. if lower fee was achieved, or not all of
              your REP was used for dispute).
            </p>
            <Form poolAddress={poolAddress} account={personalAddress} />
          </div>
        )}
      </Panel.Body>
    </Panel>
  ) : null;
};

class Form extends Component<{ poolAddress: string, account: string }, *> {
  render() {
    return (
      <form>
        <Button
          onClick={() =>
            collect({
              account: this.props.account,
              poolAddress: this.props.poolAddress
            })
              .then(receipt =>
                alert(
                  `Transaction to collect proceeds has been confirmed: ${
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
          Collect proceeds
        </Button>
      </form>
    );
  }
}

const collect = async ({
  poolAddress,
  account
}: {
  poolAddress: string,
  account: string
}) => {
  const web3 = await getPersonalWeb3();
  const pool = new web3.eth.Contract(poolAbi.Crowdsourcer, poolAddress);
  const receipt = await pool.methods
    .withdrawProceeds(account)
    .send({ from: account });
  console.log(receipt);
  return receipt;
};

export default (connect: any)((state: State, ownProps: *) => {
  const poolAddress =
    state.network == null
      ? null
      : (x =>
          x == null || Web3.utils.toBN(x).eq(Web3.utils.toBN(0)) ? null : x)(
          (x => (x != null ? x.address : null))(
            state.poolInfo.get(
              `${state.network}:${ownProps.market}:${ownProps.round}:${
                ownProps.outcomeIndex == null ? "-1" : ownProps.outcomeIndex
              }`
            )
          )
        );
  return {
    network: state.network,
    personalAddress: state.personalAddress,
    poolAddress: poolAddress,
    personalPoolInfo:
      state.network == null ||
      state.personalAddress == null ||
      poolAddress == null
        ? null
        : state.personalPoolInfo
            .get(state.network, ImmMap())
            .get(nullthrows(state.personalAddress), ImmMap())
            .get(poolAddress),
    poolInfo:
      state.network == null
        ? null
        : state.poolInfo.get(
            `${state.network}:${ownProps.market}:${ownProps.round}:${
              ownProps.outcomeIndex == null ? "-1" : ownProps.outcomeIndex
            }`
          )
  };
})(CollectProceedsCard);
