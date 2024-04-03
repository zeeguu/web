function checkExtensionInstalled(setHasExtension) {
  window.addEventListener("message", function (event) {
    if (
      event.source == window &&
      event.data.message === "EXTENSION_CONFIRMATION_RESPONSE" &&
      event.data.source === "ZEEGUU_INJECTED_CODE"
    ) {
      setHasExtension(true);
    }
  });
  window.postMessage(
    {
      source: "ZEEGUU_PAGE",
      message: "CONFIRM_EXTENSION_REQUEST",
    },
    "*",
  );
}
export { checkExtensionInstalled };
