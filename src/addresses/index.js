// @flow

import invariant from "invariant";
import mainnet from "./mainnet";
import rinkeby from "./rinkeby";
import type { Addresses } from "./types";

export type { Addresses } from "./types";

async function getContractAddresses(
  network: string | number
): Promise<Addresses> {
  if (network === "1" || network === 1) {
    return mainnet;
  }

  if (network === "4" || network === 4) {
    return rinkeby;
  }

  invariant(
    false,
    `Do not know how to get contract addresses for network ${network}`
  );
}

export default getContractAddresses;
