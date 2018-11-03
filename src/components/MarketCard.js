// @flow

import type { State } from "../redux/state";
import { Map as ImmMap, List as ImmList, Range as ImmRange } from "immutable";
import React from "react";
import ButtonGroup from "react-bootstrap/lib/ButtonGroup";
import Button from "react-bootstrap/lib/Button";
import Panel from "react-bootstrap/lib/Panel";
import Table from "react-bootstrap/lib/Table";
import { connect } from "react-redux";
import MarketName from "./MarketName";

const MarketCard = ({ id, info }: { id: string, info: * }) => {
  return (
    <Panel bsStyle="primary">
      <Panel.Heading>
        <Panel.Title componentClass="h3">
          <MarketName id={id} />
        </Panel.Title>
      </Panel.Heading>
      <Panel.Body>
        Market ID: {id},{" "}
        {info != null ? info.marketType : "(market type unknown)"},{" "}
        <PredictionsGlobalLink id={id} />, <ReportersChatLink id={id} />
      </Panel.Body>
      <Table bordered>
        <thead>
          <tr>
            <th>Outcome</th>
            <th>Dispute rounds</th>
          </tr>
        </thead>
        <tbody>
          {info != null ? (
            ImmList(info.outcomes)
              .map(outcome => ({
                name: outcome,
                invalid: false
              }))
              .push({
                name: "INVALID",
                invalid: true
              })
              .map((outcome, index) => (
                <tr key={index}>
                  <td>
                    <span className={outcome.invalid ? "invalid-outcome" : ""}>
                      {outcome.name}
                    </span>
                  </td>
                  <td>
                    <DisputeRounds info={info} />
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={2}>Loading outcomes...</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Panel>
  );
};

const DisputeRounds = ({ info }) => {
  return (
    <div className="dispute-rounds">
      {ImmRange(0, info.numParticipants)
        .map(i => (
          <Button bsStyle="success" key={i}>
            {i}
          </Button>
        ))
        .toArray()}
    </div>
  );
};

const PredictionsGlobalLink = ({ id }) => {
  return (
    <a href={`https://predictions.global/augur-markets/${id}`}>
      Predictions.Global
    </a>
  );
};

const ReportersChatLink = ({ id }) => {
  return <a href={`https://reporters.chat/markets/${id}`}>Reporters.Chat</a>;
};

const mapStateToProps = (state: State, ownProps: *) => ({
  info:
    state.network == null
      ? null
      : state.marketInfo.get(state.network, ImmMap()).get(ownProps.id)
});

const Container = (connect: any)(mapStateToProps)(MarketCard);

export default Container;
