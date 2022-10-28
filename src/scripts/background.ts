import {
  INJECTED_API_CONNECT_METHOD,
  INJECTED_API_GET_CONNECTED_ACCOUNTS_METHOD,
  INJECTED_API_GET_NETWORK_METHOD,
  INJECTED_API_METHOD_QUERY_PARAM_KEY,
} from "./scripts.consts";
import { LocalStorage } from "../services/chrome/localStorage";
import { InjectedAPIMessage } from "./injectedAPI.types";

const POPUP_HEIGHT = 640;
const POPUP_WIDTH = 440;

const appLocalStorage = new LocalStorage();

async function openPopup(query: string = "") {
  let top = 0;
  let left = 0;

  // Try to position popup in top right corner of last focused window
  try {
    const lastFocusedWindow = await chrome.windows.getLastFocused();
    if (
      lastFocusedWindow?.top &&
      lastFocusedWindow?.left &&
      lastFocusedWindow?.width
    ) {
      top = lastFocusedWindow.top;
      left = lastFocusedWindow.left + (lastFocusedWindow.width - POPUP_WIDTH);
    }
  } catch {}

  await chrome.windows.create({
    url: chrome.runtime.getURL(`index.html${query}`),
    type: "popup",
    height: POPUP_HEIGHT,
    width: POPUP_WIDTH,
    top,
    left,
  });
}

function handleConnect() {
  // TODO: check if popup is already opened (if opened do not open new one)

  openPopup(`?${INJECTED_API_METHOD_QUERY_PARAM_KEY}=connect`);
}

function handleGetConnectedAccounts(website: string, sendResponse: any) {
  if (!website) {
    console.info(
      "[BackgroundHandleGetConnectedAccounts]: website arg is empty"
    );
    return;
  }

  appLocalStorage
    .getWebsiteConnectedAccounts(website)
    .then((connectedAccounts) => {
      sendResponse(connectedAccounts || []);
    })
    .catch(() => {
      sendResponse([]);
    });
  return true;
}

function handleGetNetwork() {
  // TODO: get from extension storage?
}

if (chrome?.runtime) {
  // Catch messages from content script
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    const origin = message?.origin;
    const messageData: InjectedAPIMessage = message?.data;
    const method = messageData?.method;
    const params = messageData?.params;
    console.info("[BackgroundMessage]:", {
      method,
      params,
      origin,
    });
    switch (method) {
      case INJECTED_API_CONNECT_METHOD:
        handleConnect();
        sendResponse();
        break;
      case INJECTED_API_GET_CONNECTED_ACCOUNTS_METHOD:
        return handleGetConnectedAccounts(origin, sendResponse);
      case INJECTED_API_GET_NETWORK_METHOD:
        handleGetNetwork();
        sendResponse();
        break;
      default:
        console.info("[BackgroundEventListener] unknown method:", method);
        sendResponse();
        break;
    }
  });
}
