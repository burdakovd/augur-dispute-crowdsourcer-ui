// @flow

import React from "react";

const AddressLink = ({
  address,
  network
}: {
  address: string,
  network: number
}) => {
  return (
    <a
      href={`https://${
        { "1": "", "4": "rinkeby." }[network.toString()]
      }etherscan.io/address/${address}`}
    >
      {address}
    </a>
  );
};

export default AddressLink;
