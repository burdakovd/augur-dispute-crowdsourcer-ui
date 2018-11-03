// @flow

import React from "react";
import Panel from "react-bootstrap/lib/Panel";
import MarketName from "./MarketName";

const MarketCard = ({ id }: { id: string }) => {
  return (
    <Panel bsStyle="primary">
      <Panel.Heading>
        <Panel.Title componentClass="h3">
          <MarketName id={id} />
        </Panel.Title>
      </Panel.Heading>
      <Panel.Body>{id}</Panel.Body>
    </Panel>
  );
};

export default MarketCard;
