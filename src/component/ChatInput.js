import React, {Component} from 'react';
import {Input, Menu, Dropdown, Button, Tabs} from 'antd';
import 'antd/dist/antd.css';
import {getemoji} from "./emoji";
import {message} from "antd/lib/index";

const TabPane = Tabs.TabPane;

var menu;
var t;
export default class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: this.props.socket,
            message: '',
            myId: this.props.myId,
            myName: this.props.myName
        }
        menu = (
            <Menu style={{marginBottom: 20}}>
                <Menu.Item>
                    <Button type={'default'} icon={'picture'} onClick={this.sendImg}>发送图片</Button>
                </Menu.Item>
                <Menu.Item>
                    <Button type={'default'} icon={'smile-o'}>发表情包</Button>
                </Menu.Item>
                <Menu.Item>
                    <Button type={'default'} icon={'heart-o'}>发送爱心</Button>
                </Menu.Item>
            </Menu>
        );
    }

    // 监控input变化
    handleChange(e) {
        this.setState({message: e.target.value})
    }

    addemoji(name) {
        var div = document.getElementById('input_box');
        div.value = div.value + ' ' + name + ' ';
        this.setState({message: div.value})
    }

    // 点击提交或按回车
    handleClick(e) {
        e.preventDefault();
        this.sendMessage()
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.sendMessage()
        }
        return false;
    }

    changeImg = () => {
        // alert('aooaoa')
        var file = document.getElementById('sendImage').files[0];
        var r = new FileReader();

        r.onload = function () {
            fetch('http://112.74.57.211:4000/upload')
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(data => {
                                var pic = r.result.split(',')[1];
                                var token = data;
                                var url = "http://upload-z2.qiniu.com/putb64/-1";
                                var xhr = new XMLHttpRequest();
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState === 4) {
                                        // document.getElementById('img').src = "http://cdn.algbb.fun/" + JSON.parse(xhr.responseText).key;
                                        document.getElementById('image_content').value = "http://cdn.algbb.fun/" + JSON.parse(xhr.responseText).key;
                                        document.getElementById('image_send').click();
                                    }
                                };
                                xhr.open("POST", url, true);
                                xhr.setRequestHeader("Content-Type", "application/octet-stream");
                                xhr.setRequestHeader("Authorization", "UpToken " + token);
                                xhr.send(pic);
                            }).then(()=>{
                                document.getElementById('sendImage').value=null;
                        })
                    }
                })
        };

        r.readAsDataURL(file);
    }

    temp = () => {
        const message = document.getElementById('image_content').value;
        this.sendImage(message)
    }

    sendImg = () => {
        document.getElementById('sendImage').click();
        // alert('aoao')
    }

    //发送图片信息
    sendImage(e) {
        const message = e;
        const socket = this.state.socket;
        if (message) {
            const obj = {
                uid: this.state.myId,
                username: this.state.myName,
                message: message,
                type: 'img'
            }
            socket.emit('message', obj);
            this.setState({message: ''});
        }
        return false
    }

    // 发送聊天信息
    sendMessage(e) {
        const message = this.state.message;
        const socket = this.state.socket;
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
                                <div className='emoji_item' onClick={() => this.addemoji('#(01)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(01)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(02)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(02)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(03)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(03)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(04)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(04)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(05)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(05)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(06)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(06)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(07)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(07)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(08)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(08)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(09)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(09)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(10)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(10)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(11)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(11)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(12)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(12)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(13)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(13)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(14)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(14)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(15)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(15)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(16)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(16)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(17)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(17)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(18)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(18)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(19)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(19)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(20)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(20)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(21)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(21)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(22)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(22)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(23)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(23)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(24)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(24)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(25)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(25)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(26)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(26)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(27)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(27)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(28)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(28)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(29)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(29)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(30)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(30)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(31)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(31)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(32)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(32)') + '")'}}></div>
                                </div>
                                <div className='emoji_item' onClick={() => this.addemoji('#(33)')}>
                                    <div style={{backgroundImage: 'url("' + getemoji('#(33)') + '")'}}></div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </Menu>
        );
        return (
            <div className='chat_footer'>

                <Dropdown overlay={emoji} placement="topLeft" trigger={['click']}>
                    <button className='emoji_icon'></button>
                </Dropdown>

                <Dropdown overlay={menu} placement="topCenter" trigger={['click']}>
                    <button className='function_icon'></button>
                </Dropdown>
                <input style={{display: 'none'}} id={'sendImage'} type={'file'} accept={'image/*'}
                       onChange={this.changeImg}/>
                <input style={{display: 'none'}} id={'image_content'}/>
                <button style={{display: 'none'}} id={'image_send'} onClick={this.temp}></button>
                <Input id='input_box' className='input_box' onPressEnter={this.handleKeyPress.bind(this)}
                       value={this.state.message}
                       onChange={this.handleChange.bind(this)} placeholder={'代码打完了？BUG修好了？作业写完了？还不快点去......'}/>
                <button className='send_button' onClick={this.handleClick.bind(this)}></button>

            </div>
        )
    }
}