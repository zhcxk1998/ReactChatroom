import React, {Component} from 'react';
import Messages from './Messages';
import ChatInput from './ChatInput';
import {Layout, Input, Icon, Button, Drawer, Modal, message, Divider, Tooltip, List} from 'antd';

const {Header, Footer, Sider, Content} = Layout;

export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        const socket = this.props.socket;
        this.state = {
            myId: this.props.uid,
            myName: this.props.username,
            uid: this.props.uid,
            username: this.props.username,
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
        };
        this.ready();
    }

    componentDidMount() {
        // Get the chatLog
        fetch('http://112.74.57.211:4000/chatLog')
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            this.setState({
                                messages: data.slice(data.length - 15, data.length),
                                chatLog: data,
                                scrollPoint: data.length - 15,
                                latestMessage: data[data.length - 1].type !== 'img' ? data[data.length - 1].username + "：" + data[data.length - 1].action : data[data.length - 1].username + "：" + '[image]',
                                latestTime: data[data.length - 1].time,
                            })
                        })
                }
            })
        // Get the user avater
        fetch('http://112.74.57.211:4000/avater')
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            const user = this.state.username;
                            let headportrait = data;
                            this.setState({headportrait: data})
                            if (this.state.headportrait.length !== 0) {
                                let userAvater = headportrait.filter(function (e) {
                                    return e.username === user;
                                });
                                const avater = userAvater.length !== 0 ? userAvater[0].img : 'http://cdn.algbb.fun/emoji/32.png';
                                document.getElementById('headportrait').style.backgroundImage = "url('" + avater + "')";
                            }
                        })
                }
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
            headportraitUrl: document.getElementById('headportrait').style.backgroundImage
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
            time: this.generateTime()
        };
        messages = messages.concat(newMsg);
        this.setState({
            messages: messages,
            latestMessage: obj.type !== 'img' ? obj.username + "：" + obj.message : obj.username + "：[image]",
            latestTime: this.generateTime()
        })
        const div = document.getElementById('messages');
        let loop = setInterval(() => {
            if (obj.username === this.state.username) {
                div.scrollTop = div.scrollHeight
            }
            if (div.scrollHeight - Math.round(div.scrollTop) == div.clientHeight) {
                clearInterval(loop)
            }
        }, 50)
    }

    generateTime = () => {
        let hour = new Date().getHours(),
            minute = new Date().getMinutes();
        hour = (hour == 0) ? '00' : hour;
        minute = (minute < 10) ? '0' + minute : minute;
        return hour + ':' + minute;
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
                if (o.user.username === this.state.username) {
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
            if (!(obj.type === 'img' && obj.username === this.state.username))
                this.updateMsg(obj);
        })
    }

    selectAvater = () => {
        document.getElementById('change-headportrait').click();
    }

    changeAvater = () => {
        const username = this.state.username,
            file = document.getElementById('change-headportrait').files[0],
            r = new FileReader(),
            headportrait = this.state.headportrait;
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
                                    if (xhr.readyState === 4) {
                                        const url = `url(http://cdn.algbb.fun/${JSON.parse(xhr.responseText).key})`;
                                        let list = document.getElementsByClassName('my-avater');
                                        document.getElementById('headportrait').style.backgroundImage = url;
                                        document.getElementById('select-headportrait').style.backgroundImage = url;
                                        for (let item of list) {
                                            item.style.backgroundImage = url;
                                        }
                                        headportrait.filter((item) => item.username === username).map((item) => {
                                            item.img = `http://cdn.algbb.fun/${JSON.parse(xhr.responseText).key}`;
                                        })
                                        message.success('Change successfully!')
                                        fetch('http://112.74.57.211:4000/update-headportrait', {
                                            method: 'POST',
                                            mode: 'cors',
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                            body: "img=" + "http://cdn.algbb.fun/" + JSON.parse(xhr.responseText).key + "&username=" + username,
                                        })
                                            .then(result => result.json())
                                            .then(result => {

                                            })
                                    }
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
        }
        r.readAsDataURL(file);
    }

    changePassword = () => {
        const used = document.getElementById('used-password').value,
            newly = document.getElementById('new-password').value;
        if (used !== '' && newly !== '') {
            var password = document.getElementById('used-password').value
            fetch('http://112.74.57.211:4000/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "username=" + this.state.username + "&password=" + password,
            })
                .then(result => result.json())
                .then(result => {
                    if (result[0].data === 'loginsuccess') {
                        fetch('http://112.74.57.211:4000/change', {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: "username=" + this.state.username + "&password=" + newly,
                        })
                            .then(result => result.json())
                            .then(result => {
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
        const userinfo = this.state.userInfo.split(','),
            headportrait = this.state.headportrait,
            qq = <div
                style={{display: 'flex', flexDirection: 'column ', alignItems: 'center', justifyContent: 'center'}}><img
                width={100} height={100}
                src={'http://cdn.algbb.fun/icon/qq.png'}></img>
                <p style={{textAlign: 'center', fontSize: 12}}>QQ号：464203147</p>
            </div>,
            wechat = <div
                style={{display: 'flex', flexDirection: 'column ', alignItems: 'center', justifyContent: 'center'}}>
                <img width={100} height={100}
                     src={'http://cdn.algbb.fun/icon/wechat.jpg'}></img>
                <p style={{textAlign: 'center', fontSize: 12}}>微信号：zhcxk1998</p>
            </div>
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
                                    <button id='headportrait' className='headportrait'
                                            onClick={this.showModal}></button>
                                    <Modal
                                        title="个人信息"
                                        visible={this.state.headportraitVisible}
                                        onCancel={this.handleCancel}
                                        footer={null}
                                    >
                                        <Divider orientation={'left'}>修改头像</Divider>
                                        <button id='select-headportrait'
                                                style={{backgroundImage: this.state.headportraitUrl}}
                                                className='select-headportrait'
                                                onClick={this.selectAvater}></button>
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
                                    {userinfo.map(function (user) {
                                        var userAvater = headportrait.filter(function (item) {
                                            return item.username === user;
                                        })
                                        var avater = userAvater.length != 0 ? userAvater[0].img : 'http://cdn.algbb.fun/emoji/32.png';
                                        return <div className='user-list-onlineuser-item'>
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
                                              username={this.state.username} percent={this.state.percent}
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