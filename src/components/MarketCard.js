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
      <Panel.Body>
        Market ID: {id}, <PredictionsGlobalLink id={id} />,{" "}
        <ReportersChatLink id={id} />
      </Panel.Body>
    </Panel>
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

export default MarketCard;
