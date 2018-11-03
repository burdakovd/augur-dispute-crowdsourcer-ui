// @flow

import type { Dispatch } from "../redux/actions/types";
import type { State } from "../redux/state";

import { Map as ImmMap } from "immutable";
import { Component } from "react";
import { connect } from "react-redux";

type Props = {|
  id: string,
  requestName: () => void,
  name: ?string
|};

class MarketName extends Component<Props> {
  render() {
    if (this.props.name != null) {
      return this.props.name;
    }
    return `Fetching name for ${this.props.id}...`;
  }

  componentDidMount() {
    if (!this.props.name) {
      this.props.requestName();
    }
  }

  componentDidUpdate() {
    if (!this.props.name) {
      this.props.requestName();
    }
  }
}

const mapStateToProps = (state: State, ownProps: *) => ({
  name:
    state.network == null
      ? null
      : state.marketInfo.get(state.network, ImmMap()).get(ownProps.id, {}).name
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: *) => {
  return {
    requestName: () =>
      dispatch({
        type: "MARKET_INFO_NEEDED",
        id: ownProps.id
      })
  };
};

const Container = (connect: any)(mapStateToProps, mapDispatchToProps)(
  MarketName
);

export default Container;
