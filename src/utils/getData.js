const fetch = require('node-fetch');
module.exports = async function getData(url) {
    let get = await fetch(url);
    let res = await get.json();
    return res;
};