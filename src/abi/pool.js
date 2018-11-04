// @flow

import IERC20 from "augur-dispute-crowdsourcer/build/contracts/IERC20.json";
import Crowdsourcer from "augur-dispute-crowdsourcer/build/contracts/Crowdsourcer.json";
import CrowdsourcerFactory from "augur-dispute-crowdsourcer/build/contracts/CrowdsourcerFactory.json";

export default {
  CrowdsourcerFactory: CrowdsourcerFactory.abi,
  Crowdsourcer: Crowdsourcer.abi,
  IERC20: IERC20.abi
};
