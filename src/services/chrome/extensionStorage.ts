import { isEmpty } from "../../utils/common";

export interface ApplicationStorageArea {
  get: (
    keys?: string | string[] | { [p: string]: any } | null | undefined
  ) => Promise<{ [p: string]: any }>;
  set: (items: { [p: string]: any }) => Promise<void>;
}

/**
 * Basic wrapper around the extension's storage API
 */
export class ExtensionStorage<Type> {
  private storage: ApplicationStorageArea;

  constructor(storage: ApplicationStorageArea) {
    this.storage = storage;
  }

  /**
   * Returns all of the keys currently saved
   */
  async get(): Promise<Type | undefined> {
    const result = await this._get();
    // extension storage always returns an obj
    // if the object is empty, treat it as undefined
    if (isEmpty(result)) {
      return undefined;
    }
    return result;
  }

  /**
   * Sets the key in local state
   */
  async set(state: object): Promise<void> {
    return this._set(state);
  }

  /**
   * Returns all of the keys currently saved
   */
  private _get(): Promise<Type> {
    return new Promise((resolve) => {
      this.storage.get(null).then((result: any) => {
        resolve(result);
      });
    });
  }

  /**
   * Sets the key in storage state
   */
  private _set(obj: object): Promise<void> {
    return new Promise((resolve) => {
      this.storage.set(obj).then(() => {
        resolve();
      });
    });
  }
}
