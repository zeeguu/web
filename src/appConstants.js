let APP_DOMAIN = "https://www.zeeguu.org";
let API_ENDPOINT = "https://api.zeeguu.org";
if (typeof process.env !== "undefined") {
  console.log(process.env.REACT_APP_API_URL);
  if (process.env.REACT_APP_API_URL) {
    API_ENDPOINT = process.env.REACT_APP_API_URL;
  }
  if (process.env.REACT_APP_WEB_URL) {
    APP_DOMAIN = process.env.REACT_APP_WEB_URL;
  }
}

export { APP_DOMAIN, API_ENDPOINT };
