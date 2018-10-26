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
            lastIndex: 15
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
                                let user_avater = headportrait.filter(function (e) {
                                    return e.username === user;
                                });
                                const avater = user_avater.length !== 0 ? user_avater[0].img : 'http://cdn.algbb.fun/emoji/32.png';
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
        let user_list = document.getElementById("user_list"),
            show_user = document.getElementById("show_user");
        document.addEventListener('click', function (event) {
            let e = event || window.event,
                elem = e.srcElement || e.target;
            // Excepted the show_button
            if (elem !== show_user)
                user_list.style.display = 'none';
        })
        // Solve click userList will hide it
        user_list.addEventListener('click', function (event) {
            event = event || window.event;
            let button = document.getElementById('user_list_function');
            if (event.srcElement !== button || event.target !== button)
                event.stopPropagation();
        })
        // Add the onClick function of button
        show_user.onclick = function () {
            user_list.style.display = 'block';
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
        const content = document.getElementsByClassName('chatLog');
        if (content.length !== 0 && o.user.username === this.state.username) {
            content[content.length - 1].scrollIntoView();
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
            const content = document.getElementsByClassName('chatLog');
            if (content.length !== 0 && o.user.username === this.state.username) {
                content[content.length - 1].scrollIntoView();
            }
        })
        socket.on('logout', (o) => {
            this.updateSysMsg(o, 'logout');
        })
        socket.on('message', (obj) => {
            this.updateMsg(obj);
            let content = document.getElementsByClassName('chatLog');
            if (obj.username === this.state.username)
                content[content.length - 1].scrollIntoView({behavior: "smooth"});
        })
    }

    selectAvater = () => {
        document.getElementById('change_headportrait').click();
    }

    changeAvater = () => {
        const username = this.state.username,
            file = document.getElementById('change_headportrait').files[0],
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
                                        let list = document.getElementsByClassName('my_avater');
                                        document.getElementById('headportrait').style.backgroundImage = url;
                                        document.getElementById('select_headportrait').style.backgroundImage = url;
                                        for (let item of list) {
                                            item.style.backgroundImage = url;
                                        }
                                        headportrait.filter((item) => item.username === username).map((item) => {
                                            item.img = `http://cdn.algbb.fun/${JSON.parse(xhr.responseText).key}`;
                                        })
                                        message.success('Change successfully!')
                                        fetch('http://112.74.57.211:4000/update_headportrait', {
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
        const used = document.getElementById('used_password').value,
            newly = document.getElementById('new_password').value;
        if (used !== '' && newly !== '') {
            var password = document.getElementById('used_password').value
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
                                    document.getElementById('used_password').value = '';
                                    document.getElementById('new_password').value = '';
                                }
                                else if (result[0].data === 'no')
                                    message.error('Error occur!')
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }
                    else if (result[0].data === 'wrongpassword') {
                        document.getElementById('used_password').value = '';
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
            old_chatlog = this.state.messages,
            scrollIndex = this.state.lastIndex,
            lastMessage = scrollPoint - 15 >= 0 ? 15 : scrollPoint;
        if (scrollPoint < 0)
            return;
        let new_chatlog = this.state.chatLog.slice(scrollPoint - 15, scrollPoint);
        new_chatlog = scrollPoint - 15 >= 0 ? this.state.chatLog.slice(scrollPoint - 15, scrollPoint)
            : this.state.chatLog.slice(0, scrollPoint)
        this.setState({
            scrollPoint: scrollPoint - 15,
            messages: new_chatlog.concat(old_chatlog)
        })
        setTimeout(function () {
            let content = document.getElementsByClassName('chatLog');
            content[lastMessage].scrollIntoView()
        }, 50)
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
                <div className='chat_blur'></div>
                <div className="chat_background">
                    <Layout style={{borderRadius: 12}}>
                        <Sider width={350} theme='light' style={{
                            backgroundColor: 'transparent',
                            borderTopLeftRadius: 12,
                            borderBottomLeftRadius: 12
                        }}>
                            <div className='sider_tools'>
                                <div className='sider_avater'>
                                    <button id='headportrait' className='headportrait'
                                            onClick={this.showModal}></button>
                                    <Modal
                                        title="个人信息"
                                        visible={this.state.headportraitVisible}
                                        onCancel={this.handleCancel}
                                        footer={null}
                                    >
                                        <Divider orientation={'left'}>修改头像</Divider>
                                        <button id='select_headportrait'
                                                style={{backgroundImage: this.state.headportraitUrl}}
                                                className='select_headportrait'
                                                onClick={this.selectAvater}></button>
                                        <input id={'change_headportrait'} accept={'image/*'}
                                               className='change_headportrait'
                                               type={'file'} onChange={this.changeAvater}/>
                                        <Divider orientation={'right'}>修改密码</Divider>
                                        <Input type={'password'} id={'used_password'} placeholder={'旧密码'}/>
                                        <Input type={'password'} id={'new_password'} style={{marginTop: 20}}
                                               placeholder={'新密码'}/>
                                        <Button style={{width: '100%', marginTop: 20}} type={'primary'}
                                                onClick={this.changePassword}>确认修改</Button>
                                    </Modal>
                                </div>
                                <div className='sider_icon'>
                                    <div className='sider_icon_item first_item'>
                                        <Button shape={'circle'} type={'primary'} icon={'github'}
                                                onClick={() => open('https://github.com/zhcxk1998/ReactChatroom')}/>
                                    </div>
                                    <div className='sider_icon_item'>
                                        <Tooltip placement={'right'} title={qq} autoAdjustOverflow>
                                            <Button shape={'circle'} type={'primary'} icon={'qq'}/></Tooltip>
                                    </div>
                                    <div className='sider_icon_item'>
                                        <Tooltip placement={'right'} title={wechat} autoAdjustOverflow><Button
                                            shape={'circle'}
                                            type={'primary'}
                                            icon={'wechat'}/></Tooltip>

                                    </div>
                                    <div className='sider_icon_item'>
                                        <Button shape={'circle'} type={'primary'} icon={'message'} onClick={() => {
                                            message.warning('The Blog is not open yet.')
                                        }}/>
                                    </div>
                                    <div className='sider_icon_item'>
                                        <Button shape={'circle'} type={'primary'} icon={'setting'} onClick={() => {
                                            message.warning('The Setting is not open yet.')
                                        }}/>
                                    </div>
                                    <div className='sider_icon_item'>
                                        <Button shape={'circle'} type={'primary'} icon={'poweroff'}
                                                onClick={this.handleLogout}/>
                                    </div>
                                </div>
                            </div>
                            <div className='sider_content'>
                                <div className='sider_search'>
                                    <div className='search_box'>
                                        <Input className='search_input' placeholder={'搜索用户/群组'}
                                               prefix={<Icon type={'search'}/>}/>
                                        <Button className='search_button' shape={'circle'} icon={'plus'}
                                                onClick={() => {
                                                    message.warning('不要点人家了啦~好害羞惹')
                                                }}/>
                                    </div>
                                </div>
                                <div className='sider_items'>
                                    <div className='sider_item'>
                                        <div id='sider_item_avater' className='sider_item_avater'></div>
                                        <div className='sider_item_content'>
                                            <div className='sider_item_content_nametime'>
                                                <p className='name'>肥宅の圣地</p>
                                                <p className='time'>{this.state.latestTime}</p>
                                            </div>
                                            <div className='pre_content'>
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
                            <div style={{display: 'none'}} id={'user_list'} className='user_list'>
                                <div className='user_list_header'><p>群组信息</p></div>
                                <p>在线成员 {this.state.onlineCount}</p>
                                <div className='user_list_onlineuser'>
                                    {userinfo.map(function (user) {
                                        var user_avater = headportrait.filter(function (item) {
                                            return item.username === user;
                                        })
                                        var avater = user_avater.length != 0 ? user_avater[0].img : 'http://cdn.algbb.fun/emoji/32.png';
                                        return <div className='user_list_onlineuser_item'>
                                            <div className='user_list_onlineuser_avater'
                                                 style={{backgroundImage: 'url("' + avater + '")'}}></div>
                                            <span className='user_list_onlineuser_username'>{user}</span>
                                        </div>
                                    })}
                                </div>
                                <p>功能 </p>
                                <Button className={'user_list_function'} id={'user_list_function'} type={'primary'}
                                        onClick={() => {
                                            message.error('退什么退！！啊！？？')
                                        }}>退出群聊</Button>
                            </div>
                            <Header className='chat_header' style={{backgroundColor: 'rgba(255, 255, 255, 0.65)'}}>
                                <div className="room-name">
                                    <p>肥宅の圣地</p>
                                    <Button type={'primary'} icon={'menu-fold'} id={'show_user'}/>
                                </div>
                            </Header>
                            <Content>
                                <div id='chatArea' className='chatArea' ref="chatArea">
                                    <Messages messages={this.state.messages} myId={this.state.myId}
                                              username={this.state.username}
                                              headportrait={this.state.headportrait}/>
                                </div>
                            </Content>
                            <Footer style={{backgroundColor: 'rgba(255, 255, 255, 0.65)'}} className='footer'>
                                <ChatInput myId={this.state.myId} myName={this.state.myName}
                                           socket={this.state.socket}/>
                            </Footer>
                        </Layout>
                    </Layout>
                </div>
            </div>)
    }
}