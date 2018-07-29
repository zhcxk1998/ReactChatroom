import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class Messages extends Component {
    // componentDidUpdate() {
    //     // const messageList = ReactDOM.findDOMNode(this.refs.messages);
    //     // window.scrollTo(0, messageList.clientHeight + 50);
    //     // this.props.messages.map(function(message){
    //     //     console.log(message.username,message.uid)
    //     // })
    //     var chatArea = document.getElementById('messages');
    //     chatArea.scrollTop = chatArea.scrollHeight;
    // }

    render() {
        const myId = this.props.myId;
        const oneMessage = this.props.messages.map(function (message) {
            return (
                <Message key={message.msgId} msgType={message.type} msgUser={message.username} action={message.action}
                         isMe={(myId === message.uid) ? true : false} time={message.time}/>
            )
        });
        return (<div id='messages' className="messages" ref="messages">{oneMessage}</div>)
    }
}

class Message extends Component {
    componentDidMount() {
        var div = document.getElementById('messages');
        if (this.props.isMe) {
            console.log('isme!!!');
            div.scrollTop = div.scrollHeight;
        } else {
            console.log('这不是我！')
            div.scrollTop=0;
        }
    }

    render() {
        if (this.props.msgType == 'system') {
            return (
                <div className="one-message system-message">
                    {this.props.msgUser} {(this.props.action == 'login') ? '进入了聊天室' : '离开了聊天室'} <span
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