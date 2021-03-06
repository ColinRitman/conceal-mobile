import localStorage from './LocalStorage';
import decode from 'jwt-decode';

export default class AuthHelper {
  constructor(domain) {
    this.domain = domain;
  }

  login = options => {
    const { email, password, twoFACode, uuid } = options;
    const body = {
      uuid,
      email,
      password,
      rememberme: true,
    };
    if (twoFACode && twoFACode !== '') body.code = twoFACode;
    return this.fetch(`${this.domain}/auth`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => {
        if (res.message.token) this.setToken(res.message.token);
        return Promise.resolve(res);
      });
  };

  loggedIn = () => {
    let token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  };

  isTokenExpired = token => {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  };

  setUsername = idUsername => localStorage.set('id_username', idUsername);
  getUsername = () => { return localStorage.get('id_username') };
  setRememberme = idRememberme => localStorage.set('id_rememberme', idRememberme);
  getRememberme = () => { return localStorage.get('id_rememberme'); }
  setToken = idToken => localStorage.set('id_token', idToken);
  getToken = () => { return localStorage.get('id_token'); }
  logout = () => localStorage.remove('id_token');
  decodeToken = () => (decode(this.getToken()));

  fetch = (url, options) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    return fetch(url, { headers, ...options })
      .then(this._checkStatus)
      .then(response => response.json());
  };

  _checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
}
