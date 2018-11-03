// @flow

import { Map as ImmMap } from "immutable";

export type State = {|
  query: string,
  network: ?number,
  searchResultsProgress: number,
  searchResults: ImmMap<number, ImmMap<string, SearchResults>>
|};

function getInitialState(): State {
  return {
    query: "",
    searchResultsProgress: 0,
    network: null,
    searchResults: ImmMap()
  };
}

export default getInitialState;
