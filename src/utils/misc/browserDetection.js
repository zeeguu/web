function runningInChromeDesktop() {
  let userAgent = navigator.userAgent;
  if (userAgent.match(/chrome|chromium|crios/i) && isMobile() === false) {
    return true;
  } else {
    return false;
  }
}

function runningInFirefoxDesktop() {
  let userAgent = navigator.userAgent;
  if (userAgent.match(/firefox/i) && isMobile() === false) {
    return true;
  } else {
    return false;
  }
}

// cf: https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi|Android/i.test(
    navigator.userAgent
  );
}

export { isMobile, runningInChromeDesktop,runningInFirefoxDesktop };
