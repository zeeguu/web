let APP_URL = window.location.origin;
let APP_DOMAIN = window.location.hostname;
let API_ENDPOINT = "https://api.zeeguu.org";

/* 
  This is done to allow Netlify previews to shown new
  resources that are added in a PR.
  We want to keep a possibility to point to another 
  location, which can be done by setting the env variables.

  In the Extension, we want to ensure we keep the default
  to be the server, and for this reason we test the expected
  domains, to evaluate if it's the extension being run somewhere
  else.
*/
const isExpectedUrl = /netlify.app|zeeguu.org|localhost/g;
const isExpectedDomain = /netlify|zeeguu|localhost/g;

if (!isExpectedUrl.test(APP_URL)) APP_URL = "https://www.zeeguu.org";
if (!isExpectedDomain.test(APP_DOMAIN)) APP_DOMAIN = "zeeguu";

try {
  if (typeof process.env !== "undefined") {
    if (process.env.REACT_APP_API_URL) {
      API_ENDPOINT = process.env.REACT_APP_API_URL;
    }
    if (process.env.REACT_APP_WEB_URL) {
      APP_URL = process.env.REACT_APP_WEB_URL;
    }
  }
} catch {
  console.log("Didn't set variables");
}

export { APP_URL, API_ENDPOINT, APP_DOMAIN };
