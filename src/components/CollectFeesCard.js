// @flow

import React, { Component } from "react";
import Button from "react-bootstrap/lib/Button";
import Panel from "react-bootstrap/lib/Panel";
import type { PoolInfo } from "../redux/actions/types";
import poolAbi from "../abi/pool";
import type { State } from "../redux/state";
import { connect } from "react-redux";
import Web3 from "web3";
import { getPersonalWeb3 } from "../redux/sagas/util/getWeb3";
import AddressLink from "./AddressLink";

const CollectFeesCard = ({
  network,
  personalAddress,
  poolAddress,
  poolInfo
}: {
  network: ?number,
  personalAddress: ?string,
  poolAddress: ?string,
  poolInfo: ?PoolInfo
}) => {
  return network != null &&
    poolAddress != null &&
    personalAddress != null &&
    poolInfo != null &&
    poolInfo.state != null ? (
    <Panel bsStyle="primary">
      <Panel.Heading>
        <Panel.Title componentClass="h3">Collect fees</Panel.Title>
      </Panel.Heading>
      <Panel.Body>
        {poolInfo.state.disputeTokensAddress == null ? (
          <p>Dispute hasn't happened yet, so can't collect fees.</p>
        ) : poolInfo.state.collectedFees ? (
          <p>
            Fees have already been collected. You can't do it twice. 90% of fees
            went to lucky dog who triggered the dispute (
            <AddressLink network={network} address={poolInfo.state.executor} />
            ), and 10% to contract author.
          </p>
        ) : (
          <div>
            <p>
              Trigger fees collection. 90% of fees will be received by lucky dog
              who triggered the dispute (
              <AddressLink
                network={network}
                address={poolInfo.state.executor}
              />
              ), and 10% will go to contract author.
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
                  `Transaction to collect feeswithdrawFees has been confirmed: ${
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
          Collect fees
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
  const receipt = await pool.methods.withdrawFees().send({ from: account });
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
    poolInfo:
      state.network == null
        ? null
        : state.poolInfo.get(
            `${state.network}:${ownProps.market}:${ownProps.round}:${
              ownProps.outcomeIndex == null ? "-1" : ownProps.outcomeIndex
            }`
          )
  };
})(CollectFeesCard);
