// In chrome this code doesn't seem to execute if there is not a delay in the code.
// in zeeguu.org/article (FindArticle.js) a small timeout was added of 100 ms
// to allow the Chrome browser to correctly interact with these messages.
window.addEventListener("message", function (event) {
  if (
    event.source == window &&
    event.data.message === "CONFIRM_EXTENSION_REQUEST" &&
    event.data.source === "ZEEGUU_PAGE"
  ) {
    window.postMessage(
      {
        message: "EXTENSION_CONFIRMATION_RESPONSE",
        source: "EXTENSION_INJECTED_CODE",
      },
      "*"
    );
  }
});
