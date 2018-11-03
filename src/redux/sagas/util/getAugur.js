// @flow

import nullthrows from "nullthrows";
import { Map as ImmMap } from "immutable";
import Augur from "augur.js";

async function createAugur(network: number): Promise<Augur> {
  const augur = new Augur();

  const nodes = {
    "1": "wss://augur-node.augur.casino",
    "4": "wss://dev.augur.net/augur-node"
  };

  await new Promise((resolve, reject) =>
    augur.connect(
      { ethereumNode: {}, augurNode: nullthrows(nodes[network]) },
      (err, connectionInfo) => {
        if (err) {
          reject(err);
        } else {
          resolve(connectionInfo);
        }
      }
    )
  );

  return augur;
}

var pool = ImmMap();

async function getAugur(network: number): Promise<Augur> {
  if (!pool.get(network)) {
    const augur = createAugur(network);
    pool = pool.set(network, augur);
    return augur;
  } else {
    return nullthrows(pool.get(network));
  }
}

export default getAugur;
