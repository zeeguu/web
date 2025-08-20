// Development configuration for local testing
const WEB_URL = process.env.NODE_ENV === 'development' ? "http://localhost:3000" : "https://www.zeeguu.org";
const API_URL = process.env.NODE_ENV === 'development' ? "http://localhost:9001" : "https://api.zeeguu.org";
const WEB_LOGIN_URL = `${WEB_URL}/log_in`;

export { WEB_URL, API_URL, WEB_LOGIN_URL };
