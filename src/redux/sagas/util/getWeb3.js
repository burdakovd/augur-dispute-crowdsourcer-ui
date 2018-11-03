// @flow

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

var cache: ?Web3 = null;

async function getWeb3(): Promise<Web3> {
  if (cache !== null) {
    return cache;
  }

  await waitForDocumentLoad();

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window.web3 !== "undefined") {
    // Use Mist/MetaMask's provider
    cache = new Web3(window.web3.currentProvider);
  } else {
    console.log("No web3? You should consider trying MetaMask!");
    cache = new Web3(
      new Web3.providers.HttpProvider("https://mainnet.infura.io/augur")
    );
  }

  return cache;
}

export default getWeb3;
