export const APP_DOMAIN =
  typeof process !== "undefined"
    ? process.env.REACT_APP_WEB_URL
      ? process.env.REACT_APP_WEB_URL
      : "https://www.zeeguu.org"
    : "https://www.zeeguu.org";

export const API_ENDPOINT =
  typeof process !== "undefined"
    ? process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL
      : "https://api.zeeguu.org"
    : "https://api.zeeguu.org";
