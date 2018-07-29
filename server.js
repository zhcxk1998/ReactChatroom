var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '192.168.1.103',
    user: 'root',
    password: 'czk8379530',
    database: 'test'
});
//------------------------------------------------------------------------
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// 在线用户
var onlineUsers = {};
// 在线用户人数
var onlineCount = 0;

io.on('connection', function (socket) {
    // 监听客户端的登陆
    socket.on('login', function (obj) {

        // 用户id设为socketid
        socket.id = obj.uid;

        // 如果没有这个用户，那么在线人数+1，将其添加进在线用户
        if (!onlineUsers.hasOwnProperty(obj.uid)) {
            onlineUsers[obj.uid] = obj.username;
            onlineCount++;
        }

        // 向客户端发送登陆事件，同时发送在线用户、在线人数以及登陆用户
        io.emit('login', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj});
        console.log(obj.username + '加入了群聊');
    });

    // 监听客户端的断开连接
    socket.on('disconnect', function () {

        // 如果有这个用户
        if (onlineUsers.hasOwnProperty(socket.id)) {
            var obj = {uid: socket.id, username: onlineUsers[socket.id]};

            // 删掉这个用户，在线人数-1
            delete onlineUsers[socket.id];
            onlineCount--;

            // 向客户端发送登出事件，同时发送在线用户、在线人数以及登出用户
            io.emit('logout', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj});
            console.log(obj.username + '退出了群聊');
        }
    });

    // 监听客户端发送的信息
    socket.on('message', function (obj) {
        io.emit('message', obj);
        console.log(obj.username + "说:" + obj.message)
    })

});


// -----------------------------------------------------------------------

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
var info;
var user;
var pwd;
app.post('/form', function (req, result) {
    user = req.body.userName;
    pwd = req.body.password;
    info = [
        req.body.userName, req.body.password
    ];
    console.log(info);
    connection.query('insert into usertest(user,pwd) values(?,?)', info, function (err, res) {
        console.log(res);
    })
});
var data;
connection.query('select * from usertest', function (err, res) {
    res = JSON.stringify(res);
    res = JSON.parse(res);
    data = res;
});

app.get('/formitem', function (req, res) {
    res.status(200);
    res.json(data);
});


server.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(host, port);
});