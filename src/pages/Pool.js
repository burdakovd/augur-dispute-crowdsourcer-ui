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
            </Col>
            <Col sm={12} lg={6}>
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
