// @flow

import nullthrows from "nullthrows";
import Web3 from "web3";

function waitForDocumentLoad(): Promise<void> {
  return new Promise(resolve => {
    const attemptResolve = () => {
      console.log("document ready state", document.readyState);
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
var personalCache: ?Promise<Web3> = null;

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

function getPersonalWeb3(): Promise<Web3> {
  const impl = async () => {
    await waitForDocumentLoad();
    console.log("document loaded");

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.ethereum !== "undefined") {
      // Use new MetaMask's provider
      console.log("Using new Metamask provider");
      return new Web3(window.ethereum);
    } else if (typeof window.web3 !== "undefined") {
      // Use Mist/MetaMask's provider
      return new Web3(window.web3.currentProvider);
    } else {
      console.log("metamask/mist not found, falling back to Infura");
      return await getPublicWeb3(1);
    }
  };

  if (personalCache == null) {
    personalCache = impl();
  }

  return personalCache;
}

export { getPublicWeb3, getPersonalWeb3 };
