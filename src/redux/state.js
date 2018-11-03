// @flow

export type State = {|
  query: string,
  network: ?string
|};

function getInitialState(): State {
  return { query: "", network: null };
}

export default getInitialState;
