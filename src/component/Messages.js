import React, {Component} from 'react';

export default class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            headportrait: []
        };
    }

    componentDidMount() {
        fetch('http://192.168.1.104:4000/avater')
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            this.setState({headportrait: data})
                            var user = this.state.username;
                            var headportrait = data;
                            var user_avater = this.state.headportrait.filter(function (e) {
                                return e.username === user;
                            });
                            var avater = user_avater[0].img;
                            document.getElementById('headportrait').style.backgroundImage = "url('" + avater + "')";
                        })
                }
            })
        // var user = this.state.username;
        // var headportrait=this.state.headportrait;
        // var user_avater=this.state.headportrait.filter(function (e) {
        //     return e.username===user;
        // });
        // var avater=user_avater[0].img;
        // document.getElementById('headportrait').style.backgroundImage="url('"+avater+"')";
    }

    render() {
        var user = this.state.username;
        var headportrait = this.state.headportrait;
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
        var user_avater = headportrait.filter(function (e) {
            return e.username === user;
        });
        // console.log(user_avater)
        // console.log(headportrait)
        // console.log("\n\n\n\n\n")
        var avater = user_avater[0].img;
        // fetch('http://192.168.1.104:4000/avater')
        //     .then(res => {
        //         if (res.ok) {
        //             res.json()
        //                 .then(data => {
        //                     // document.getElementById('chat_avater').style.backgroundImage = 'url("' + data[1].img + '")';
        //                     console.log(data[0].img)
        //                 })
        //         }
        //     })
        if (this.props.msgType === 'system') {
            return (
                <div className="one-message system-message">
                    {this.props.msgUser} {(this.props.action === 'login') ? ' 闪亮登场！' : ' 悄咪咪的走了！'} <span
                    className="time">&nbsp;{this.props.time}</span>
                </div>
            )
        } else if (this.props.isMe) {
            return (
                <div style={{display: 'flex'}}>
                    <div className={(this.props.isMe) ? 'me one-message' : 'other one-message'}>
                        <p className="time"><span>{this.props.msgUser}</span> {this.props.time}</p>
                        <div className="message-content">{this.props.action}</div>
                    </div>
                    <div id="chat_avater" style={{backgroundImage: "url('" + avater + "')"}}
                         className={(this.props.isMe) ? 'myavater chat_avater' : 'other chat_avater'}></div>
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
}