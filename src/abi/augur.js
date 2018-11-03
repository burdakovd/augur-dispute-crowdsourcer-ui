// @flow

import AugurCoreLatestABI from "augur-core/output/contracts/abi.json";

// copied from etherscan 0x75228dce4d82566d93068a8d5d49435216551599
const Augur = [
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_reporter", type: "address" },
      { name: "_market", type: "address" },
      { name: "_amountRedeemed", type: "uint256" },
      { name: "_repReceived", type: "uint256" },
      { name: "_reportingFeesReceived", type: "uint256" },
      { name: "_payoutNumerators", type: "uint256[]" }
    ],
    name: "logDisputeCrowdsourcerRedeemed",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_topic", type: "bytes32" },
      { name: "_description", type: "string" },
      { name: "_extraInfo", type: "string" },
      { name: "_universe", type: "address" },
      { name: "_market", type: "address" },
      { name: "_marketCreator", type: "address" },
      { name: "_outcomes", type: "bytes32[]" },
      { name: "_minPrice", type: "int256" },
      { name: "_maxPrice", type: "int256" },
      { name: "_marketType", type: "uint8" }
    ],
    name: "logMarketCreated",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_orderType", type: "uint8" },
      { name: "_amount", type: "uint256" },
      { name: "_price", type: "uint256" },
      { name: "_creator", type: "address" },
      { name: "_moneyEscrowed", type: "uint256" },
      { name: "_sharesEscrowed", type: "uint256" },
      { name: "_tradeGroupId", type: "bytes32" },
      { name: "_orderId", type: "bytes32" },
      { name: "_universe", type: "address" },
      { name: "_shareToken", type: "address" }
    ],
    name: "logOrderCreated",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_target", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "logDisputeCrowdsourcerTokensBurned",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_market", type: "address" }
    ],
    name: "logReportingParticipantDisavowed",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_market", type: "address" },
      { name: "_originalUniverse", type: "address" }
    ],
    name: "logMarketMigrated",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" }
    ],
    name: "logMarketTransferred",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_target", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "logFeeTokenMinted",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_universe", type: "address" }],
    name: "logMarketFinalized",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getController",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_market", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" }
    ],
    name: "logMarketMailboxTransferred",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "logFeeTokenTransferred",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_reporter", type: "address" },
      { name: "_amountRedeemed", type: "uint256" },
      { name: "_reportingFeesReceived", type: "uint256" }
    ],
    name: "logFeeWindowRedeemed",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_target", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "logReputationTokenBurned",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "logUniverseForked",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_market", type: "address" },
      { name: "_disputeCrowdsourcer", type: "address" }
    ],
    name: "logDisputeCrowdsourcerCompleted",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "logDisputeCrowdsourcerTokensTransferred",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_reporter", type: "address" },
      { name: "_market", type: "address" },
      { name: "_disputeCrowdsourcer", type: "address" },
      { name: "_amountStaked", type: "uint256" }
    ],
    name: "logDisputeCrowdsourcerContribution",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_target", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "logFeeWindowBurned",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_shareToken", type: "address" },
      { name: "_sender", type: "address" },
      { name: "_market", type: "address" },
      { name: "_numShares", type: "uint256" },
      { name: "_numPayoutTokens", type: "uint256" },
      { name: "_finalTokenBalance", type: "uint256" }
    ],
    name: "logTradingProceedsClaimed",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_target", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "logFeeWindowMinted",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_shareToken", type: "address" },
      { name: "_sender", type: "address" },
      { name: "_orderId", type: "bytes32" },
      { name: "_orderType", type: "uint8" },
      { name: "_tokenRefund", type: "uint256" },
      { name: "_sharesRefund", type: "uint256" }
    ],
    name: "logOrderCanceled",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_reporter", type: "address" },
      { name: "_market", type: "address" },
      { name: "_amountStaked", type: "uint256" },
      { name: "_isDesignatedReporter", type: "bool" },
      { name: "_payoutNumerators", type: "uint256[]" },
      { name: "_invalid", type: "bool" }
    ],
    name: "logInitialReportSubmitted",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "logFeeWindowTransferred",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_target", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "logReputationTokenMinted",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_market", type: "address" },
      { name: "_disputeCrowdsourcer", type: "address" },
      { name: "_payoutNumerators", type: "uint256[]" },
      { name: "_size", type: "uint256" },
      { name: "_invalid", type: "bool" }
    ],
    name: "disputeCrowdsourcerCreated",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_shareToken", type: "address" },
      { name: "_filler", type: "address" },
      { name: "_orderId", type: "bytes32" },
      { name: "_numCreatorShares", type: "uint256" },
      { name: "_numCreatorTokens", type: "uint256" },
      { name: "_numFillerShares", type: "uint256" },
      { name: "_numFillerTokens", type: "uint256" },
      { name: "_marketCreatorFees", type: "uint256" },
      { name: "_reporterFees", type: "uint256" },
      { name: "_amountFilled", type: "uint256" },
      { name: "_tradeGroupId", type: "bytes32" }
    ],
    name: "logOrderFilled",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "logShareTokensTransferred",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_parentPayoutDistributionHash", type: "bytes32" },
      { name: "_parentPayoutNumerators", type: "uint256[]" },
      { name: "_parentInvalid", type: "bool" }
    ],
    name: "createChildUniverse",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_universe", type: "address" }],
    name: "isKnownUniverse",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_feeWindow", type: "address" },
      { name: "_id", type: "uint256" }
    ],
    name: "logFeeWindowCreated",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_controller", type: "address" }],
    name: "setController",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "createGenesisUniverse",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_target", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "logFeeTokenBurned",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_target", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "logShareTokenBurned",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_target", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "logShareTokenMinted",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_isOn", type: "bool" }],
    name: "logEscapeHatchChanged",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_target", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "logDisputeCrowdsourcerTokensMinted",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_crowdsourcer", type: "address" }],
    name: "isKnownCrowdsourcer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_topic", type: "bytes32" },
      { name: "_description", type: "string" },
      { name: "_extraInfo", type: "string" },
      { name: "_universe", type: "address" },
      { name: "_market", type: "address" },
      { name: "_marketCreator", type: "address" },
      { name: "_minPrice", type: "int256" },
      { name: "_maxPrice", type: "int256" },
      { name: "_marketType", type: "uint8" }
    ],
    name: "logMarketCreated",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_market", type: "address" },
      { name: "_account", type: "address" },
      { name: "_numCompleteSets", type: "uint256" }
    ],
    name: "logCompleteSetsPurchased",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_universe", type: "address" }],
    name: "logMarketParticipantsDisavowed",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newTimestamp", type: "uint256" }],
    name: "logTimestampSet",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_market", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" }
    ],
    name: "logInitialReporterTransferred",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_reporter", type: "address" },
      { name: "_market", type: "address" },
      { name: "_amountRedeemed", type: "uint256" },
      { name: "_repReceived", type: "uint256" },
      { name: "_reportingFeesReceived", type: "uint256" },
      { name: "_payoutNumerators", type: "uint256[]" }
    ],
    name: "logInitialReporterRedeemed",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "trustedTransfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "logReputationTokensTransferred",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_universe", type: "address" },
      { name: "_market", type: "address" },
      { name: "_account", type: "address" },
      { name: "_numCompleteSets", type: "uint256" }
    ],
    name: "logCompleteSetsSold",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "topic", type: "bytes32" },
      { indexed: false, name: "description", type: "string" },
      { indexed: false, name: "extraInfo", type: "string" },
      { indexed: true, name: "universe", type: "address" },
      { indexed: false, name: "market", type: "address" },
      { indexed: true, name: "marketCreator", type: "address" },
      { indexed: false, name: "outcomes", type: "bytes32[]" },
      { indexed: false, name: "marketCreationFee", type: "uint256" },
      { indexed: false, name: "minPrice", type: "int256" },
      { indexed: false, name: "maxPrice", type: "int256" },
      { indexed: false, name: "marketType", type: "uint8" }
    ],
    name: "MarketCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "reporter", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: false, name: "amountStaked", type: "uint256" },
      { indexed: false, name: "isDesignatedReporter", type: "bool" },
      { indexed: false, name: "payoutNumerators", type: "uint256[]" },
      { indexed: false, name: "invalid", type: "bool" }
    ],
    name: "InitialReportSubmitted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: false, name: "disputeCrowdsourcer", type: "address" },
      { indexed: false, name: "payoutNumerators", type: "uint256[]" },
      { indexed: false, name: "size", type: "uint256" },
      { indexed: false, name: "invalid", type: "bool" }
    ],
    name: "DisputeCrowdsourcerCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "reporter", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: false, name: "disputeCrowdsourcer", type: "address" },
      { indexed: false, name: "amountStaked", type: "uint256" }
    ],
    name: "DisputeCrowdsourcerContribution",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: false, name: "disputeCrowdsourcer", type: "address" }
    ],
    name: "DisputeCrowdsourcerCompleted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "reporter", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: false, name: "amountRedeemed", type: "uint256" },
      { indexed: false, name: "repReceived", type: "uint256" },
      { indexed: false, name: "reportingFeesReceived", type: "uint256" },
      { indexed: false, name: "payoutNumerators", type: "uint256[]" }
    ],
    name: "InitialReporterRedeemed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "reporter", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: false, name: "disputeCrowdsourcer", type: "address" },
      { indexed: false, name: "amountRedeemed", type: "uint256" },
      { indexed: false, name: "repReceived", type: "uint256" },
      { indexed: false, name: "reportingFeesReceived", type: "uint256" },
      { indexed: false, name: "payoutNumerators", type: "uint256[]" }
    ],
    name: "DisputeCrowdsourcerRedeemed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: false, name: "reportingParticipant", type: "address" }
    ],
    name: "ReportingParticipantDisavowed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "market", type: "address" }
    ],
    name: "MarketParticipantsDisavowed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "reporter", type: "address" },
      { indexed: true, name: "feeWindow", type: "address" },
      { indexed: false, name: "amountRedeemed", type: "uint256" },
      { indexed: false, name: "reportingFeesReceived", type: "uint256" }
    ],
    name: "FeeWindowRedeemed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "market", type: "address" }
    ],
    name: "MarketFinalized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "market", type: "address" },
      { indexed: true, name: "originalUniverse", type: "address" },
      { indexed: true, name: "newUniverse", type: "address" }
    ],
    name: "MarketMigrated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "universe", type: "address" }],
    name: "UniverseForked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "parentUniverse", type: "address" },
      { indexed: true, name: "childUniverse", type: "address" },
      { indexed: false, name: "payoutNumerators", type: "uint256[]" },
      { indexed: false, name: "invalid", type: "bool" }
    ],
    name: "UniverseCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "shareToken", type: "address" },
      { indexed: true, name: "sender", type: "address" },
      { indexed: false, name: "orderId", type: "bytes32" },
      { indexed: false, name: "orderType", type: "uint8" },
      { indexed: false, name: "tokenRefund", type: "uint256" },
      { indexed: false, name: "sharesRefund", type: "uint256" }
    ],
    name: "OrderCanceled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "orderType", type: "uint8" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "price", type: "uint256" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "moneyEscrowed", type: "uint256" },
      { indexed: false, name: "sharesEscrowed", type: "uint256" },
      { indexed: false, name: "tradeGroupId", type: "bytes32" },
      { indexed: false, name: "orderId", type: "bytes32" },
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "shareToken", type: "address" }
    ],
    name: "OrderCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "shareToken", type: "address" },
      { indexed: false, name: "filler", type: "address" },
      { indexed: false, name: "orderId", type: "bytes32" },
      { indexed: false, name: "numCreatorShares", type: "uint256" },
      { indexed: false, name: "numCreatorTokens", type: "uint256" },
      { indexed: false, name: "numFillerShares", type: "uint256" },
      { indexed: false, name: "numFillerTokens", type: "uint256" },
      { indexed: false, name: "marketCreatorFees", type: "uint256" },
      { indexed: false, name: "reporterFees", type: "uint256" },
      { indexed: false, name: "amountFilled", type: "uint256" },
      { indexed: false, name: "tradeGroupId", type: "bytes32" }
    ],
    name: "OrderFilled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: true, name: "account", type: "address" },
      { indexed: false, name: "numCompleteSets", type: "uint256" }
    ],
    name: "CompleteSetsPurchased",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: true, name: "account", type: "address" },
      { indexed: false, name: "numCompleteSets", type: "uint256" }
    ],
    name: "CompleteSetsSold",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "shareToken", type: "address" },
      { indexed: true, name: "sender", type: "address" },
      { indexed: false, name: "market", type: "address" },
      { indexed: false, name: "numShares", type: "uint256" },
      { indexed: false, name: "numPayoutTokens", type: "uint256" },
      { indexed: false, name: "finalTokenBalance", type: "uint256" }
    ],
    name: "TradingProceedsClaimed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "token", type: "address" },
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
      { indexed: false, name: "tokenType", type: "uint8" },
      { indexed: false, name: "market", type: "address" }
    ],
    name: "TokensTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "token", type: "address" },
      { indexed: true, name: "target", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "tokenType", type: "uint8" },
      { indexed: false, name: "market", type: "address" }
    ],
    name: "TokensMinted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "token", type: "address" },
      { indexed: true, name: "target", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "tokenType", type: "uint8" },
      { indexed: false, name: "market", type: "address" }
    ],
    name: "TokensBurned",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: false, name: "feeWindow", type: "address" },
      { indexed: false, name: "startTime", type: "uint256" },
      { indexed: false, name: "endTime", type: "uint256" },
      { indexed: false, name: "id", type: "uint256" }
    ],
    name: "FeeWindowCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: false, name: "from", type: "address" },
      { indexed: false, name: "to", type: "address" }
    ],
    name: "InitialReporterTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: false, name: "from", type: "address" },
      { indexed: false, name: "to", type: "address" }
    ],
    name: "MarketTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "universe", type: "address" },
      { indexed: true, name: "market", type: "address" },
      { indexed: true, name: "mailbox", type: "address" },
      { indexed: false, name: "from", type: "address" },
      { indexed: false, name: "to", type: "address" }
    ],
    name: "MarketMailboxTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "isOn", type: "bool" }],
    name: "EscapeHatchChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "newTimestamp", type: "uint256" }],
    name: "TimestampSet",
    type: "event"
  }
];

// coped from etherscan for 0xe991247b78f937d7b69cfc00f1a487a293557677
const Universe = [
  {
    constant: false,
    inputs: [{ name: "_amount", type: "uint256" }],
    name: "incrementOpenInterestFromMarket",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getOrCreateNextFeeWindow",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_amount", type: "uint256" }],
    name: "decrementOpenInterestFromMarket",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getRepMarketCapInAttoeth",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getOrCreatePreviousFeeWindow",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_shadyFeeToken", type: "address" }],
    name: "isContainerForFeeToken",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getController",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getDisputeRoundDurationInSeconds",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_feeWindowId", type: "uint256" }],
    name: "getFeeWindow",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "fork",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getTargetRepMarketCapInAttoeth",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getOrCreatePreviousPreviousFeeWindow",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_shadyShareToken", type: "address" }],
    name: "isContainerForShareToken",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_attotokens", type: "uint256" }],
    name: "buyParticipationTokens",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_badMarkets", type: "uint256" },
      { name: "_totalMarkets", type: "uint256" },
      { name: "_targetDivisor", type: "uint256" },
      { name: "_previousValue", type: "uint256" },
      { name: "_defaultValue", type: "uint256" },
      { name: "_floor", type: "uint256" }
    ],
    name: "calculateFloatingValue",
    outputs: [{ name: "_newValue", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getInitialReportMinValue",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getOrCreateCurrentFeeWindow",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getOpenInterestInAttoEth",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getPreviousFeeWindow",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getWinningChildUniverse",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_endTime", type: "uint256" },
      { name: "_feePerEthInWei", type: "uint256" },
      { name: "_denominationToken", type: "address" },
      { name: "_designatedReporterAddress", type: "address" },
      { name: "_minPrice", type: "int256" },
      { name: "_maxPrice", type: "int256" },
      { name: "_numTicks", type: "uint256" },
      { name: "_topic", type: "bytes32" },
      { name: "_description", type: "string" },
      { name: "_extraInfo", type: "string" }
    ],
    name: "createScalarMarket",
    outputs: [{ name: "_newMarket", type: "address" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "removeMarketFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getForkEndTime",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getCurrentFeeWindow",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getForkReputationGoal",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_reportingParticipants", type: "address[]" },
      { name: "_feeWindows", type: "address[]" }
    ],
    name: "redeemStake",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getOrCacheReportingFeeDivisor",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_controller", type: "address" }],
    name: "setController",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_shadyChild", type: "address" }],
    name: "isParentOf",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "updateForkValues",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_shadyMarket", type: "address" }],
    name: "isContainerForMarket",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getParentUniverse",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_timestamp", type: "uint256" }],
    name: "getFeeWindowByTimestamp",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getOrCacheValidityBond",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getInitialReportStakeSize",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_amount", type: "uint256" }],
    name: "decrementOpenInterest",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_timestamp", type: "uint256" }],
    name: "getOrCreateFeeWindowByTimestamp",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getReputationToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_parentUniverse", type: "address" },
      { name: "_parentPayoutDistributionHash", type: "bytes32" }
    ],
    name: "initialize",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isForking",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "controllerLookupName",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getParentPayoutDistributionHash",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_shadyFeeWindow", type: "address" }],
    name: "isContainerForFeeWindow",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_endTime", type: "uint256" },
      { name: "_feePerEthInWei", type: "uint256" },
      { name: "_denominationToken", type: "address" },
      { name: "_designatedReporterAddress", type: "address" },
      { name: "_topic", type: "bytes32" },
      { name: "_description", type: "string" },
      { name: "_extraInfo", type: "string" }
    ],
    name: "createYesNoMarket",
    outputs: [{ name: "_newMarket", type: "address" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getForkingMarket",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_amount", type: "uint256" }],
    name: "incrementOpenInterest",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_endTime", type: "uint256" },
      { name: "_feePerEthInWei", type: "uint256" },
      { name: "_denominationToken", type: "address" },
      { name: "_designatedReporterAddress", type: "address" },
      { name: "_outcomes", type: "bytes32[]" },
      { name: "_topic", type: "bytes32" },
      { name: "_description", type: "string" },
      { name: "_extraInfo", type: "string" }
    ],
    name: "createCategoricalMarket",
    outputs: [{ name: "_newMarket", type: "address" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_timestamp", type: "uint256" }],
    name: "getFeeWindowId",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getTypeName",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_parentPayoutNumerators", type: "uint256[]" },
      { name: "_parentInvalid", type: "bool" }
    ],
    name: "createChildUniverse",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_feeWindow", type: "address" }],
    name: "getOrCreateFeeWindowBefore",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getOrCacheDesignatedReportStake",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getOrCacheMarketCreationCost",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_parentPayoutDistributionHash", type: "bytes32" }],
    name: "getChildUniverse",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getNextFeeWindow",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getInitialized",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_parentPayoutDistributionHash", type: "bytes32" }],
    name: "updateTentativeWinningChildUniverse",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_shadyReportingParticipant", type: "address" }],
    name: "isContainerForReportingParticipant",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getDisputeThresholdForFork",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getOrCacheDesignatedReportNoShowBond",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "addMarketTo",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

export default { Augur, Universe, Market: AugurCoreLatestABI.Market };
