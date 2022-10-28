import { ExtensionStorage } from "./extensionStorage";
import { BrowserStorageWrapper } from "./browserStorageWrapper";
import { IS_IN_DEVELOPMENT_MODE } from "../../consts/app";

const IS_UNLOCKED_KEY = "isUnlocked";
const PASSWORD_KEY = "password";

export class SessionStorage extends ExtensionStorage<SessionStorageData> {
  constructor() {
    let storage;
    if (IS_IN_DEVELOPMENT_MODE) {
      storage = new BrowserStorageWrapper(sessionStorage);
    } else {
      storage = chrome.storage.session;
    }
    super(storage);
  }

  async isExtensionUnlocked(): Promise<boolean> {
    try {
      const storageObject = await this.get();
      return !!storageObject?.isUnlocked;
    } catch (error) {
      console.error("[IsExtensionUnlocked]:", error);
      return false;
    }
  }

  async setIsExtensionUnlocked(isUnlocked: boolean): Promise<void> {
    try {
      return this.set({ [IS_UNLOCKED_KEY]: isUnlocked });
    } catch (error) {
      console.error("[UpdateIsExtensionUnlocked]:", error);
    }
  }

  async getPassword(): Promise<string | undefined> {
    try {
      const storageObject = await this.get();
      return storageObject?.password;
    } catch (error) {
      console.error("[GetDecryptedPassword]:", error);
      return undefined;
    }
  }

  async setPassword(password: string): Promise<void> {
    try {
      return this.set({ [PASSWORD_KEY]: password });
    } catch (error) {
      console.error("[SetDecryptedPassword]:", error);
    }
  }
}

/**
 * Session storage data resets on browser restart.
 */
interface SessionStorageData {
  /**
   * Shows whether user has already entered correct password in current session or not.
   */
  isUnlocked: boolean;

  /**
   * Plaintext password without encryption.
   */
  password: string;
}
