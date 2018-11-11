// @flow

import nullthrows from "nullthrows";
import React, { Component } from "react";
import Button from "react-bootstrap/lib/Button";
import Panel from "react-bootstrap/lib/Panel";
import type { PoolInfo } from "../redux/actions/types";
import poolAbi from "../abi/pool";
import type { State } from "../redux/state";
import { connect } from "react-redux";
import Web3 from "web3";
import { getPersonalWeb3 } from "../redux/sagas/util/getWeb3";
import Amount from "./Amount";

const DisputeCard = ({
  personalAddress,
  poolAddress,
  poolInfo
}: {
  personalAddress: ?string,
  poolAddress: ?string,
  poolInfo: ?PoolInfo
}) => {
  return poolAddress != null &&
    personalAddress != null &&
    poolInfo != null &&
    poolInfo.state != null ? (
    <Panel bsStyle="primary">
      <Panel.Heading>
        <Panel.Title componentClass="h3">Run the dispute</Panel.Title>
      </Panel.Heading>
      <Panel.Body>
        {poolInfo.state.disputeTokens != null ? (
          <p>
            Someone has already triggered dispute. It is not possible to do it
            second time.
          </p>
        ) : (
          <div>
            <p>
              You can dispute at any time during the round, and get some fee
              from all participants of the pool. Size of the fee depends on how
              much REP will get into the dispute, and how much the demand was in
              the pool. If you dispute too soon, transaction will fail.
            </p>
            <Form
              poolAddress={poolAddress}
              account={personalAddress}
              rep={nullthrows(poolInfo.state).projectedFundsUsed}
              fees={Web3.utils
                .toBN(nullthrows(poolInfo.state).projectedFeeNumerator)
                .mul(
                  Web3.utils.toBN(nullthrows(poolInfo.state).projectedFundsUsed)
                )
                .div(Web3.utils.toBN(1000))
                .toString()}
            />
          </div>
        )}
      </Panel.Body>
    </Panel>
  ) : null;
};

class Form extends Component<
  { poolAddress: string, account: string, rep: string, fees: string },
  *
> {
  render() {
    return (
      <form>
        <Button
          onClick={() =>
            dispute({
              account: this.props.account,
              poolAddress: this.props.poolAddress
            })
              .then(receipt =>
                alert(
                  `Transaction to perform dispute has been confirmed: ${
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
          Run dispute with <Amount size={this.props.rep} /> REP (collect{" "}
          <Amount size={this.props.fees} /> REP in fees)
        </Button>
      </form>
    );
  }
}

const dispute = async ({
  poolAddress,
  account
}: {
  poolAddress: string,
  account: string
}) => {
  const web3 = await getPersonalWeb3();
  const pool = new web3.eth.Contract(poolAbi.Crowdsourcer, poolAddress);
  const disputer = await pool.methods
    .getDisputer()
    .call()
    .then(address => new web3.eth.Contract(poolAbi.Disputer, address));
  const receipt = await disputer.methods
    .dispute(account)
    .send({ from: account, gas: 3000000 });
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
})(DisputeCard);
