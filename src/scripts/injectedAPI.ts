import {
  INJECTED_API_CONNECT_METHOD,
  INJECTED_API_GET_CONNECTED_ACCOUNTS_METHOD,
  INJECTED_API_GET_NETWORK_METHOD,
  INJECTED_API_INITIALIZED_EVENT_NAME,
  WALLET_CONTENTSCRIPT_MESSAGE_TARGET,
  WALLET_INJECTED_API_MESSAGE_TARGET,
} from "./scripts.consts";
import { GetConnectedAccountsResponse } from "./scripts.types";
import {
  InjectedAPIAccount,
  InjectedAPIMessage,
  InjectedAPINetwork,
} from "./injectedAPI.types";
import { utils } from "near-api-js";

const DEFAULT_NETWORK: InjectedAPINetwork = {
  networkId: "testnet",
  nodeUrl: `https://rpc.testnet.near.org`,
};

export class InjectedAPI {
  public readonly id: string = "omniWallet";

  public initialized: boolean = false;

  public get connected() {
    return this.accounts?.length > 0;
  }

  public network: InjectedAPINetwork = DEFAULT_NETWORK;

  public accounts: InjectedAPIAccount[] = [];

  constructor() {
    this.setupEventListeners();
    this.getNetwork();
    this.getConnectedAccounts();

    this.initialized = true;
    window.dispatchEvent(new Event(INJECTED_API_INITIALIZED_EVENT_NAME));
  }

  public connect(storage: any) {
    this.sendMessage(INJECTED_API_CONNECT_METHOD);
  }

  public disconnect() {
    this.accounts = [];
  }

  public signIn() {}

  public signOut() {}

  public on(eventName: string, callback: (data: any) => any) {}

  public off() {}

  public signTransaction() {}

  public signTransactions() {}

  private setupEventListeners() {
    // TODO: listen to messages from content script and background script
    //   1) get connected accounts after getConnectedAccounts()
    //   2) get signed transaction after signTransaction()
    //   3) get network
    window.addEventListener("message", async (event) => {
      const message: InjectedAPIMessage = event?.data;
      const messageTo: string = message?.target;
      //
      console.info("[InjectedApiEventListener] message:", {
        message,
        messageTo,
        source: event?.source,
        isSkipped: event?.source !== window,
      });
      //
      if (
        event?.source !== window ||
        messageTo !== WALLET_INJECTED_API_MESSAGE_TARGET
      ) {
        return;
      }

      const method = message?.method;

      //
      //console.info("[InjectedApiEventListener] message:", message);
      //

      switch (method) {
        case INJECTED_API_GET_CONNECTED_ACCOUNTS_METHOD:
          this.handleGetConnectedAccountsEvent(message.response);
          break;
        case INJECTED_API_CONNECT_METHOD:
          this.handleGetConnectedAccountsEvent(message.response);
          break;
        default:
          console.info("[InjectedApiEventListener] unknown method:", method);
          break;
      }
    });
  }

  private async handleGetConnectedAccountsEvent(
    accountsPromise: GetConnectedAccountsResponse | undefined
  ) {
    //
    console.log(
      "[InjectedAPIHandleGetConnectedAccountsEvent]:",
      accountsPromise
    );
    //
    let accounts = await accountsPromise;
    if (Array.isArray(accounts)) {
      const accountsWithPublicKey = accounts.map((account) => ({
        ...account,
        publicKey: utils.PublicKey.from(account.publicKey),
      }));

      this.accounts = accountsWithPublicKey || [];
    }
  }

  private getNetwork() {
    this.sendMessage(INJECTED_API_GET_NETWORK_METHOD);
  }

  private getConnectedAccounts() {
    this.sendMessage(INJECTED_API_GET_CONNECTED_ACCOUNTS_METHOD);
  }

  private sendMessage(method: string, params: any = null) {
    const message: InjectedAPIMessage = {
      target: WALLET_CONTENTSCRIPT_MESSAGE_TARGET,
      method,
      params,
    };
    window.postMessage(message, window.location.origin);
  }
}
