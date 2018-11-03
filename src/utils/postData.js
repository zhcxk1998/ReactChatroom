const fetch = require('node-fetch');

module.exports = {
    changeAvater: async function changeAvater(key, username) {
        let postAvater = await fetch('http://112.74.57.211:4000/update-headportrait', {
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
        let postPassword = await fetch('http://112.74.57.211:4000/change', {
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
        let postLogin = await fetch('http://112.74.57.211:4000/login', {
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
        let postRegist = await fetch('http://112.74.57.211:4000/login', {
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