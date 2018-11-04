// @flow

import React from "react";
import Panel from "react-bootstrap/lib/Panel";
import Table from "react-bootstrap/lib/Table";
import type { MarketInfo } from "../redux/actions/types";

const DisputePoolCard = ({
  market,
  round,
  outcomeIndex,
  marketInfo
}: {
  market: string,
  round: number,
  outcomeIndex: ?number,
  marketInfo: MarketInfo
}) => {
  return (
    <Panel bsStyle="primary">
      <Panel.Heading>
        <Panel.Title componentClass="h3">Dispute pool contract</Panel.Title>
      </Panel.Heading>
      <Table bordered>
        <tbody>
          <tr>
            <td>Factory address</td>
            <td>TBD</td>
          </tr>
          <tr>
            <td>Pool address</td>
            <td>TBD</td>
          </tr>
          <tr>
            <td>Pool holdings (funds usable for dispute)</td>
            <td>TBD</td>
          </tr>
          <tr>
            <td>Pool holdings (fees)</td>
            <td>TBD</td>
          </tr>
        </tbody>
      </Table>
    </Panel>
  );
};

export default DisputePoolCard;
