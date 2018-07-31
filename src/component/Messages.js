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

    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username
        };
        console.log(this.state.username, this.props.username, "emmmmm")
    }



    render() {
        const myId = this.props.myId;
        var user = this.state.username;
        const oneMessage = this.props.messages.map(function (message) {
            var keyid = new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
            return (
                <Message key={new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100)} msgType={message.type} msgUser={message.username} action={message.action}
                         isMe={(message.username === user ? true : false)} time={message.time}/>
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
                    {this.props.msgUser} {(this.props.action === 'login') ? '进入了聊天室' : '离开了聊天室'} <span
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