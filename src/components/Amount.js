// @flow

import { Component } from "react";
import Web3 from "web3";

type Props = {|
  size: string
|};

class Amount extends Component<Props> {
  render() {
    return Web3.utils.fromWei(this.props.size);
  }
}

export default Amount;
