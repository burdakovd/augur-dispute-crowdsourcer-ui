// @flow

import nullthrows from "nullthrows";
import React, { Component } from "react";
import Button from "react-bootstrap/lib/Button";
import Panel from "react-bootstrap/lib/Panel";
import { Map as ImmMap } from "immutable";
import type { PersonalPoolInfo, PoolInfo } from "../redux/actions/types";
import poolAbi from "../abi/pool";
import type { State } from "../redux/state";
import { connect } from "react-redux";
import Web3 from "web3";
import { getPersonalWeb3 } from "../redux/sagas/util/getWeb3";
import Amount from "./Amount";

const WithdrawCard = ({
  personalAddress,
  poolAddress,
  personalPoolInfo,
  poolInfo
}: {
  personalAddress: ?string,
  poolAddress: ?string,
  personalPoolInfo: ?PersonalPoolInfo,
  poolInfo: ?PoolInfo
}) => {
  return poolAddress != null &&
    personalAddress != null &&
    personalPoolInfo != null &&
    poolInfo != null &&
    poolInfo.state != null ? (
    <Panel bsStyle="primary">
      <Panel.Heading>
        <Panel.Title componentClass="h3">
          Withdraw your contribution (back to {personalAddress})
        </Panel.Title>
      </Panel.Heading>
      <Panel.Body>
        {poolInfo.state.disputeTokens != null ? (
          <p>
            It is not possible to withdraw contribution after dispute happened.
            Instead you should collect proceeds/refunds.
          </p>
        ) : personalPoolInfo.contribution === "0" ? (
          <p>
            It doesn't make much sense to withdraw if you have 0 on balance.
          </p>
        ) : (
          <div>
            <p>
              You can withdraw from the pool at any moment until dispute
              happens.
            </p>
            <Form
              poolAddress={poolAddress}
              account={personalAddress}
              personalPoolInfo={personalPoolInfo}
            />
          </div>
        )}
      </Panel.Body>
    </Panel>
  ) : null;
};

class Form extends Component<
  { poolAddress: string, account: string, personalPoolInfo: PersonalPoolInfo },
  *
> {
  render() {
    return (
      <form>
        <Button
          onClick={() =>
            withdraw({
              account: this.props.account,
              poolAddress: this.props.poolAddress
            })
              .then(receipt =>
                alert(
                  `Transaction to contribute your REP has been confirmed: ${
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
          Send transaction (will withdraw{" "}
          <Amount
            size={Web3.utils
              .toBN(this.props.personalPoolInfo.contribution)
              .mul(
                Web3.utils
                  .toBN(1000)
                  .add(
                    Web3.utils.toBN(this.props.personalPoolInfo.feeNumerator)
                  )
              )
              .div(Web3.utils.toBN(1000))
              .toString()}
          />{" "}
          REP)
        </Button>
      </form>
    );
  }
}

const withdraw = async ({
  poolAddress,
  account
}: {
  poolAddress: string,
  account: string
}) => {
  const web3 = await getPersonalWeb3();
  const pool = new web3.eth.Contract(poolAbi.Crowdsourcer, poolAddress);
  const receipt = await pool.methods
    .withdrawContribution()
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
})(WithdrawCard);
