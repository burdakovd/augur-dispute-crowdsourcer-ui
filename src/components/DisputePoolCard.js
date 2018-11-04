// @flow

import React from "react";
import Panel from "react-bootstrap/lib/Panel";
import Table from "react-bootstrap/lib/Table";
import AddressLink from "./AddressLink";
import { Map as ImmMap } from "immutable";
import type { MarketInfo } from "../redux/actions/types";
import type { State } from "../redux/state";
import { connect } from "react-redux";

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
            <td>
              <FactoryAddress />
            </td>
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

const FactoryAddress = connect((state: State) => ({
  network: state.network,
  address: ((state.contractAddresses || ImmMap()).get(state.network || 0) || {})
    .CrowdsourcerFactory
}))(
  ({ network, address }) =>
    network != null && address != null ? (
      <AddressLink address={address} network={network} />
    ) : (
      "Loading..."
    )
);

export default DisputePoolCard;
