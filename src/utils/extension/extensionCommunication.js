const TIMEOUT_UNTIL_MESSAGE_RESPONSE = 1000;
const INTERVAL_UNTIL_SENDING_MESSAGE = 100;

function checkExtensionInstalled(setHasExtension) {
  /*
    The Injection will inject a listener that send a message that responds
    to the postMessage in this method. To allow the extension to also be set
    to false, a timeOut is given that will just set the extension to false if
    it's not cleared before the timeout set.

    The code injection from the extension has a small delay. To ensure the 
    message is only sent once the code is injected, use the constant
    INTERVAL_UNTIL_SENDING_MESSAGE. 100ms has seem to been enough.
   */
  const timeOutRequestId = setTimeout(() => {
    setHasExtension(false);
  }, TIMEOUT_UNTIL_MESSAGE_RESPONSE);
  window.addEventListener("message", function (event) {
    if (
      event.source == window &&
      event.data.message === "EXTENSION_CONFIRMATION_RESPONSE" &&
      event.data.source === "ZEEGUU_READER_INJECTED_CODE"
    ) {
      setHasExtension(true);
      clearTimeout(timeOutRequestId);
    }
  });
  setTimeout(() => {
    window.postMessage(
      {
        source: "ZEEGUU_PAGE",
        message: "CONFIRM_EXTENSION_REQUEST",
      },
      "*",
    );
  }, INTERVAL_UNTIL_SENDING_MESSAGE);
}
export { checkExtensionInstalled };
