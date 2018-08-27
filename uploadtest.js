const qiniu = require('qiniu');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.get('/upload', function (req, res) {
    var accessKey = 'vynFEg1tanKcC2-QeMKrice5n8z9JC16ekZcPlWE';
    var secretKey = 'p-alIlT5t4yjDInTMnKfadrHJsy4m7w-zFqIKvoi';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    // var keyToOverwrite = new Date().getTime()+"";
    var options = {
        scope: 'reactchatroom',
        // expires: 3600,
        saveKey:"ImageMessages/$(etag)",
        mimeLimit:"image/*"
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    res.json(uploadToken)
});

app.listen(4000, function () {
    console.log('ok')
});