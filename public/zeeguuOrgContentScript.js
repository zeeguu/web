function repeat_with_delay(i) {
  setTimeout(function () {
    notifyZeeguuOrgOfExtensionPresence();
    i--;
    if (i > 0) {
      repeat_with_delay(i);
    }
  }, 100);
}

function notifyZeeguuOrgOfExtensionPresence() {
  r = window.postMessage(
    {
      direction: "from-content-script",
      message: "Greetings from the Zeeguu Extension",
    },
    "*"
  );
  console.log(r);
}

repeat_with_delay(10); //  start the loop
