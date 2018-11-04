// @flow

import nullthrows from "nullthrows";
import React, { Fragment, Component } from "react";
import Panel from "react-bootstrap/lib/Panel";
import Table from "react-bootstrap/lib/Table";
import { Map as ImmMap } from "immutable";
import type { Dispatch, PersonalPoolInfo } from "../redux/actions/types";
import type { State } from "../redux/state";
import { connect } from "react-redux";
import Web3 from "web3";
import Amount from "./Amount";

const PoolPersonalAccountingCard = ({
  personalAddress,
  poolAddress,
  poolInfo
}: {
  personalAddress: ?string,
  poolAddress: ?string,
  poolInfo: ?PersonalPoolInfo
}) => {
  return (
    <Fragment>
      <PersonalAddressFetcher />
      {poolAddress != null && personalAddress != null ? (
        <Fragment>
          <Panel bsStyle="primary">
            <Panel.Heading>
              <Panel.Title componentClass="h3">
                Your contribution ({personalAddress})
              </Panel.Title>
            </Panel.Heading>
            {poolInfo == null ? null : (
              <Table bordered>
                <tbody>
                  <tr>
                    <td>
                      Contribution (not including fee). How many dispute tokens
                      you are bidding for.
                    </td>
                    <td>
                      <Amount size={poolInfo.contribution} /> REP
                    </td>
                  </tr>
                  <tr>
                    <td>Chosen fee</td>
                    <td>
                      {Number.parseInt(poolInfo.feeNumerator) / 10}% (+
                      <Amount
                        size={Web3.utils
                          .toBN(poolInfo.contribution)
                          .mul(Web3.utils.toBN(poolInfo.feeNumerator))
                          .div(Web3.utils.toBN(1000))}
                      />{" "}
                      REP)
                    </td>
                  </tr>
                  <tr>
                    <td>Whether you have withdrawn proceeds (after dispute)</td>
                    <td>{poolInfo.hasWithdrawnProceeds ? "YES" : "NO"}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Panel>
          <PersonalPoolSubscriber
            pool={poolAddress}
            account={personalAddress}
          />
        </Fragment>
      ) : null}
    </Fragment>
  );
};

class PersonalAddressFetcherInner extends React.Component<*> {
  render() {
    return <Fragment />;
  }

  componentDidMount() {
    this.props.fetch();
  }
}

const PersonalAddressFetcher = (connect: any)(
  state => ({}),
  dispatch => ({
    fetch: () =>
      dispatch({
        type: "NEED_PERSONAL_ADDRESS"
      })
  })
)(PersonalAddressFetcherInner);

class PersonalPoolSubscriberInner extends Component<{
  network: ?number,
  account: string,
  pool: string,
  dispatch: Dispatch
}> {
  render() {
    return <Fragment />;
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.network === prevProps.network &&
      this.props.account === prevProps.account &&
      this.props.pool === prevProps.pool
    ) {
      return;
    }

    this.unsubscribe(prevProps);
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe(this.props);
  }

  subscribe() {
    if (this.props.network != null) {
      this.props.dispatch({
        type: "SUBSCRIBE_PERSONAL_POOL_EVENTS",
        network: this.props.network,
        account: this.props.account,
        pool: this.props.pool
      });
    }
  }

  unsubscribe(props: *) {
    if (props.network != null) {
      props.dispatch({
        type: "UNSUBSCRIBE_PERSONAL_POOL_EVENTS",
        network: props.network,
        account: props.account,
        pool: props.pool
      });
    }
  }
}

const PersonalPoolSubscriber = (connect: any)(
  (state: State) => ({ network: state.network }),
  dispatch => ({
    dispatch
  })
)(PersonalPoolSubscriberInner);

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
      state.network == null ||
      state.personalAddress == null ||
      poolAddress == null
        ? null
        : state.personalPoolInfo
            .get(state.network, ImmMap())
            .get(nullthrows(state.personalAddress), ImmMap())
            .get(poolAddress)
  };
})(PoolPersonalAccountingCard);
