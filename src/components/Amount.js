// @flow

import invariant from "invariant";
import { Component } from "react";
import Web3 from "web3";

type Props = {|
  size: string
|};

class Amount extends Component<Props> {
  render() {
    invariant(
      typeof this.props.size === "string",
      `size should be string, got ${typeof this.props.size}`
    );
    return Web3.utils.fromWei(this.props.size);
  }
}

export default Amount;
