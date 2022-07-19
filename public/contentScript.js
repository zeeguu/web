window.postMessage(
  {
    direction: "from-content-script",
    message: "Message from extension",
  },
  "*"
);
