const fetch = require('node-fetch');

module.exports = {
    changeAvater: async function changeAvater(key, username) {
        let postAvater = await fetch('https://chat.algbb.fun/update-headportrait', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "img=" + "http://cdn.algbb.fun/" + key + "&username=" + username,
        });
        let res = await postAvater.json();
        return res;
    },
    changePassword: async function changePassword(username, password) {
        let postPassword = await fetch('https://chat.algbb.fun/change', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "username=" + username + "&password=" + password,
        });
        let res = await postPassword.json();
        return res;
    },
    Login: async function Login(username, password) {
        let postLogin = await fetch('https://chat.algbb.fun/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "username=" + username + "&password=" + password,
        });
        let res = await postLogin.json();
        return res;
    },
    Regist: async function Regist(username, password) {
        let postRegist = await fetch('https://chat.algbb.fun/regist', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "username=" + username + "&password=" + password,
        });
        let res = await postRegist.json();
        return res;
    }
};
