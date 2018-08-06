import React from 'react';
import ChatRoom from './ChatRoom';

// const socket = require('socket.io-client')('http://localhost:4000');
const io = require('socket.io-client');

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            uid: this.props.uid,
            socket: io('http://192.168.1.105:4000'),
            message:[]
        }
    }

    // 登陆
    componentDidMount() {
        this.state.socket.emit('login', {uid: this.state.uid, username: this.state.username})
    }

    

    render() {
        let renderDOM;
        renderDOM = <ChatRoom uid={this.state.uid} username={this.state.username} socket={this.state.socket}/>
        return (<div>{renderDOM}</div>)
    }
}

export default Chat;