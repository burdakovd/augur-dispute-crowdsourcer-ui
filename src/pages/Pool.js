// @flow

import React, { Component, Fragment } from "react";
import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/lib/Row";
import Col from "react-bootstrap/lib/Col";
import { Map as ImmMap } from "immutable";
import { connect } from "react-redux";
import type { State } from "../redux/state";
import type { Dispatch, MarketInfo } from "../redux/actions/types";
import DisputePoolCard from "../components/DisputePoolCard";
import DisputeSummaryCard from "../components/DisputeSummaryCard";
import MarketCard from "../components/MarketCard";
import "./Pool.css";

type Props = {| info: MarketInfo, match: *, requestInfo: () => void |};

class Pool extends Component<Props> {
  render() {
    if (this.props.info != null && this.props.info.marketType === "SCALAR") {
      return "Scalar markets aren't supported by UI yet";
    }

    return (
      <Fragment>
        <Grid fluid className="pool-page">
          <Row>
            <Col sm={12} lg={6}>
              <DisputeSummaryCard
                market={this.props.match.params.market}
                round={Number.parseInt(this.props.match.params.round)}
                outcomeIndex={
                  this.props.match.params.outcome != null
                    ? Number.parseInt(this.props.match.params.outcome)
                    : null
                }
                marketInfo={this.props.info}
              />
              <MarketCard id={this.props.match.params.market} />
            </Col>
            <Col sm={12} lg={6}>
              <DisputePoolCard
                market={this.props.match.params.market}
                round={Number.parseInt(this.props.match.params.round)}
                outcomeIndex={
                  this.props.match.params.outcome != null
                    ? Number.parseInt(this.props.match.params.outcome)
                    : null
                }
                marketInfo={this.props.info}
              />
            </Col>
          </Row>
        </Grid>
        <PoolSubscriber
          market={this.props.match.params.market}
          round={Number.parseInt(this.props.match.params.round)}
          outcome={
            this.props.match.params.outcome != null
              ? Number.parseInt(this.props.match.params.outcome)
              : null
          }
        />
      </Fragment>
    );
  }

  componentDidMount() {
    if (!this.props.info) {
      this.props.requestInfo();
    }
  }

  componentDidUpdate() {
    if (!this.props.info) {
      this.props.requestInfo();
    }
  }
}

class PoolSubscriberInner extends Component<{
  network: ?number,
  market: string,
  round: number,
  outcome: ?number,
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
      this.props.market === prevProps.market &&
      this.props.round === prevProps.round &&
      this.props.outcome === prevProps.outcome
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
        type: "SUBSCRIBE_POOL_EVENTS",
        network: this.props.network,
        market: this.props.market,
        round: this.props.round,
        outcome: this.props.outcome
      });
    }
  }

  unsubscribe(props: *) {
    if (props.network != null) {
      props.dispatch({
        type: "UNSUBSCRIBE_POOL_EVENTS",
        network: props.network,
        market: props.market,
        round: props.round,
        outcome: props.outcome
      });
    }
  }
}

const PoolSubscriber = (connect: any)(
  (state: State) => ({ network: state.network }),
  dispatch => ({
    dispatch
  })
)(PoolSubscriberInner);

const mapStateToProps = (state: State, ownProps: *) => ({
  info:
    state.network == null
      ? null
      : state.marketInfo
          .get(state.network, ImmMap())
          .get(ownProps.match.params.market)
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: *) => {
  return {
    requestInfo: () =>
      dispatch({
        type: "MARKET_INFO_NEEDED",
        id: ownProps.match.params.market
      })
  };
};

const Container = (connect: any)(mapStateToProps, mapDispatchToProps)(Pool);

export default Container;
