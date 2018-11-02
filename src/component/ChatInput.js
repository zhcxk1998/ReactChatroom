import React, {Component} from 'react';
import {Input, Menu, Dropdown, Button, Tabs, Progress} from 'antd';
import 'antd/dist/antd.css';

const qiniu = require('qiniu-js');

const TabPane = Tabs.TabPane;

export default class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: this.props.socket,
            message: '',
            myId: this.props.myId,
            myName: this.props.myName,
            updateMsg: this.props.updateMsg,
            uploadProgress: this.props.uploadProgress,
            percent: this.props.percent
        }
    }

    generateTime = () => {
        let hour = new Date().getHours(),
            minute = new Date().getMinutes();
        hour = (hour == 0) ? '00' : hour;
        minute = (minute < 10) ? '0' + minute : minute;
        return hour + ':' + minute;
    }

    // Monitor inputBox change
    handleChange = (e) => {
        this.setState({message: e.target.value});
    }

    addemoji = (name) => {
        const div = document.getElementById('input-box');
        this.setState({message: div.value + ' #(' + name + ') '});
        document.getElementById('input-box').focus();
    }

    handleClick = (e) => {
        e.preventDefault();
        this.sendMessage();
    }

    chooseImage = () => {
        const file = document.getElementById('selectImage').files[0],
            r = new FileReader(),
            that = this;
        r.onload = function () {
            fetch('http://112.74.57.211:4000/upload')
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(data => {
                                const token = data;
                                // Get the blob
                                let arr = r.result.split(','), mime = arr[0].match(/:(.*?);/)[1],
                                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                                while (n--) {
                                    u8arr[n] = bstr.charCodeAt(n);
                                }
                                const file = new Blob([u8arr], {type: mime}),
                                    key = `ImageMessages/${that.state.myName}_${Date.now()}`,
                                    observable = qiniu.upload(file, key, token, {
                                        useCdnDomain: true,
                                        region: qiniu.region.z2
                                    }, {}),
                                    obj = {
                                        uid: that.state.myId,
                                        username: that.state.myName,
                                        message: r.result,
                                        type: 'img'
                                    }
                                // Add chatLog
                                that.state.updateMsg(obj);
                                observable.subscribe({
                                    next(info) {
                                        // Show the progress bar
                                        that.state.uploadProgress(Math.floor(info.total.percent))
                                        const upload = document.getElementsByClassName('image-upload'),
                                            div = document.getElementsByClassName('image-message');
                                        upload[upload.length - 1].style.display = 'block';
                                        div[div.length - 1].style.filter = 'blur(3px)';
                                    },
                                    error(err) {
                                        console.log(err)
                                    },
                                    complete: (info) => {
                                        // Add chatLog in the database
                                        that.sendImage(`http://cdn.algbb.fun/${key}`)
                                        const upload = document.getElementsByClassName('image-upload'),
                                            div = document.getElementsByClassName('image-message');
                                        // Hide progress bar
                                        upload[upload.length - 1].style.display = 'none';
                                        div[div.length - 1].style.filter = '';
                                        // Change img src
                                        div[div.length - 1].src = `http://cdn.algbb.fun/${key}`;
                                    }
                                })
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

    // Send img message
    sendImage = (e) => {
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

    // Send message
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
                            <div className='emoji-content'>
                                {Array.from({length: 33}, (item, index) => index + 1).map((item) => {
                                    let name = item.toString().length > 1 ? item.toString() : '0' + item.toString()
                                    return <div className='emoji-item' onClick={() => this.addemoji(name)}>
                                        <div
                                            style={{backgroundImage: 'url("' + `http://cdn.algbb.fun/emoji/${name}.png` + '")'}}></div>
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
                    <Button icon={'picture'} onClick={this.selectImage}>发送图片</Button>
                </Menu.Item>
                <Menu.Item>
                    <Button icon={'smile-o'}>发表情包</Button>
                </Menu.Item>
                <Menu.Item>
                    <Button icon={'heart-o'}>发送爱心</Button>
                </Menu.Item>
            </Menu>
        )

        return (
            <div className='chat-footer'>
                <Dropdown overlay={emoji} placement="topLeft" trigger={['click']}>
                    <button className='emoji-icon'></button>
                </Dropdown>
                <Dropdown overlay={menu} placement="topCenter" trigger={['click']}>
                    <button className='function-icon'></button>
                </Dropdown>
                <input style={{display: 'none'}} id={'selectImage'} type={'file'} accept={'image/*'}
                       onChange={this.chooseImage}/>
                <Input id='input-box' autoComplete='off' className='input-box'
                       onPressEnter={this.handleClick.bind(this)}
                       value={this.state.message}
                       onChange={this.handleChange.bind(this)} placeholder={'代码打完了？BUG修好了？作业写完了？还不快点去......'}/>
                <button className='send-button' onClick={this.handleClick.bind(this)}></button>
            </div>
        )
    }
}