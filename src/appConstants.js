let APP_DOMAIN = window.location.hostname;
let API_ENDPOINT = "https://api.zeeguu.org";

try {
  if (typeof process.env !== "undefined") {
    if (process.env.REACT_APP_API_URL) {
      API_ENDPOINT = process.env.REACT_APP_API_URL;
    }
    if (process.env.REACT_APP_WEB_URL) {
      APP_DOMAIN = process.env.REACT_APP_WEB_URL;
    }
  }
} catch {
  console.log("Didn't set variables");
}

export { APP_DOMAIN, API_ENDPOINT };
