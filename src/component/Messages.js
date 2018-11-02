import React, {Component} from 'react';
import {Progress} from 'antd';

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
            percent = this.props.percent,
            oneMessage = this.props.messages.map(function (message, index) {
                const keyId = (new Date().getTime() + Math.floor(Math.random() * 999) + Math.random() * 10).toString();
                return (
                    <Message key={keyId} msgType={message.type} msgUser={message.username} action={message.action}
                             isMe={(message.username === user)} time={message.time} headportrait={headportrait}
                             messages={messages} percent={percent}/>
                )
            });
        return (<div id='messages' className="messages" ref="messages">{oneMessage}</div>)
    }
}

class Message extends Component {
    render() {
        let action = this.props.action;
        const user = this.props.msgUser,
            percent = this.props.percent,
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
            const userAvater = headportrait.filter(function (e) {
                return e.username === user;
            });
            const avater = userAvater.length !== 0 ? userAvater[0].img : 'http://cdn.algbb.fun/emoji/32.png';
            const imgMessages = (
                <div className={(this.props.isMe) ? "chatLog self" : "chatLog"}>
                    <div id="chat-avater" className='chat-avater'
                         style={{backgroundImage: "url('" + avater + "')"}}></div>
                    <div className={(this.props.isMe) ? 'me one-message' : 'other one-message'}>
                        <div className="time">
                            <span>&nbsp;{this.props.msgUser}</span><span>&nbsp;{this.props.time}</span></div>
                        <div className={(this.props.isMe) ? 'image-box self' : 'image-box'}>
                            <div style={{backgroundColor: 'transparent'}} className="message-content"><img
                                className='image-message' src={action}/></div>
                            <div className={'image-upload'} style={{display:'none'}}>
                                <Progress type={'circle'} percent={percent} width={40}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
            const textMessages = (
                <div className={(this.props.isMe) ? "chatLog self" : "chatLog"}>
                    <div id="chat-avater" style={{backgroundImage: "url('" + avater + "')"}}
                         className='chat-avater'></div>
                    <div className={(this.props.isMe) ? 'me one-message' : 'other one-message'}>
                        <div className="time">
                            <span>&nbsp;{this.props.msgUser}</span><span>&nbsp;{this.props.time}</span></div>
                        <div className="message-content">{action}</div>
                    </div>
                </div>
            )
            return (this.props.msgType === 'img') ? imgMessages : textMessages;
        }
        return (<div>
        </div>)
    }
}