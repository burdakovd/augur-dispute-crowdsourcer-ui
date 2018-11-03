// @flow

import { createStore, applyMiddleware } from "redux";
import type { Store as ReduxStore } from "redux";
import createSagaMiddleware from "redux-saga";
import type { Action } from "./actions/types";
import type { State } from "./state";
import reduce from "./reduce";
import sagas from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const store: ReduxStore<State, Action> = createStore(
  reduce,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(sagas);

export default store;
