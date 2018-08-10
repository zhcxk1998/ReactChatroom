var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'czk8379530',
    database: 'chatroom'
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
        // console.log(obj);
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
        // console.log(onlineCount, onlineUsers)
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

    function generateTime() {
        let hour = new Date().getHours(),
            minute = new Date().getMinutes();
        hour = (hour === 0) ? '00' : hour;
        minute = (minute < 10) ? '0' + minute : minute;
        return hour + ':' + minute;
    }

    // 监听客户端发送的信息
    socket.on('message', function (obj) {
        io.emit('message', obj);
        console.log(obj.username + "说:" + obj.message);
        var action = obj.message;
        var time = generateTime();
        var type = 'chat';
        var username = obj.username;
        var info = [action, time, type, username];
        connection.query('insert into chatlog(action,time,type,username) values(?,?,?,?)', info, function (err, res) {
        });
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
var username;
var password;
app.post('/regist', function (req, result) {

    username = req.body.username;
    password = req.body.password;
    info = [
        req.body.username, req.body.password
    ];
    connection.query('select * from userinfo where binary username="' + username + '"', function (err, res) {
        if (err) console.log(err);
        if (res.length === 0) {
            connection.query('insert into userinfo(username,password) values(?,?)', info, function (err, res) {
            });
            return result.send([{"data": "registsuccess"}])
        }
        else {
            return result.send([{"data": "userexist"}])
        }
    });
});

app.post('/login', function (req, result) {
    username = req.body.username;
    password = req.body.password;
    info = [
        req.body.username, req.body.password
    ];
    connection.query('select password from userinfo where binary username="' + username + '"', function (err, res) {
        if (err) throw err;
        try {
            if (res[0].password !== password) return result.send([{"data": "wrongpassword"}]);
            else return result.send([{"data": "loginsuccess"}]);
        }
        catch (err) {
            return result.send([{"data": "notexist"}]);
        }
    });
});

app.post('/change', function (req, result) {
    connection.query('UPDATE userinfo SET password="' + req.body.password + '" WHERE username="' + req.body.username + '"', function (err, res) {
        if (err) return result.send([{"data": "no"}]);
        return result.send([{"data": "ok"}])
    })
});

app.post('/headportrait', function (req, result) {
    var str = req.body.img;
    str = str.replace(/ /g, '+');
    return result.send([{"img": str}]);
});

app.post('/update_headportrait', function (req, result) {
    var str = req.body.img;
    str = str.replace(/ /g, '+');
    connection.query('UPDATE userinfo SET img="' + str + '" WHERE username="' + req.body.username + '"')

    return result.send([{"img": str}, {"username": req.body.username}]);
});

app.get('/avater', function (req, result) {
    connection.query('select * from userinfo', function (err, res) {
        res = JSON.stringify(res);
        res = JSON.parse(res);
        result.status(200);
        result.json(res);
    })
});

app.get('/chathistory', function (req, result) {
    connection.query('select * from chatlog', function (err, res) {
        res = JSON.stringify(res);
        res = JSON.parse(res);
        result.status(200);
        result.json(res);
    })
});

server.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(host, port);
});
