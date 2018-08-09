import React, {Component} from 'react';
import {Input, Menu, Dropdown, Button} from 'antd';
import 'antd/dist/antd.css';

const menu = (
    <Menu>
        <Menu.Item>
            <Button type={'default'} icon={'picture'}>发送图片</Button>
        </Menu.Item>
        <Menu.Item>
            <Button type={'default'} icon={'smile-o'}>发表情包</Button>
        </Menu.Item>
        <Menu.Item>
            <Button type={'default'} icon={'heart-o'}>发送爱心</Button>
        </Menu.Item>
    </Menu>
);
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
                <button className='emoji_icon'></button>
                {/*<button className='function_icon'></button>*/}
                <Dropdown overlay={menu} placement="topCenter" trigger={['click']}>
                    <button className='function_icon'></button>
                </Dropdown>
                <Input className='input_box' onPressEnter={this.handleKeyPress.bind(this)} value={this.state.message}
                       onChange={this.handleChange.bind(this)} placeholder={'代码打完了？BUG修好了？作业写完了？还不快点去......'}/>
                <button className='send_button' onClick={this.handleClick.bind(this)}></button>

            </div>
        )
    }
}