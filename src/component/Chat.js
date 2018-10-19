import React from 'react';
import ChatRoom from './ChatRoom';

const io = require('socket.io-client');

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            uid: this.props.uid,
            socket: io('http://112.74.57.211:4000'),
            message: []
        }
    }

    // 登陆
    componentDidMount() {
        this.state.socket.emit('login', {uid: this.state.uid, username: this.state.username})
    }


    render() {
        return (<div><ChatRoom uid={this.state.uid} username={this.state.username} socket={this.state.socket}/></div>)
    }
}

export default Chat;