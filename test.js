const http = require('http');
var express = require('express');
var path = require('path');
const hostname = '0.0.0.0';
const port = 3000;
var app = express();
var fs=require('fs')

app.use('/bb',express.static(__dirname+'build/index'));

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});