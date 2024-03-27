function checkExtensionInstalled(setHasExtension) {
  console.log("Message sent!");
  window.addEventListener("message", function (event) {
    if (
      event.source == window &&
      event.data.message === "Greetings from the Zeeguu Extension"
    ) {
      console.log("Message RECEIVED!");
      setHasExtension(true);
    }
  });
  console.log("Message NOT received!");
  setHasExtension(false);
}
export { checkExtensionInstalled };
