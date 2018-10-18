import React, {Component} from 'react';
import {Input, Menu, Dropdown, Button, Tabs} from 'antd';
import 'antd/dist/antd.css';
import {getemoji} from "./Emoji";

const TabPane = Tabs.TabPane;

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

    addemoji(name) {
        var div = document.getElementById('input_box');
        this.setState({message: div.value + ' ' + name + ' '})
        document.getElementById('input_box').focus()
    }

    // 点击提交或按回车
    handleClick(e) {
        e.preventDefault();
        this.sendMessage()
    }

    chooseImage = () => {
        let file = document.getElementById('selectImage').files[0],
            r = new FileReader(),
            that = this;
        r.onload = function () {
            fetch('http://112.74.57.211:4000/upload')
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(data => {
                                let pic = r.result.split(',')[1],
                                    token = data,
                                    url = "http://upload-z2.qiniu.com/putb64/-1",
                                    xhr = new XMLHttpRequest();
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === 4)
                                        that.sendImage("http://cdn.algbb.fun/" + JSON.parse(xhr.responseText).key);
                                };
                                xhr.open("POST", url, true);
                                xhr.setRequestHeader("Content-Type", "application/octet-stream");
                                xhr.setRequestHeader("Authorization", "UpToken " + token);
                                xhr.send(pic);
                            }).then(() => {
                            document.getElementById('selectImage').value = null;
                        })
                    }
                })
        };

        r.readAsDataURL(file);
    }

    selectImage = () => {
        document.getElementById('selectImage').click();
    }

    //发送图片信息
    sendImage(e) {
        const message = e,
            socket = this.state.socket;
        if (message) {
            const obj = {
                uid: this.state.myId,
                username: this.state.myName,
                message: message,
                type: 'img'
            }
            socket.emit('message', obj);
        }
        return false
    }

    // 发送聊天信息
    sendMessage(e) {
        const message = this.state.message,
            socket = this.state.socket;
        if (message) {
            const obj = {
                uid: this.state.myId,
                username: this.state.myName,
                message: message,
                type: 'chat'
            };
            socket.emit('message', obj);
            this.setState({message: ''});
        }
        return false
    }

    render() {
        const emoji = (
            <Menu style={{marginBottom: 20, marginLeft: -30}}>
                <div className='emoji'>
                    <Tabs defaultActivekey={'1'}>
                        <TabPane tab="贴吧表情" key="1">
                            <div className='emoji_content'>
                                {Array.from({length: 33}, (item, index) => index + 1).map((item) => {
                                    let name = item.toString().length > 1 ? '#(' + item.toString() + ')' : '#(0' + item.toString() + ')'
                                    return <div className='emoji_item' onClick={() => this.addemoji(name)}>
                                        <div style={{backgroundImage: 'url("' + getemoji(name) + '")'}}></div>
                                    </div>
                                })}
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </Menu>
        )
        const menu = (
            <Menu style={{marginBottom: 20}}>
                <Menu.Item>
                    <Button type={'default'} icon={'picture'} onClick={this.selectImage}>发送图片</Button>
                </Menu.Item>
                <Menu.Item>
                    <Button type={'default'} icon={'smile-o'}>发表情包</Button>
                </Menu.Item>
                <Menu.Item>
                    <Button type={'default'} icon={'heart-o'}>发送爱心</Button>
                </Menu.Item>
            </Menu>
        )

        return (
            <div className='chat_footer'>
                <Dropdown overlay={emoji} placement="topLeft" trigger={['click']}>
                    <button className='emoji_icon'></button>
                </Dropdown>
                <Dropdown overlay={menu} placement="topCenter" trigger={['click']}>
                    <button className='function_icon'></button>
                </Dropdown>
                <input style={{display: 'none'}} id={'selectImage'} type={'file'} accept={'image/*'}
                       onChange={this.chooseImage}/>
                <Input id='input_box' className='input_box' onPressEnter={this.handleClick.bind(this)}
                       value={this.state.message}
                       onChange={this.handleChange.bind(this)} placeholder={'代码打完了？BUG修好了？作业写完了？还不快点去......'}/>
                <button className='send_button' onClick={this.handleClick.bind(this)}></button>
            </div>
        )
    }
}