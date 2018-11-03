// @flow

import React from "react";
import Panel from "react-bootstrap/lib/Panel";
import Table from "react-bootstrap/lib/Table";
import type { MarketInfo } from "../redux/actions/types";

const DisputeSummaryCard = ({
  market,
  round,
  outcomeIndex,
  marketInfo
}: {
  market: string,
  round: number,
  outcomeIndex: ?number,
  marketInfo: MarketInfo
}) => (
  <Panel bsStyle="primary">
    <Panel.Heading>
      <Panel.Title componentClass="h3">
        Dispute round {round},{" "}
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
    <Table bordered className="dispute-round-details">
      <tbody>
        <tr>
          <td>Round start time</td>
          <td>TBD</td>
        </tr>
        <tr>
          <td>Round end time</td>
          <td>TBD</td>
        </tr>
        <tr>
          <td>Total size to fill in this round</td>
          <td>TBD</td>
        </tr>
        <tr>
          <td>Filled amount so far</td>
          <td>TBD</td>
        </tr>
      </tbody>
    </Table>
  </Panel>
);

export default DisputeSummaryCard;
