import React from 'react';
import ChatRoom from './ChatRoom';

// const socket = require('socket.io-client')('http://localhost:4000');
const io=require('socket.io-client');

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            uid: this.props.uid,
            // socket: io('http://localhost:4000')
            socket: io('http://192.168.1.103:4000')
        }
    }

    // 生成用户id
    // generateUid() {
    //     return new Date().getTime() + "" + Math.floor(Math.random() * 9 + 1);
    // }

    // 监控名称变化
    // handleChange(e) {
    //     this.setState({username: e.target.value})
    // }
    //
    // // 监控点击提交或按回车
    // handleClick(e) {
    //     e.preventDefault();
    //     this.handleLogin();
    // }
    //
    // handleKeyPress(e) {
    //     if (e.key == 'Enter') {
    //         this.handleLogin()
    //     }
    //     return false;
    // }

    // 登陆
    componentDidMount() {
        // let username = this.state.username;

        // 随机生成游客名字
        // username = '游客' + Math.floor(Math.random()*89+10)
        // var uid = this.generateUid();
        // if (!username) {
        //     username = '游客' + uid;
        // }
        // this.setState({uid: uid});
        this.state.socket.emit('login', {uid: this.state.username, username: this.state.username})
    }

    render() {
        let renderDOM;
        // if (this.state.uid) {
            renderDOM = <ChatRoom uid={this.state.uid} username={this.state.username} socket={this.state.socket}/>
        // } else {
        //     renderDOM = (<div className="login-box">
        //         <h2>登 陆</h2>
        //         <div className="input">
        //             <input type="text" placeholder="请输入用户名" onChange={this.handleChange.bind(this)}
        //                    onKeyPress={this.handleKeyPress.bind(this)}/>
        //         </div>
        //         <div className="submit">
        //             <button type="button" onClick={this.handleClick.bind(this)}>提交</button>
        //         </div>
        //     </div>)
        // }
        return (<div>{renderDOM}</div>)
    }
}

export default Chat;