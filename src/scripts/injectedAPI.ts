import {
  INJECTED_API_CONNECT_METHOD,
  INJECTED_API_GET_CONNECTED_ACCOUNTS_METHOD,
  INJECTED_API_GET_NETWORK_METHOD,
  INJECTED_API_INITIALIZED_EVENT_NAME,
  WALLET_CONTENTSCRIPT_MESSAGE_TARGET,
  WALLET_INJECTED_API_MESSAGE_TARGET,
} from "./scripts.consts";
import {
  ConnectedAccount,
  InjectedApiEvents,
  GetConnectedAccountsResponse,
  EventCallback,
} from "./scripts.types";
import {
  InjectedAPIAccount,
  InjectedAPIMessage,
  InjectedAPINetwork,
} from "./injectedAPI.types";
import { utils } from "near-api-js";
import { v4 as uuidv4 } from "uuid";

export class InjectedAPI {
  public readonly id: string = "omniWallet";

  public initialized: boolean = false;

  public get connected() {
    return this.accounts?.length > 0;
  }

  public network: InjectedAPINetwork | undefined = undefined;

  public accounts: InjectedAPIAccount[] = [];

  private eventCallbacks: Map<string, EventCallback[]> = new Map<
    string,
    EventCallback[]
  >();

  constructor() {
    this.setupEventListeners();
    this.getNetwork()
      .then(() => {
        return this.getConnectedAccounts();
      })
      .then(() => {
        this.initialized = true;
        window.dispatchEvent(new Event(INJECTED_API_INITIALIZED_EVENT_NAME));
      })
      .catch((error) => {
        console.error(
          "Omni Near Wallet injected API initialization failed:",
          error
        );
      });
  }

  public async connect(storage: any) {
    const response = await this.sendMessage<GetConnectedAccountsResponse>(
      INJECTED_API_CONNECT_METHOD,
      null,
      true
    );
    return this.handleConnectedAccountsChange(response);
  }

  public disconnect() {
    this.handleConnectedAccountsChange([]);
  }

  public signIn() {}

  public signOut() {}

  public on(eventName: InjectedApiEvents, callback: (data: any) => any) {
    if (eventName === "accountsChanged" || eventName === "networkChanged") {
      let callbacks = this.eventCallbacks.get(eventName) || [];
      callbacks.push({ signature: callback.toString(), callback });
      this.eventCallbacks.set(eventName, callbacks);
    } else {
      throw new Error(`Not supported event: ${eventName}`);
    }
  }

  public off(eventName: InjectedApiEvents, callback: (data: any) => any) {
    if (eventName === "accountsChanged" || eventName === "networkChanged") {
      let callbacks = this.eventCallbacks.get(eventName) || [];
      const callbackSignature = callback.toString();
      callbacks = callbacks.filter(
        (existingCallback) => existingCallback.signature !== callbackSignature
      );
      this.eventCallbacks.set(eventName, callbacks);
    } else {
      throw new Error(`Not supported event: ${eventName}`);
    }
  }

  public signTransaction() {}

  public signTransactions() {}

  private setupEventListeners() {
    // TODO: listen to messages from content script and background script
    //   1) get signed transaction after signTransaction()
    //   2) get network
    window.addEventListener("message", async (event) => {
      const message: InjectedAPIMessage = event?.data;
      const messageTo: string = message?.target;
      //
      // console.info("[InjectedApiEventListener] message:", {
      //   message,
      //   source: event?.source,
      // });
      //
      if (
        event?.source !== window ||
        messageTo !== WALLET_INJECTED_API_MESSAGE_TARGET
      ) {
        return;
      }

      const method = message?.method;
      const response = await message.response;
      switch (method) {
        case INJECTED_API_GET_CONNECTED_ACCOUNTS_METHOD:
          this.handleConnectedAccountsChange(response);
          break;
        /*case INJECTED_API_CONNECT_METHOD:
          this.handleGetConnectedAccounts(response);
          break;*/
        default:
          // TODO: remove console log
          //console.log("[InjectedApiEventListener] unknown method:", method);
          //
          break;
      }
    });
  }

  private async handleConnectedAccountsChange(
    accountsPromise: ConnectedAccount[] | undefined
  ) {
    //
    //console.log("[InjectedAPIHandleGetConnectedAccounts]:", accountsPromise);
    //
    let accounts = await accountsPromise;
    if (Array.isArray(accounts)) {
      const accountsWithPublicKey =
        accounts.map((account) => ({
          ...account,
          publicKey: utils.PublicKey.from(account.publicKey),
        })) || [];

      this.accounts = accountsWithPublicKey;
      this.executeEventCallbacks("accountsChanged", accountsWithPublicKey);
      return accountsWithPublicKey;
    }
    return [];
  }

  private async handleNetworkChange(network: InjectedAPINetwork) {
    this.executeEventCallbacks("networkChanged", network);
  }

  private async getNetwork() {
    this.sendMessage(INJECTED_API_GET_NETWORK_METHOD);
  }

  private async getConnectedAccounts() {
    this.sendMessage(INJECTED_API_GET_CONNECTED_ACCOUNTS_METHOD);
  }

  private async sendMessage<T>(
    method: string,
    params: any = null,
    shouldWaitForAnswer = false
  ): Promise<T | undefined> {
    const messageId = uuidv4();
    const message: InjectedAPIMessage = {
      id: messageId,
      target: WALLET_CONTENTSCRIPT_MESSAGE_TARGET,
      method,
      params,
    };

    let response: Promise<T> | undefined;
    if (shouldWaitForAnswer) {
      response = new Promise((resolve) => {
        const listener = async (event: MessageEvent<any>) => {
          const message: InjectedAPIMessage = event?.data;
          const messageTo: string = message?.target;
          //
          // console.info(`[InjectedApiEventListener#${messageId}]:`, {
          //   message,
          // });
          //
          if (
            event.source === window &&
            messageTo === WALLET_INJECTED_API_MESSAGE_TARGET &&
            message?.id === messageId
          ) {
            window.removeEventListener("message", listener);
            resolve(message?.response as T);
          }
        };

        window.addEventListener("message", listener);
      });
    } else {
      response = undefined;
    }

    window.postMessage(message, window.location.origin);
    return response;
  }

  private executeEventCallbacks(eventName: InjectedApiEvents, data: any) {
    let eventCallbacks = this.eventCallbacks.get(eventName) || [];
    eventCallbacks.forEach((eventCallback) => {
      eventCallback.callback(data);
    });
  }
}
