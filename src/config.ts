import { ImmutableObject } from "seamless-immutable";

export interface Config {
  printServiceUrl: string;
}

export type IMConfig = ImmutableObject<Config>;
