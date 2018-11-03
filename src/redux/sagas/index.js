// @flow

import { delay } from "redux-saga";
import { List as ImmList, Map as ImmMap } from "immutable";
import type { Action } from "../actions/types";
import {
  takeLatest,
  fork,
  all,
  call,
  put,
  select,
  cancel
} from "redux-saga/effects";
import getWeb3 from "./getWeb3";

function* showSearchProgress(): * {
  for (var i = 0; ; ++i) {
    yield call(delay, 200);
    yield put({
      type: "SEARCH_RESULTS_PROGRESS",
      progress: (i % 10) + 1
    });
  }
}

function* handleSearchQuery(): * {
  yield put({
    type: "SEARCH_RESULTS_PROGRESS",
    progress: 0
  });

  // wait before search in case the user is still typing
  yield call(delay, 200);

  const query = yield select(state => state.query);
  const network = yield select(state => state.network);

  const haveLocally = yield select(
    state =>
      state.searchResults.get(state.network, ImmMap()).get(state.query) != null
  );

  if (network == null || haveLocally) {
    return;
  }

  const progressReporter = yield fork(showSearchProgress);

  try {
    yield put({
      type: "SEARCH_RESULTS",
      network,
      query,
      results: ImmList.of(`test result for ${query}`)
    });
  } finally {
    yield cancel(progressReporter);
  }
}

function* initiateSearchQueries(): * {
  yield (takeLatest: any)(
    ["SEARCH_QUERY_CHANGED", "NETWORK_CHANGED"],
    handleSearchQuery
  );
}

function* handleWeb3Network(): * {
  const web3: Web3 = yield call(getWeb3);
  const network = yield call(() => web3.eth.net.getId());
  yield put({ type: "NETWORK_CHANGED", id: network });
}

function* root(): * {
  yield all([call(initiateSearchQueries), call(handleWeb3Network)]);
}

export default root;
