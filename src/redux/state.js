// @flow

export type State = {|
  query: string
|};

function getInitialState(): State {
  return { query: "" };
}

export default getInitialState;
