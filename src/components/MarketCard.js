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
import Web3 from "web3";
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

  const sizeIfCurrentCrowdsourcer = () =>
    info.participants
      .map(p => Web3.utils.toBN(p.size))
      .reduce((x, y) => x.add(y), Web3.utils.toBN(0))
      .mul(Web3.utils.toBN(2))
      .sub(
        info.participants
          .filter(isOurParticipant)
          .map(p => Web3.utils.toBN(p.size))
          .reduce((x, y) => x.add(y), Web3.utils.toBN(0))
          .mul(Web3.utils.toBN(3))
      );

  const isTentativeWinning = () =>
    sizeIfCurrentCrowdsourcer().lte(Web3.utils.toBN(0));

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
                {participant != null ? (
                  isOurParticipant(participant) ? (
                    <span>
                      Completed round, filled <Amount size={participant.size} />{" "}
                      REP
                    </span>
                  ) : (
                    <span>Completed round, this outcome did not fill</span>
                  )
                ) : i === info.participants.length ? (
                  isTentativeWinning() ? (
                    "This is tentative winning outcome, can't dispute for it in this round"
                  ) : info.isCrowdsourcing ? (
                    <span>
                      Round is being filled now, filled{" "}
                      <Amount
                        size={info.currentRoundCrowdsourcers[outcomeIndex]}
                      />{" "}
                      REP out of{" "}
                      <Amount size={sizeIfCurrentCrowdsourcer().toString()} />{" "}
                      REP
                    </span>
                  ) : (
                    <span>
                      Round will open in the next dispute window, will accept{" "}
                      <Amount size={sizeIfCurrentCrowdsourcer().toString()} />{" "}
                      REP
                    </span>
                  )
                ) : (
                  "May start crowdsourcing in the future, if the previous rounds fill"
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
                      ? isTentativeWinning()
                        ? undefined
                        : info.isCrowdsourcing
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
