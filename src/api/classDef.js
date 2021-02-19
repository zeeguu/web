import fetch from 'cross-fetch'

const Zeeguu_API = class {
  constructor (baseAPIurl) {
    this.baseAPIurl = baseAPIurl
  }

  apiLog (what) {
    // console.log('➡️ ' + what)
  }

  getSystemLanguages (callback) {
    this._get('system_languages', callback)
  }

  _appendSessionToUrl (endpointName) {
    if (endpointName.includes('?')) {
      return `${this.baseAPIurl}/${endpointName}&session=${this.session}`
    }
    return `${this.baseAPIurl}/${endpointName}?session=${this.session}`
  }

  _get (endpoint, callback) {
    this.apiLog('GET' + endpoint)
    fetch(this._appendSessionToUrl(endpoint, this.session))
      .then(response => response.json())
      .then(data => {
        callback(data)
      })
  }

  _post (endpoint, body, callback, onError) {
    this.apiLog('POST' + endpoint)

    const url = this._appendSessionToUrl(endpoint)

    let params = { method: 'POST' }
    if (body) {
      params = {
        ...params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      }
    }

    if (callback) {
      fetch(url, params)
        .then(data => {
          if (data.status === 400) {
            onError(data)
          } else {
            callback(data)
          }
        })
        .catch(e => onError(e))
    } else {
      fetch(url, params)
    }
  }
}

export { Zeeguu_API }
