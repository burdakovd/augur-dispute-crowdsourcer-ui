// @flow

import { delay } from "redux-saga";
import { List as ImmList, Map as ImmMap, Set as ImmSet } from "immutable";
import {
  takeLatest,
  fork,
  call,
  put,
  select,
  cancel
} from "redux-saga/effects";
import getAugur from "./util/getAugur";
import getWeb3 from "./util/getWeb3";

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
    const web3 = yield call(getWeb3);

    const extraMarkets = yield call(async () => {
      try {
        const augur = await getAugur(network);
        const syncData = await new Promise((resolve, reject) =>
          augur.augurNode.getSyncData(function(error, result) {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          })
        );
        return await Promise.all(
          ["CROWDSOURCING_DISPUTE", "AWAITING_NEXT_WINDOW"].map(
            state =>
              new Promise((resolve, reject) =>
                augur.markets.getMarkets(
                  {
                    universe: syncData.addresses.Universe,
                    search: query === "" ? undefined : query,
                    reportingState: state
                  },
                  function(error, result) {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(result);
                    }
                  }
                )
              )
          )
        );
      } catch (Error) {
        return [];
      }
    });

    const merge = arrays => {
      // merge somewhat fairly
      var seen = ImmSet();
      var merged = ImmList();

      const handle = address => {
        if (!seen.contains(address)) {
          seen = seen.add(address);
          merged = merged.push(address);
        }
      };

      for (var i = 0; ; ++i) {
        var shouldStop = true;
        for (var set of arrays) {
          if (set.length > i) {
            handle(set[i]);
            shouldStop = false;
          }
        }
        if (shouldStop) {
          break;
        }
      }

      return merged;
    };

    yield put({
      type: "SEARCH_RESULTS",
      network,
      query,
      results: merge([
        web3.utils.isAddress(query) ? [query] : [],
        ...extraMarkets
      ]).take(10)
    });
  } finally {
    yield cancel(progressReporter);
  }
}

function* index(): * {
  yield (takeLatest: any)(
    ["SEARCH_QUERY_CHANGED", "NETWORK_CHANGED"],
    handleSearchQuery
  );
}

export default index;
