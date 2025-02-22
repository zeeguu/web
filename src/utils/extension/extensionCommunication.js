const TIMEOUT_UNTIL_MESSAGE_RESPONSE = 1000;
const INTERVAL_UNTIL_SENDING_MESSAGE = 100;

function checkExtensionInstalled(setHasExtension) {
  // The extension will inject a listener that responds to the postMessage
  // in this method.
  //
  // The code injected from the extension is sometimes injected after a small delay.
  // To ensure the test message is not sent before the probe is injected,
  // we ask for confirmation only after a short timeout
  setTimeout(() => {
    window.postMessage(
      {
        source: "ZEEGUU_PAGE",
        message: "CONFIRM_EXTENSION_REQUEST",
      },
      "*",
    );
  }, INTERVAL_UNTIL_SENDING_MESSAGE);

  // To give time to the extension to inject the code, this code waits for
  // TIMEOUT_UNTIL_MESSAGE_RESPONSE (1s). If the response does
  // not come in the interval we assume there is no extension installed

  const extensionResponseTimeout = setTimeout(() => {
    setHasExtension(false);
  }, TIMEOUT_UNTIL_MESSAGE_RESPONSE);

  window.addEventListener("message", function (event) {
    if (
      event.source === window &&
      event.data.message === "EXTENSION_CONFIRMATION_RESPONSE" &&
      event.data.source === "EXTENSION_INJECTED_CODE"
    ) {
      // Here we know that the extension is installed
      setHasExtension(true);
      clearTimeout(extensionResponseTimeout);
    }
  });
}

export { checkExtensionInstalled };
