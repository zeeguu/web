import fetch from "cross-fetch";
import axios from "axios";

const Zeeguu_API = class {
  constructor(baseAPIurl) {
    this.baseAPIurl = baseAPIurl;
    //this.session = currentSession; is instantiated in App when the user logs in (causes error to actually instantiate it here).
  }

  apiLog(what) {
    console.log("➡️ " + what);
  }

  getSystemLanguages(callback) {
    this._getJSON("system_languages", callback);
  }

  _appendSessionToUrl(endpointName) {
    if (endpointName.includes("?")) {
      return `${this.baseAPIurl}/${endpointName}&session=${this.session}`;
    }
    return `${this.baseAPIurl}/${endpointName}?session=${this.session}`;
  }

  _getPlainText(endpoint, callback, onError) {
    this.apiLog("GET" + endpoint);
    fetch(this._appendSessionToUrl(endpoint, this.session))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        callback(data);
      })
      .catch((e) => {
        console.log("Exception in _getPlainText");
        onError(e);
      });
  }

  _getJSON(endpoint, callback) {
    this.apiLog("GET" + endpoint);
    fetch(this._appendSessionToUrl(endpoint, this.session))
      .then((response) => response.json())
      .then((data) => {
        //do whatever it is you need to do with the fetched data...
        callback(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //returning text or json based on the boolean getJson
  _post(endpoint, body, callback, onError, getJson) {
    // TODO: Make sure that you either return a Promise or not. Now if a callback is passed we don't return anything otherwise we return a promise.

    this.apiLog("POST" + endpoint);

    const url = this._appendSessionToUrl(endpoint);

    let params = { method: "POST" };
    if (body) {
      params = {
        ...params,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
      };
    }

    if (callback) {
      fetch(url, params)
        .then((response) => (getJson ? response.json() : response.text()))
        .then((data) => callback(data))
        .catch((e) => onError(e));
    } else {
      return fetch(url, params);
    }
  }

  //migrated from old teacher zeeguu dashboard
  async apiPost(endpoint, data, isForm) {
    const params = { session: this.session };

    const headers = isForm ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" };

    console.log(`[FRONTEND-API] POST ${endpoint} - START`, { timestamp: new Date().toISOString(), endpoint, dataSize: data ? JSON.stringify(data).length : 0 });

    const startTime = performance.now();
    try {
      const res = await axios({
        method: "post",
        url: this.baseAPIurl + endpoint,
        params: params,
        headers: headers,
        data: data,
      });
      const elapsed = performance.now() - startTime;
      console.log(`[FRONTEND-API] POST ${endpoint} - SUCCESS`, { timestamp: new Date().toISOString(), elapsed: `${elapsed.toFixed(2)}ms`, status: res.status });
      return res;
    } catch (error) {
      const elapsed = performance.now() - startTime;
      console.error(`[FRONTEND-API] POST ${endpoint} - ERROR`, {
        timestamp: new Date().toISOString(),
        elapsed: `${elapsed.toFixed(2)}ms`,
        error: error.message,
        code: error.code,
        response: error.response?.status
      });
      throw error;
    }
  }

  async apiGet(endpoint) {
    const params = { session: this.session };
    const res = await axios.get(this.baseAPIurl + endpoint, { params });
    return res;
  }
};

export { Zeeguu_API };
