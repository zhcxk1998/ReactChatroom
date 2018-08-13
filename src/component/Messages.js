import React, {Component} from 'react';

var huaji='data:image/jpeg;base64,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'


export default class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            headportrait: this.props.headportrait,
        };
    }

    componentDidMount() {
        if (document.getElementById('messages')!==null){
            console.log('ok')
        }
    }

    render() {
        var user = this.state.username;
        var headportrait = this.props.headportrait;
        const oneMessage = this.props.messages.map(function (message) {
            var keyid = (new Date().getTime() + Math.floor(Math.random() * 999) + Math.random() * 10).toString();
            return (
                <Message key={keyid} msgType={message.type} msgUser={message.username} action={message.action}
                         isMe={(message.username === user)} time={message.time} headportrait={headportrait}/>
            )
        });
        return (<div id='messages' className="messages" ref="messages">{oneMessage}</div>)
    }
}

class Message extends Component {

    render() {
        var user = this.props.msgUser;
        var headportrait = this.props.headportrait;
        if (headportrait.length !== 0) {
            var user_avater = headportrait.filter(function (e) {
                return e.username === user;
            });
            var avater = user_avater[0].img;
            if (avater == null) {
                avater = huaji
            }
            if (this.props.msgType === 'system') {
                return (
                    <div className="one-message system-message">
                        {this.props.msgUser} {(this.props.action === 'login') ? ' 闪亮登场！' : ' 悄咪咪的走了！'} <span
                        className="time">&nbsp;{this.props.time}</span>
                    </div>
                )
            }
            else if (this.props.isMe) {
                return (
                    <div style={{display: 'flex'}}>
                        <div className={(this.props.isMe) ? 'me one-message' : 'other one-message'}>
                            <p className="time"><span>{this.props.msgUser}</span> {this.props.time}</p>
                            <div className="message-content">{this.props.action}</div>
                        </div>
                        <div id="chat_avater" className='chat_avater my_avater'
                             style={{backgroundImage: "url('" + avater + "')"}}></div>
                    </div>
                )
            }
            else {
                return (
                    <div style={{display: 'flex'}}>
                        <div id="chat_avater" style={{backgroundImage: "url('" + avater + "')"}}
                             className={(this.props.isMe) ? 'myavater chat_avater' : 'other chat_avater'}></div>
                        <div className={(this.props.isMe) ? 'me one-message' : 'other one-message'}>
                            <p className="time"><span>{this.props.msgUser}</span> {this.props.time}</p>
                            <div className="message-content">{this.props.action}</div>
                        </div>
                    </div>
                )
            }
        }
        return (<div>
        </div>)
    }
}