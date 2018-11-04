// @flow

import nullthrows from "nullthrows";
import React, { Component } from "react";
import Button from "react-bootstrap/lib/Button";
import Panel from "react-bootstrap/lib/Panel";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import { Map as ImmMap } from "immutable";
import type { PersonalPoolInfo, PoolInfo } from "../redux/actions/types";
import poolAbi from "../abi/pool";
import type { State } from "../redux/state";
import { connect } from "react-redux";
import Web3 from "web3";
import { getPersonalWeb3 } from "../redux/sagas/util/getWeb3";

const ContributeCard = ({
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
        <Panel.Title componentClass="h3">Contribute</Panel.Title>
      </Panel.Heading>
      <Panel.Body>
        {poolInfo.state.disputeTokens != null ? (
          <p>It is not possible to contribute after dispute happened </p>
        ) : personalPoolInfo.contribution !== "0" ? (
          <p>
            It is not possible to contribute when there is an active
            contribution. You will need to withdraw first.{" "}
          </p>
        ) : (
          <div>
            <p>
              You can contribute into pool now, and when someone triggers the
              dispute on behalf of the pool, you'll get you share of dispute
              tokens.{" "}
            </p>
            <Form
              poolAddress={poolAddress}
              account={personalAddress}
              limit={personalPoolInfo.REPWithdrawalLimit}
            />
          </div>
        )}
      </Panel.Body>
    </Panel>
  ) : null;
};

class Form extends Component<
  { poolAddress: string, account: string, limit: string },
  { amount: string, price: string }
> {
  constructor(props: *) {
    super(props);
    this.state = { amount: "10", price: "1.1" };
  }

  render() {
    const needApproval = Web3.utils
      .toBN(
        Web3.utils.toWei(
          (
            Number.parseFloat(this.state.amount) *
              Number.parseFloat(this.state.price) || 0
          ).toString()
        )
      )
      .gt(Web3.utils.toBN(this.props.limit));

    return (
      <form>
        <FieldGroup
          id="amount"
          type="text"
          value={this.state.amount}
          onChange={e => this.setState({ amount: e.target.value })}
          label="How many dispute tokens you want to get"
        />
        <FieldGroup
          id="price"
          type="text"
          value={this.state.price}
          onChange={e => this.setState({ price: e.target.value })}
          label="At most how much REP are you willing to pay per dispute token (between 1.0 and 1.5), precision up to 0.001"
        />
        <Button
          disabled={!needApproval}
          onClick={() =>
            approveREP({
              account: this.props.account,
              poolAddress: this.props.poolAddress
            })
              .then(receipt =>
                alert(
                  `Transaction to approve pool to manage your REP has been confirmed: ${
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
          Approve pool to manage your REP
        </Button>
        <Button
          disabled={needApproval}
          onClick={() =>
            contribute({
              account: this.props.account,
              poolAddress: this.props.poolAddress,
              amount: Web3.utils.toWei(this.getAmount().toString()),
              feeNumerator: this.getFeeNumerator().toString()
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
          Send transaction (will charge{" "}
          {(Number.parseFloat(this.state.amount) *
            (1000 + this.getFeeNumerator())) /
            1000}{" "}
          REP, fee is {this.getFeeNumerator() / 10}
          %)
        </Button>
      </form>
    );
  }

  getAmount() {
    return Number.parseFloat(this.state.amount) || 0;
  }

  getFeeNumerator() {
    return Math.round(((Number.parseFloat(this.state.price) || 1) - 1) * 1000);
  }
}

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

const approveREP = async ({
  account,
  poolAddress
}: {
  account: string,
  poolAddress: string
}) => {
  const web3 = await getPersonalWeb3();
  const pool = new web3.eth.Contract(poolAbi.Crowdsourcer, poolAddress);
  const REP = await pool.methods
    .getREP()
    .call()
    .then(address => new web3.eth.Contract(poolAbi.IERC20, address));
  const receipt = await REP.methods
    .approve(poolAddress, web3.utils.toBN("2").pow(web3.utils.toBN("255")))
    .send({ from: account });
  console.log(receipt);
  return receipt;
};

const contribute = async ({
  poolAddress,
  account,
  amount,
  feeNumerator
}: {
  poolAddress: string,
  account: string,
  amount: string,
  feeNumerator: string
}) => {
  const web3 = await getPersonalWeb3();
  const pool = new web3.eth.Contract(poolAbi.Crowdsourcer, poolAddress);
  const receipt = await pool.methods
    .contribute(amount, feeNumerator)
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
})(ContributeCard);
