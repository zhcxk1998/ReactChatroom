import React, {Component} from 'react';
import {Input, Button} from 'antd';
import 'antd/dist/antd.css';

export default class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: this.props.socket,
            message: '',
            myId: this.props.myId,
            myName: this.props.myName
        }
    }

    // 监控input变化
    handleChange(e) {
        this.setState({message: e.target.value})
    }

    // 点击提交或按回车
    handleClick(e) {
        e.preventDefault();
        this.sendMessage()
    }

    handleKeyPress(e) {
        if (e.key == 'Enter') {
            this.sendMessage()
        }
        return false;
    }

    // 发送聊天信息
    sendMessage(e) {
        const message = this.state.message;
        const socket = this.state.socket;
        if (message) {
            const obj = {
                uid: this.state.myId,
                username: this.state.myName,
                message: message
            };
            socket.emit('message', obj);
            this.setState({message: ''});
        }
        return false
    }

    render() {
        return (
            <div className='chat_footer'>
                {/*<div className="input_box">*/}
                {/*<div className="input">*/}
                {/*<input type="text" placeholder="按回车提交" value={this.state.message}*/}
                {/*onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChange.bind(this)}/>*/}
                <Input className='input_box' onPressEnter={this.handleKeyPress.bind(this)} value={this.state.message}
                       onChange={this.handleChange.bind(this)} placeholder={'代码打完了？BUG修好了？作业写完了？还不快点去......'}/>
                {/*</div>*/}
                {/*<div className="button">*/}
                {/*<button type="button" onClick={this.handleClick.bind(this)}>提交</button>*/}
                <Button className='send_button' type={'primary'} onClick={this.handleClick.bind(this)} icon={'arrow-right'}/>
                {/*</div>*/}
            </div>
        )
    }
}