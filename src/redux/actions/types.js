// @flow

export type Action = { type: "SEARCH", query: string };

export type Dispatch = (action: Action) => any;
