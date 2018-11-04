// @flow

import nullthrows from "nullthrows";
import Web3 from "web3";

function waitForDocumentLoad(): Promise<void> {
  return new Promise(resolve => {
    const attemptResolve = () => {
      if (document.readyState === "complete") {
        resolve();
        return true;
      }
      return false;
    };

    if (!attemptResolve()) {
      (document: any).onreadystatechange = () => {
        attemptResolve();
      };
    }
  });
}

var publicCache = {};
var personalCache: ?Web3 = null;

async function getPublicWeb3(network: number): Promise<Web3> {
  if (publicCache[network] != null) {
    return publicCache[network];
  }

  publicCache[network] = new Web3(
    new Web3.providers.WebsocketProvider(
      nullthrows(
        {
          "1": "wss://mainnet.infura.io/ws",
          "4": "wss://rinkeby.infura.io/ws"
        }[`${network}`]
      )
    )
  );
  return nullthrows(publicCache[network]);
}

async function getPersonalWeb3(): Promise<Web3> {
  if (personalCache !== null) {
    return personalCache;
  }

  await waitForDocumentLoad();

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window.ethereum !== "undefined") {
    // Use new MetaMask's provider
    personalCache = new Web3(window.ethereum);
  } else if (typeof window.web3 !== "undefined") {
    // Use Mist/MetaMask's provider
    personalCache = new Web3(window.web3.currentProvider);
  } else {
    personalCache = await getPublicWeb3(1);
  }

  return personalCache;
}

export { getPublicWeb3, getPersonalWeb3 };
