let APP_DOMAIN = window.location.origin;
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
const isExpectedDomain = /netlify.app|zeeguu.org|localhost/g;

if (!isExpectedDomain.test(APP_DOMAIN)) APP_DOMAIN = "https://www.zeeguu.org";

const TopicOriginType = Object.freeze({
  URL_PARSED: 1,
  HARDSET: 2,
  INFERRED: 3,
});

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

export { APP_DOMAIN, API_ENDPOINT, TopicOriginType };
