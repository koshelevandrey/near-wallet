import {
  WALLET_CONTENTSCRIPT_MESSAGE_TARGET,
  WALLET_INJECTED_API_MESSAGE_TARGET,
} from "./scripts.consts";
import { InjectedAPIMessage } from "./injectedAPI.types";

function injectInpageScript() {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement("script");

    scriptTag.async = false;
    scriptTag.src = chrome.runtime.getURL("static/js/inpage.js");

    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  } catch (error) {
    console.error("Omni NEAR Wallet: Provider injection failed.", error);
  }
}

if (chrome?.runtime && window?.location?.origin?.startsWith("http")) {
  injectInpageScript();

  // Catch messages from inpage script and others
  window.addEventListener("message", (event) => {
    const message: InjectedAPIMessage = event?.data;
    const messageTo: string = message?.target;
    if (
      !chrome.runtime?.id ||
      event.source !== window ||
      messageTo !== WALLET_CONTENTSCRIPT_MESSAGE_TARGET
    ) {
      return;
    }

    //
    // console.log("[ContentScript] event:", { event });
    //

    // 1) Send message to background messages listener
    chrome.runtime.sendMessage(
      { data: message, origin: event.origin },
      (response) => {
        if (response) {
          // 2) Send response from background script to injected API listener
          //
          // console.log("[ContentScript] background response:", response);
          //
          const responseMessage: InjectedAPIMessage = {
            id: message.id,
            target: WALLET_INJECTED_API_MESSAGE_TARGET,
            method: message.method,
            response,
          };
          window.postMessage(responseMessage, window.location.origin);
        }
      }
    );
  });
}
