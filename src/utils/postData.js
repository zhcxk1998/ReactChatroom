const fetch = require('node-fetch');

module.exports = {
  changeAvater: async function changeAvater(key, username) {
    const postAvater = await fetch('https://chat.algbb.fun/update-headportrait', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `${'img=' + 'https://cdn.algbb.fun/'}${key}&username=${username}`,
    });
    const res = await postAvater.json();
    return res;
  },
  changePassword: async function changePassword(username, password) {
    const postPassword = await fetch('https://chat.algbb.fun/change', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${username}&password=${password}`,
    });
    const res = await postPassword.json();
    return res;
  },
  Login: async function Login(username, password) {
    const postLogin = await fetch('https://chat.algbb.fun/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${username}&password=${password}`,
    });
    const res = await postLogin.json();
    return res;
  },
  Regist: async function Regist(username, password) {
    const postRegist = await fetch('https://chat.algbb.fun/regist', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${username}&password=${password}`,
    });
    const res = await postRegist.json();
    return res;
  },
};
