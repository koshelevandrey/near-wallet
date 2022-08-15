const apiObject = {
  isNearWallet: true,
  hello: () => {
    return "Hello";
  },
  enable: () => {
    // Send message to content script event listener
    window.postMessage(
      { type: "near#enable", text: "Show NEAR wallet popup" },
      "*"
    );
  },
};

(window as Record<string, any>).near = apiObject;

export {};
