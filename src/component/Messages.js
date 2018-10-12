import React, {Component} from 'react';
import {getemoji} from "./Emoji";

var huaji = 'http://cdn.algbb.fun/emoji/32.png'
var flag = true;

export default class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            headportrait: this.props.headportrait,
        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }


    render() {
        var user = this.state.username;
        var headportrait = this.props.headportrait;
        var messages = this.props.messages;
        const oneMessage = this.props.messages.map(function (message, index) {
            if (message.type == 'system') {
                flag = false;
            }
            var keyid = (new Date().getTime() + Math.floor(Math.random() * 999) + Math.random() * 10).toString();
            var content = document.getElementsByClassName('chatLog');
            if (content.length!=0 && flag){
                content[content.length-1].scrollIntoView()
                flag=false
            }
            return (
                <Message key={keyid} msgType={message.type} msgUser={message.username} action={message.action}
                         isMe={(message.username === user)} time={message.time} headportrait={headportrait}
                         messages={messages}/>
            )
        });
        return (<div id='messages' className="messages" ref="messages">{oneMessage}</div>)
    }
}

class Message extends Component {


    render() {
        var user = this.props.msgUser;
        var headportrait = this.props.headportrait;
        var action = this.props.action;
        var emoji = action.match(/#\(\d{2}\)/g);
        var te = action;
        if (emoji != null) {
            emoji.map(function (item) {
                if (item.match(/\d{2}/)[0] >= 1 && item.match(/\d{2}/)[0] <= 33)
                    te = te.replace(item, '<img src="' + getemoji(item) + '" width=30 height=30/>')
            })
            action = <div dangerouslySetInnerHTML={{__html: te}}></div>
        }

        if (headportrait.length !== 0) {
            var user_avater = headportrait.filter(function (e) {
                return e.username === user;
            });
            var avater = user_avater[0].img;
            if (avater == null) {
                avater = huaji
            }
            // if (this.props.msgType === 'system') {
            //     return (
            //         <div className="one-message system-message">
            //             {this.props.msgUser} {(this.props.action === 'login') ? ' 闪亮登场！' : ' 悄咪咪的走了！'} <span
            //             className="time">&nbsp;{this.props.time}</span>
            //         </div>
            //     )
            // }
            if (this.props.isMe) {
                if (this.props.msgType === 'img') {
                    return (
                        <div className="chatLog" style={{display: 'flex'}}>
                            <div style={{backgroundColor: 'transparent'}}
                                 className={(this.props.isMe) ? 'me one-message' : 'other one-message'}>
                                <p className="time"><span>{this.props.msgUser}</span> {this.props.time}</p>
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
                                <p className="time"><span>{this.props.msgUser}</span> {this.props.time}</p>
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