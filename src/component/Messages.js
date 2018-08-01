import React, {Component} from 'react';

export default class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username
        };
    }

    render() {
        var user = this.state.username;
        const oneMessage = this.props.messages.map(function (message) {
            var keyid = (new Date().getTime() + Math.floor(Math.random() * 999) + Math.random() * 10).toString();
            return (
                <Message key={keyid} msgType={message.type} msgUser={message.username} action={message.action}
                         isMe={(message.username === user)} time={message.time}/>
            )
        });
        return (<div id='messages' className="messages" ref="messages">{oneMessage}</div>)
    }
}

class Message extends Component {
    render() {
        if (this.props.msgType === 'system') {
            return (
                <div className="one-message system-message">
                    {this.props.msgUser} {(this.props.action === 'login') ? ' 闪亮登场！' : ' 悄咪咪的走了！'} <span
                    className="time">&nbsp;{this.props.time}</span>
                </div>
            )
        } else {
            return (
                <div className={(this.props.isMe) ? 'me one-message' : 'other one-message'}>
                    <p className="time"><span>{this.props.msgUser}</span> {this.props.time}</p>
                    <div className="message-content">{this.props.action}</div>
                </div>
            )
        }
    }
}