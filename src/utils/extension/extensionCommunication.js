function checkExtensionInstalled(setHasExtension) {
  window.addEventListener("message", function (event) {
    if (
      event.source == window &&
      event.data.message === "CONFIRM_FLAG" &&
      event.data.source === "EXT"
    ) {
      setHasExtension(true);
    }
  });
  window.postMessage(
    {
      source: "APP",
      message: "REQUEST_FLAG",
    },
    "*",
  );
}
export { checkExtensionInstalled };
