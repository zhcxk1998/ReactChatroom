import React, {Component} from 'react';
import Messages from './Messages';
import ChatInput from './ChatInput';

const qiniu = require('qiniu-js');
const getData = require('../utils/getData');
const postData = require('../utils/postData');
const siderIcon = require('../component/siderIcon');
const generateTime = require('../utils/generateTime');

import {Layout, Input, Icon, Button, Drawer, Modal, message, Divider, Tooltip, List, Progress} from 'antd';


const qq = siderIcon.qq,
    wechat = siderIcon.wechat;
const {Header, Footer, Sider, Content} = Layout;

export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        const socket = this.props.socket;
        this.state = {
            myId: this.props.uid,
            myName: this.props.myName,
            uid: this.props.uid,
            socket: socket,
            messages: [],
            onlineUsers: {},
            onlineCount: 0,
            userInfo: '',
            latestMessage: '',
            latestTime: '',
            headportraitVisible: false,
            headportraitUrl: '',
            headportrait: [],
            chatLog: [],
            scrollPoint: 0,
            lastIndex: 15,
            percent: 0,
            isUploading: false,
            myAvater: '',
        };
        this.ready();
    }

    async componentDidMount() {
        // Get the chatLog
        getData('http://112.74.57.211:4000/chatLog').then((data) => {
            this.setState({
                messages: data.slice(data.length - 15, data.length),
                chatLog: data,
                scrollPoint: data.length - 15,
                latestMessage: data[data.length - 1].type !== 'img' ? data[data.length - 1].username + "：" + data[data.length - 1].action : data[data.length - 1].username + "：" + '[image]',
                latestTime: data[data.length - 1].time,
            })
        })
        getData('http://112.74.57.211:4000/avater').then((data) => {
            const myName = this.state.myName;
            const myAvater = data.filter(item => {
                return item.username === myName;
            })[0].img;
            this.setState({
                headportrait: data,
                myAvater: myAvater
            })
        })
        // Load more chatLog
        const that = this;
        document.getElementById('messages').addEventListener('scroll', function () {
            if (document.getElementById('messages').scrollTop === 0) {
                that.loadMore();
            }

        })
        // Show and hide the userList
        let userList = document.getElementById("user-list"),
            showUser = document.getElementById("show-user");
        document.addEventListener('click', function (event) {
            let e = event || window.event,
                elem = e.srcElement || e.target;
            // Excepted the show-button
            if (elem !== showUser)
                userList.style.display = 'none';
        })
        // Solve click userList will hide it
        userList.addEventListener('click', function (event) {
            event = event || window.event;
            let button = document.getElementById('user-list-function');
            if (event.srcElement !== button || event.target !== button)
                event.stopPropagation();
        })
        // Add the onClick function of button
        showUser.onclick = function () {
            userList.style.display = 'block';
        }
    }

    showModal = () => {
        this.setState({
            headportraitVisible: true,
            headportraitUrl: document.getElementById('headportrait').src
        });
    }

    handleCancel = (e) => {
        this.setState({
            headportraitVisible: false,
        });
    }

    handleUsers = () => {
        const users = this.state.onlineUsers;
        let userInfo = '',
            separator = '';

        for (let key in users) {
            if (users.hasOwnProperty(key)) {
                userInfo += separator + users[key];
                separator = ',';
            }
        }
        this.setState({userInfo: userInfo})
    }

    updateSysMsg = (o, action) => {
        if (o.user.uid) {
            this.setState({
                onlineCount: o.onlineCount,
                onlineUsers: o.onlineUsers,
            });
            this.handleUsers();
        }
    }

    updateMsg = (obj) => {
        let messages = this.state.messages;
        const newMsg = {
            type: obj.type,
            username: obj.username,
            action: obj.message,
            time: generateTime()
        };
        messages = messages.concat(newMsg);
        this.setState({
            messages: messages,
            latestMessage: obj.type !== 'img' ? obj.username + "：" + obj.message : obj.username + "：[image]",
            latestTime: generateTime()
        })
        const div = document.getElementById('messages');
        let loop = setInterval(() => {
            if (obj.username === this.state.myName) {
                div.scrollTop = div.scrollHeight
            }
            if (div.scrollHeight - Math.round(div.scrollTop) == div.clientHeight) {
                clearInterval(loop)
            }
        }, 50)
    }

    handleLogout = () => {
        localStorage.removeItem('username')
        window.location.reload();
    }

    // Monitor socket
    ready = () => {
        const socket = this.state.socket;
        socket.on('login', (o) => {
            this.updateSysMsg(o, 'login');
            const div = document.getElementById('messages');
            let loop = setInterval(() => {
                if (o.user.username === this.state.myName) {
                    div.scrollTop = div.scrollHeight
                }
                if (div.scrollHeight - Math.round(div.scrollTop) == div.clientHeight) {
                    clearInterval(loop)
                }
            }, 50)
        })
        socket.on('logout', (o) => {
            this.updateSysMsg(o, 'logout');
        })
        socket.on('message', (obj) => {
            if (!(obj.type === 'img' && obj.username === this.state.myName))
                this.updateMsg(obj);
        })
        socket.on('changeAvater', (data) => {
            this.setState({headportrait:data})
        })
    }

    selectAvater = () => {
        document.getElementById('change-headportrait').click();
    }

    changeAvater = () => {
        const myName = this.state.myName,
            file = document.getElementById('change-headportrait').files[0],
            r = new FileReader(),
            that = this;
        r.onload = function () {
            getData('http://112.74.57.211:4000/upload').then((data) => {
                // Get the blob
                let arr = r.result.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const token = data,
                    file = new Blob([u8arr], {type: mime}),
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
                const img = document.getElementById('select-headportrait');
                img.src = r.result;
                observable.subscribe({
                    next(info) {
                        that.uploadProgress(Math.floor(info.total.percent))
                        const upload = document.getElementById('avater-upload');
                        upload.style.display = 'block';
                        img.style.filter = 'blur(3px)';
                    },
                    error(err) {
                        console.log(err)
                    },
                    complete: (info) => {
                        message.success('Change successfully!')
                        postData.changeAvater(key, myName).then(() => {
                            const upload = document.getElementById('avater-upload'),
                                div = document.getElementById('select-headportrait');
                            upload.style.display = 'none';
                            div.style.filter = '';
                        })
                        getData('http://112.74.57.211:4000/avater').then(data => {
                            that.setState({
                                headportrait: data,
                                myAvater: `http://cdn.algbb.fun/${key}`,
                            })
                        })
                        that.state.socket.emit('changeAvater');
                    }
                })
            }).then(() => {
                document.getElementById('selectImage').value = null;
            })
        }
        r.readAsDataURL(file);
    }

    changePassword = () => {
        const used = document.getElementById('used-password').value,
            newly = document.getElementById('new-password').value;
        if (used !== '' && newly !== '') {
            var password = document.getElementById('used-password').value
            postData.Login(this.state.myName, password)
                .then((result) => {
                    if (result[0].data === 'loginsuccess') {
                        postData.changePassword(this.state.myName, newly)
                            .then((result) => {
                                if (result[0].data === 'ok') {
                                    message.success('Change successfully!')
                                    this.setState({headportraitVisible: false})
                                    localStorage.removeItem('username')
                                    document.getElementById('used-password').value = '';
                                    document.getElementById('new-password').value = '';
                                }
                                else if (result[0].data === 'no')
                                    message.error('Error occur!')
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }
                    else if (result[0].data === 'wrongpassword') {
                        document.getElementById('used-password').value = '';
                        message.error('Wrong password!')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
        else {
            message.warning('Please finsh the form!')
        }
    }

    loadMore = () => {
        const scrollPoint = this.state.scrollPoint,
            oldChatLog = this.state.messages,
            scrollIndex = this.state.lastIndex,
            lastMessage = scrollPoint - 15 >= 0 ? 15 : scrollPoint;
        if (scrollPoint < 0)
            return;
        let newChatLog = this.state.chatLog.slice(scrollPoint - 15, scrollPoint);
        newChatLog = scrollPoint - 15 >= 0 ? this.state.chatLog.slice(scrollPoint - 15, scrollPoint)
            : this.state.chatLog.slice(0, scrollPoint)
        this.setState({
            scrollPoint: scrollPoint - 15,
            messages: newChatLog.concat(oldChatLog)
        })
        setTimeout(function () {
            let content = document.getElementsByClassName('chatLog');
            content[lastMessage].scrollIntoView()
        }, 10)
    }

    uploadProgress = (percent) => {
        this.setState({percent: percent})
    }

    render() {
        const userInfo = this.state.userInfo.split(','),
            headportrait = this.state.headportrait,
            percent = this.state.percent;
        return (
            <div id='main-background' className="main-background">
                <div className='chat-blur'></div>
                <div className="chat-background">
                    <Layout style={{borderRadius: 12}}>
                        <Sider width={350} theme='light' style={{
                            backgroundColor: 'transparent',
                            borderTopLeftRadius: 12,
                            borderBottomLeftRadius: 12
                        }}>
                            <div className='sider-tools'>
                                <div className='sider-avater'>
                                    <img id='headportrait' className='headportrait'
                                         onClick={this.showModal} src={this.state.myAvater}></img>
                                    <Modal
                                        title="个人信息"
                                        visible={this.state.headportraitVisible}
                                        onCancel={this.handleCancel}
                                        footer={null}
                                    >
                                        <Divider orientation={'left'}>修改头像</Divider>
                                        <div className='image-box'>
                                            <img id='select-headportrait'
                                                 src={this.state.headportraitUrl}
                                                 className='select-headportrait'
                                                 onClick={this.selectAvater}></img>
                                            <div id={'avater-upload'} className={'avater-upload'}
                                                 style={{display: 'none'}}>
                                                <Progress type={'circle'} percent={percent} width={40}/>
                                            </div>
                                        </div>
                                        <input id={'change-headportrait'} accept={'image/*'}
                                               className='change-headportrait'
                                               type={'file'} onChange={this.changeAvater}/>
                                        <Divider orientation={'right'}>修改密码</Divider>
                                        <Input type={'password'} id={'used-password'} placeholder={'旧密码'}/>
                                        <Input type={'password'} id={'new-password'} style={{marginTop: 20}}
                                               placeholder={'新密码'}/>
                                        <Button style={{width: '100%', marginTop: 20}} type={'primary'}
                                                onClick={this.changePassword}>确认修改</Button>
                                    </Modal>
                                </div>
                                <div className='sider-icon'>
                                    <div className='sider-icon-item first-item'>
                                        <Button shape={'circle'} type={'primary'} icon={'github'}
                                                onClick={() => open('https://github.com/zhcxk1998/ReactChatroom')}/>
                                    </div>
                                    <div className='sider-icon-item'>
                                        <Tooltip placement={'right'} title={qq} autoAdjustOverflow>
                                            <Button shape={'circle'} type={'primary'} icon={'qq'}/></Tooltip>
                                    </div>
                                    <div className='sider-icon-item'>
                                        <Tooltip placement={'right'} title={wechat} autoAdjustOverflow><Button
                                            shape={'circle'}
                                            type={'primary'}
                                            icon={'wechat'}/></Tooltip>

                                    </div>
                                    <div className='sider-icon-item'>
                                        <Button shape={'circle'} type={'primary'} icon={'message'} onClick={() => {
                                            message.warning('The Blog is not open yet.')
                                        }}/>
                                    </div>
                                    <div className='sider-icon-item'>
                                        <Button shape={'circle'} type={'primary'} icon={'setting'} onClick={() => {
                                            message.warning('The Setting is not open yet.')
                                        }}/>
                                    </div>
                                    <div className='sider-icon-item'>
                                        <Button shape={'circle'} type={'primary'} icon={'poweroff'}
                                                onClick={this.handleLogout}/>
                                    </div>
                                </div>
                            </div>
                            <div className='sider-content'>
                                <div className='sider-search'>
                                    <div className='search-box'>
                                        <Input className='search-input' placeholder={'搜索用户/群组'}
                                               prefix={<Icon type={'search'}/>}/>
                                        <Button className='search-button' shape={'circle'} icon={'plus'}
                                                onClick={() => {
                                                    message.warning('不要点人家了啦~好害羞惹')
                                                }}/>
                                    </div>
                                </div>
                                <div className='sider-items'>
                                    <div className='sider-item'>
                                        <div id='sider-item-avater' className='sider-item-avater'></div>
                                        <div className='sider-item-content'>
                                            <div className='sider-item-content-nametime'>
                                                <p className='name'>肥宅の圣地</p>
                                                <p className='time'>{this.state.latestTime}</p>
                                            </div>
                                            <div className='pre-content'>
                                                <p className='content'>{this.state.latestMessage}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Sider>
                        <Layout className={'layout'}
                                style={{
                                    backgroundColor: 'transparent',
                                    borderBottomRightRadius: 12,
                                    borderTopRightRadius: 12,
                                    position: 'relative'
                                }}>
                            <div style={{display: 'none'}} id={'user-list'} className='user-list'>
                                <div className='user-list-header'><p>群组信息</p></div>
                                <p>在线成员 {this.state.onlineCount}</p>
                                <div className='user-list-onlineuser'>
                                    {userInfo.map((user, index) => {
                                        var userAvater = headportrait.filter(item => {
                                            return item.username === user;
                                        })
                                        var avater = userAvater.length != 0 ? userAvater[0].img : 'http://cdn.algbb.fun/emoji/32.png';
                                        return <div key={index} className='user-list-onlineuser-item'>
                                            <div className='user-list-onlineuser-avater'
                                                 style={{backgroundImage: 'url("' + avater + '")'}}></div>
                                            <span className='user-list-onlineuser-username'>{user}</span>
                                        </div>
                                    })}
                                </div>
                                <p>功能 </p>
                                <Button className={'user-list-function'} id={'user-list-function'} type={'primary'}
                                        onClick={() => {
                                            message.error('退什么退！！啊！？？')
                                        }}>退出群聊</Button>
                            </div>
                            <Header className='chat-header' style={{backgroundColor: 'rgba(255, 255, 255, 0.65)'}}>
                                <div className="room-name">
                                    <span>肥宅の圣地</span>
                                    <Button type={'primary'} icon={'menu-fold'} id={'show-user'}/>
                                </div>
                            </Header>
                            <Content>
                                <div id='chatArea' className='chatArea' ref="chatArea">
                                    <Messages messages={this.state.messages} myId={this.state.myId}
                                              myName={this.state.myName} percent={this.state.percent}
                                              headportrait={this.state.headportrait}/>
                                </div>
                            </Content>
                            <Footer style={{backgroundColor: 'rgba(255, 255, 255, 0.65)'}} className='footer'>
                                <ChatInput myId={this.state.myId} myName={this.state.myName}
                                           socket={this.state.socket} updateMsg={this.updateMsg}
                                           uploadProgress={this.uploadProgress}
                                           percent={this.state.percent}/>
                            </Footer>
                        </Layout>
                    </Layout>
                </div>
            </div>)
    }
}