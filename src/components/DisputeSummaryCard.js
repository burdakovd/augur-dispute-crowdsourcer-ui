// @flow

import nullthrows from "nullthrows";
import React from "react";
import Panel from "react-bootstrap/lib/Panel";
import Table from "react-bootstrap/lib/Table";
import Web3 from "web3";
import moment from "moment";
import { connect } from "react-redux";
import Amount from "./Amount";
import type { MarketInfo, PoolInfo } from "../redux/actions/types";
import type { State } from "../redux/state";

const DisputeSummaryCard = ({
  market,
  round,
  outcomeIndex,
  marketInfo,
  poolInfo
}: {
  market: string,
  round: number,
  outcomeIndex: ?number,
  marketInfo: MarketInfo,
  poolInfo: PoolInfo
}) => {
  const isOurParticipant = participant =>
    participant.outcome != null &&
    (participant.outcome.invalid
      ? outcomeIndex == null
      : outcomeIndex != null &&
        participant.outcome.name ===
          nullthrows(marketInfo).outcomes[outcomeIndex]);

  return (
    <Panel bsStyle="primary">
      <Panel.Heading>
        <Panel.Title componentClass="h3">
          Augur dispute round {round},{" "}
          {outcomeIndex != null ? (
            <span>
              for outcome:{" "}
              <em>
                {marketInfo != null
                  ? marketInfo.outcomes[outcomeIndex]
                  : `(id: ${outcomeIndex}, fetching outcome name)`}
              </em>
            </span>
          ) : (
            <span>
              for market being <b className="invalid-outcome">INVALID</b>
            </span>
          )}{" "}
        </Panel.Title>
      </Panel.Heading>
      <Table bordered>
        <tbody>
          <tr>
            <td>Round start time</td>
            <td>
              {poolInfo != null
                ? moment.unix(poolInfo.startTime).toISOString()
                : "loading..."}
            </td>
          </tr>
          <tr>
            <td>Round end time</td>
            <td>
              {poolInfo != null
                ? moment.unix(poolInfo.endTime).toISOString()
                : "loading..."}
            </td>
          </tr>
          <tr>
            <td>Total size to fill in this round</td>
            <td>
              {marketInfo != null ? (
                round < marketInfo.participants.length ? (
                  isOurParticipant(marketInfo.participants[round]) ? (
                    <span>
                      <Amount size={marketInfo.participants[round].size} /> REP
                    </span>
                  ) : (
                    <em>
                      (unknown/irrelevant, this is past round that did not win)
                    </em>
                  )
                ) : round === marketInfo.participants.length ? (
                  <span>
                    <Amount
                      size={marketInfo.participants
                        .map(p => Web3.utils.toBN(p.size))
                        .reduce((x, y) => x.add(y), Web3.utils.toBN(0))
                        .mul(Web3.utils.toBN(2))
                        .sub(
                          marketInfo.participants
                            .filter(isOurParticipant)
                            .map(p => Web3.utils.toBN(p.size))
                            .reduce((x, y) => x.add(y), Web3.utils.toBN(0))
                            .mul(Web3.utils.toBN(3))
                        )
                        .toString()}
                    />{" "}
                    REP
                  </span>
                ) : (
                  <em>Unknown, depends on how previous rounds go</em>
                )
              ) : (
                "loading..."
              )}
            </td>
          </tr>
          <tr>
            <td>Filled amount so far</td>
            <td>
              {marketInfo != null ? (
                round < marketInfo.participants.length ? (
                  isOurParticipant(marketInfo.participants[round]) ? (
                    <span>
                      <Amount size={marketInfo.participants[round].size} /> REP
                    </span>
                  ) : (
                    <em>
                      (unknown/irrelevant, this is past round that did not win)
                    </em>
                  )
                ) : round === marketInfo.participants.length &&
                marketInfo.isCrowdsourcing ? (
                  <span>
                    <Amount
                      size={
                        marketInfo.currentRoundCrowdsourcers[
                          outcomeIndex == null
                            ? marketInfo.outcomes.length
                            : outcomeIndex
                        ]
                      }
                    />{" "}
                    REP
                  </span>
                ) : (
                  "0 REP (round has not started yet)"
                )
              ) : (
                "loading..."
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </Panel>
  );
};

const mapStateToProps = (state: State, ownProps: *) => ({
  poolInfo:
    state.network == null
      ? null
      : state.poolInfo.get(
          `${state.network}:${ownProps.market}:${ownProps.round}:${
            ownProps.outcomeIndex == null ? "-1" : ownProps.outcomeIndex
          }`
        )
});

const Container = (connect: any)(mapStateToProps)(DisputeSummaryCard);

export default Container;
