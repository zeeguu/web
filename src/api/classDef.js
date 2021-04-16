import fetch from "cross-fetch";
import axios from "axios";

const Zeeguu_API = class {
  constructor(baseAPIurl) {
    this.baseAPIurl = baseAPIurl;
    //this.session = currentSession; is initialized in App when the user logs in.
  }

  apiLog(what) {
    // console.log("➡️ " + what);
  }

  getSystemLanguages(callback) {
    this._get("system_languages", callback);
  }

  getCohortsInfo(callback){
    this._get("/cohorts_info", callback);
  }

  _appendSessionToUrl(endpointName) {
    if (endpointName.includes("?")) {
      return `${this.baseAPIurl}/${endpointName}&session=${this.session}`;
    }
    return `${this.baseAPIurl}/${endpointName}?session=${this.session}`;
  }

  _getPlainText(endpoint, callback) {
    this.apiLog("GET" + endpoint);
    fetch(this._appendSessionToUrl(endpoint, this.session))
      .then((response) => response.text())
      .then((data) => {
        callback(data);
      });
  }

  _get(endpoint, callback) {
    this.apiLog("GET" + endpoint);
    fetch(this._appendSessionToUrl(endpoint, this.session))
      .then((response) => response.json())
      .then((data) => {
        //do whatever it is you need to do with the fetched data...
        callback(data);
      });
  }

  _post(endpoint, body, callback, onError) {
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
        .then((response) => response.text())
        .then((data) => callback(data))
        .catch((e) => onError(e));
    } else {
      fetch(url, params);
    }
  }

  //migrated from old teacher zeeguu dashboard
  async apiPost(endpoint, data, isForm) {
    const params = { session: this.session };

    const headers = isForm
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };

    const res = await axios({
      method: "post",
      url: this.baseAPIurl + endpoint,
      params: params,
      headers: headers,
      data: data,
    });

    return res;
  }
};

export { Zeeguu_API };
