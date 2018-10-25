import React, {Component} from 'react';


export default class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            headportrait: this.props.headportrait,
        };
    }

    render() {
        const user = this.state.username,
            headportrait = this.props.headportrait,
            messages = this.props.messages,
            oneMessage = this.props.messages.map(function (message, index) {
                let keyId = (new Date().getTime() + Math.floor(Math.random() * 999) + Math.random() * 10).toString();
                return (
                    <Message key={keyId} msgType={message.type} msgUser={message.username} action={message.action}
                             isMe={(message.username === user)} time={message.time} headportrait={headportrait}
                             messages={messages}/>
                )
            });
        return (<div id='messages' className="messages" ref="messages">{oneMessage}</div>)
    }
}

class Message extends Component {
    render() {
        let action = this.props.action;
        const user = this.props.msgUser,
            headportrait = this.props.headportrait,
            emoji = action.match(/#\(\d{2}\)/g);
        if (emoji != null) {
            emoji.map(function (item) {
                if (item.match(/\d{2}/)[0] >= 1 && item.match(/\d{2}/)[0] <= 33) {
                    action = action.replace(item, '<img src="' + `http://cdn.algbb.fun/emoji/${item.slice(2, 4)}.png` + '" width=30 height=30/>')
                }
            })
            action = <div dangerouslySetInnerHTML={{__html: action}}></div>
        }

        if (headportrait.length !== 0) {
            const user_avater = headportrait.filter(function (e) {
                return e.username === user;
            });
            const avater = user_avater.length != 0 ? user_avater[0].img : 'http://cdn.algbb.fun/emoji/32.png';
            if (this.props.isMe) {
                if (this.props.msgType === 'img') {
                    return (
                        <div className="chatLog" style={{display: 'flex'}}>
                            <div style={{backgroundColor: 'transparent'}}
                                 className={(this.props.isMe) ? 'me one-message' : 'other one-message'}>
                                <p className="time">{this.props.time} <span>{this.props.msgUser}</span></p>
                                <div style={{backgroundColor: 'transparent'}} className="message-content"><img
                                    className='image_message' src={action}/></div>
                            </div>
                            <div id="chat_avater" className='chat_avater my_avater'
                                 style={{backgroundImage: "url('" + avater + "')"}}></div>
                        </div>
                    )
                }
                else {
                    return (
                        <div className="chatLog" style={{display: 'flex'}}>
                            <div className={(this.props.isMe) ? 'me one-message' : 'other one-message'}>
                                <p className="time">{this.props.time} <span>{this.props.msgUser}</span></p>
                                <div className="message-content">{action}</div>
                            </div>
                            <div id="chat_avater" className='chat_avater my_avater'
                                 style={{backgroundImage: "url('" + avater + "')"}}></div>
                        </div>
                    )
                }
            }
            else {
                if (this.props.msgType === 'img') {
                    return (
                        <div className="chatLog" style={{display: 'flex'}}>
                            <div id="chat_avater" className='chat_avater my_avater'
                                 style={{backgroundImage: "url('" + avater + "')"}}></div>
                            <div style={{backgroundColor: 'transparent'}}
                                 className={(this.props.isMe) ? 'me one-message' : 'other one-message'}>
                                <p className="time"><span>{this.props.msgUser}</span> {this.props.time}</p>
                                <div style={{backgroundColor: 'transparent'}} className="message-content"><img
                                    className='image_message' src={action}/></div>
                            </div>
                        </div>
                    )
                }
                else {
                    return (
                        <div className="chatLog" style={{display: 'flex'}}>
                            <div id="chat_avater" style={{backgroundImage: "url('" + avater + "')"}}
                                 className={(this.props.isMe) ? 'myavater chat_avater' : 'other chat_avater'}></div>
                            <div className={(this.props.isMe) ? 'me one-message' : 'other one-message'}>
                                <p className="time"><span>{this.props.msgUser}</span> {this.props.time}</p>
                                <div className="message-content">{action}</div>
                            </div>
                        </div>
                    )
                }
            }
        }
        return (<div>
        </div>)
    }
}