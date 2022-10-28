import { utils } from "near-api-js";

export interface InjectedAPIAccount {
  accountId: string;
  publicKey?: utils.PublicKey;
}

export interface InjectedAPINetwork {
  networkId: string;
  nodeUrl: string;
}

export interface InjectedAPIMessage {
  target: string;
  method: string;
  params?: any;
  response?: any;
}
