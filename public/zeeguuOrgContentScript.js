console.log("running the content script");
window.postMessage(
  {
    direction: "from-content-script",
    message: "Message from extension",
  },
  "*"
);
