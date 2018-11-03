// @flow

import type { State } from "../redux/state";
import { Map as ImmMap, List as ImmList, Range as ImmRange } from "immutable";
import nullthrows from "nullthrows";
import { LinkContainer } from "react-router-bootstrap";
import React from "react";
import Tooltip from "react-bootstrap/lib/Tooltip";
import OverlayTrigger from "react-bootstrap/lib/OverlayTrigger";
import Button from "react-bootstrap/lib/Button";
import Panel from "react-bootstrap/lib/Panel";
import Table from "react-bootstrap/lib/Table";
import { connect } from "react-redux";
import Amount from "./Amount";
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
      <Table bordered className="market-card">
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
                  <td className="outcome">
                    <span className={outcome.invalid ? "invalid-outcome" : ""}>
                      {outcome.name}
                    </span>
                  </td>
                  <td>
                    <DisputeRounds
                      id={id}
                      outcomeIndex={index}
                      outcome={outcome}
                      info={info}
                    />
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

const DisputeRounds = ({ id, outcomeIndex, outcome, info }) => {
  const isOurParticipant = participant =>
    participant.outcome != null &&
    outcome.invalid === participant.outcome.invalid &&
    outcome.name === participant.outcome.name;

  // TODO: show max size (for current round and others)
  // TODO: hightlight inability to dispute for winning outcome
  return (
    <div className="dispute-rounds">
      {ImmRange(0, info.participants.length + 3)
        .map(i => [
          i,
          i < info.participants.length ? info.participants[i] : null
        ])
        .map(([i, participant]) => (
          <OverlayTrigger
            key={i}
            placement="top"
            overlay={
              <Tooltip id="tooltip">
                contribution:{" "}
                {participant != null ? (
                  <span>
                    filled{" "}
                    <Amount
                      size={
                        isOurParticipant(participant) ? participant.size : "0"
                      }
                    />{" "}
                    REP
                  </span>
                ) : i < info.participants.length ? (
                  isOurParticipant(nullthrows(participant)) ? (
                    "filled"
                  ) : (
                    "not filled"
                  )
                ) : i === info.participants.length ? (
                  info.isCrowdsourcing ? (
                    "crowdsourcing now"
                  ) : (
                    "will start crowdsourcing next round"
                  )
                ) : (
                  "may start crowdsourcing in the future"
                )}
              </Tooltip>
            }
          >
            <LinkContainer
              to={
                outcome.invalid
                  ? `/${id}/${i}/invalid`
                  : `/${id}/${i}/valid/${outcomeIndex}`
              }
            >
              <Button
                bsStyle={
                  participant != null
                    ? isOurParticipant(nullthrows(participant))
                      ? "success"
                      : undefined
                    : i === info.participants.length
                      ? info.isCrowdsourcing
                        ? "warning"
                        : "primary"
                      : "link"
                }
              >
                {i}
              </Button>
            </LinkContainer>
          </OverlayTrigger>
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
