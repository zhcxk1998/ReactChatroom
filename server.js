const qiniu = require('qiniu');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'czk8379530',
  database: 'chatroom',
});
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
//------------------------------------------------------------------------
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const onlineUsers = {};
let onlineCount = 0;

io.on('connection', (socket) => {
  // Monitor user login
  socket.on('login', (obj) => {
    // Change user id to socketid
    socket.id = obj.uid;
    // If has not this user, add it to onlinUsers
    if (!onlineUsers.hasOwnProperty(obj.uid)) {
      onlineUsers[obj.uid] = obj.username;
      onlineCount++;
    }

    // Send login event，and send onlineUsers and OnlineCount
    io.emit('login', { onlineUsers, onlineCount, user: obj });
    console.log(`${obj.username} Join in ~`);
  });

  // Monitor user disconnect
  socket.on('disconnect', () => {
    // If has this user
    if (onlineUsers.hasOwnProperty(socket.id)) {
      const obj = { uid: socket.id, username: onlineUsers[socket.id] };

      // Delete this user, onlineCount - 1
      delete onlineUsers[socket.id];
      onlineCount--;

      // Send logout event，and send onlineUsers and OnlineCount
      io.emit('logout', { onlineUsers, onlineCount, user: obj });
      console.log(`${obj.username} Quit ChatRoom ~`);
    }
  });

  function generateTime() {
    let hour = new Date().getHours();


    let minute = new Date().getMinutes();
    hour = (hour === 0) ? '00' : hour;
    minute = (minute < 10) ? `0${minute}` : minute;
    return `${hour}:${minute}`;
  }

  // 监听客户端发送的信息
  socket.on('message', (obj) => {
    io.emit('message', obj);
    console.log(`${obj.username} say:${obj.message}`);
    const action = obj.message;


    const time = generateTime();


    const type = obj.type;


    const username = obj.username;


    const info = [action, time, type, username];
    connection.query('insert into chatlog(action,time,type,username) values(?,?,?,?)', info, (err, res) => {
    });
  });

  socket.on('changeAvater', () => {
    console.log('changeAvater');
    connection.query('select * from userinfo', (err, res) => {
      res = JSON.stringify(res);
      res = JSON.parse(res);
      io.emit('changeAvater', res);
    });
  });
});


// -----------------------------------------------------------------------

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
let info;


let username;


let password;
app.post('/regist', (req, result) => {
  const id = Math.floor(Math.random() * 33 + 1);
  const name = id.toString().length > 1 ? id.toString() : `0${id.toString()}`;
  username = req.body.username;
  password = req.body.password;
  info = [
    req.body.username, req.body.password, `https://cdn.algbb.fun/emoji/${name}.png`,
  ];
  connection.query(`select * from userinfo where binary username="${username}"`, (err, res) => {
    if (err) console.log(err);
    if (res.length === 0) {
      connection.query('insert into userinfo(username,password,img) values(?,?,?)', info, (err, res) => {
      });
      return result.send([{ data: 'registsuccess' }]);
    }

    return result.send([{ data: 'userexist' }]);
  });
});

app.post('/login', (req, result) => {
  username = req.body.username;
  password = req.body.password;
  console.log(username, password);
  info = [
    req.body.username, req.body.password,
  ];
  connection.query(`select password from userinfo where binary username="${username}"`, (err, res) => {
    if (err) throw err;
    try {
      if (res[0].password !== password) return result.send([{ data: 'wrongpassword' }]);
      return result.send([{ data: 'loginsuccess' }]);
    } catch (err) {
      return result.send([{ data: 'notexist' }]);
    }
  });
});

app.post('/change', (req, result) => {
  connection.query(`UPDATE userinfo SET password="${req.body.password}" WHERE username="${req.body.username}"`, (err, res) => {
    if (err) return result.send([{ data: 'no' }]);
    return result.send([{ data: 'ok' }]);
  });
});

app.post('/headportrait', (req, result) => {
  let str = req.body.img;
  str = str.replace(/ /g, '+');
  return result.send([{ img: str }]);
});

app.post('/update-headportrait', (req, result) => {
  let str = req.body.img;
  str = str.replace(/ /g, '+');
  connection.query(`UPDATE userinfo SET img="${str}" WHERE username="${req.body.username}"`);

  return result.send([{ img: str }, { username: req.body.username }]);
});

app.get('/avater', (req, result) => {
  connection.query('select * from userinfo', (err, res) => {
    res = JSON.stringify(res);
    res = JSON.parse(res);
    result.status(200);
    result.json(res);
  });
});

app.get('/chatLog', (req, result) => {
  connection.query('select * from chatlog', (err, res) => {
    res = JSON.stringify(res);
    res = JSON.parse(res);
    result.status(200);
    result.json(res);
  });
});
app.get('/upload', (req, res) => {
  const accessKey = 'vynFEg1tanKcC2-QeMKrice5n8z9JC16ekZcPlWE';


  const secretKey = 'p-alIlT5t4yjDInTMnKfadrHJsy4m7w-zFqIKvoi';


  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  // var keyToOverwrite = new Date().getTime()+"";

  const options = {
    scope: 'reactchatroom',
    // expires: 3600,
    saveKey: 'ImageMessages/$(etag)',
    mimeLimit: 'image/*',
  };


  const putPolicy = new qiniu.rs.PutPolicy(options);


  const uploadToken = putPolicy.uploadToken(mac);
  res.json(uploadToken);
});

server.listen(4000, () => {
  const host = server.address().address;


  const port = server.address().port;
  console.log(host, port);
});
