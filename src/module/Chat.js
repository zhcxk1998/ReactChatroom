import React from 'react';
import ChatRoom from './ChatRoom';

const io = require('socket.io-client');

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myName: this.props.myName,
            uid: this.props.uid,
            socket: io('https://chat.algbb.fun',{
                transports:['websocket','polling']
            }),
            message: []
        }
    }

    // 登陆
    componentDidMount() {
        this.state.socket.emit('login', {uid: this.state.uid, username: this.state.myName})
    }

    render() {
        return (<div><ChatRoom uid={this.state.uid} myName={this.state.myName} socket={this.state.socket}/></div>)
    }
}

export default Chat;
