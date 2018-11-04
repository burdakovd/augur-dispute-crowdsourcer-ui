// @flow

import IERC20 from "augur-dispute-crowdsourcer/build/contracts/IERC20.json";
import Accounting from "augur-dispute-crowdsourcer/build/contracts/Accounting.json";
import Crowdsourcer from "augur-dispute-crowdsourcer/build/contracts/Crowdsourcer.json";
import CrowdsourcerFactory from "augur-dispute-crowdsourcer/build/contracts/CrowdsourcerFactory.json";

export default {
  Accounting: Accounting.abi,
  CrowdsourcerFactory: CrowdsourcerFactory.abi,
  Crowdsourcer: Crowdsourcer.abi,
  IERC20: IERC20.abi
};
