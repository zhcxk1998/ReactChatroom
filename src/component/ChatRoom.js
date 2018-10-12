import React, {Component} from 'react';
import RoomStatus from './RoomStatus';
import Messages from './Messages';
import ChatInput from './ChatInput';
import {Layout, Input, Icon, Button, Drawer, Modal, message, Divider, Tooltip, List} from 'antd';

var huaji = 'http://cdn.algbb.fun/emoji/32.png'

const {Header, Footer, Sider, Content} = Layout;


const qq = <div style={{display: 'flex', flexDirection: 'column ', alignItems: 'center', justifyContent: 'center'}}><img
    width={100} height={100}
    src={'http://cdn.algbb.fun/icon/qq.png'}></img>
    <p style={{textAlign: 'center', fontSize: 12}}>QQ号：464203147</p>
</div>

const wechat = <div style={{display: 'flex', flexDirection: 'column ', alignItems: 'center', justifyContent: 'center'}}>
    <img width={100} height={100}
         src={'http://cdn.algbb.fun/icon/wechat.jpg'}></img>
    <p style={{textAlign: 'center', fontSize: 12}}>微信号：zhcxk1998</p>
</div>
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
            userhtml: '',
            latestMessage: '',
            latestTime: '',
            visible: false,
            headportrait_visible: false,
            headportrait_url: '',
            headportrait: [],
            user_visible: false,
            chatLog: [],
            scrollPoint: 0,
            lastIndex: 15
        };
        this.ready();
    }

    componentDidMount() {
        fetch('http://112.74.57.211:4000/chathistory')
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
        fetch('http://112.74.57.211:4000/avater')
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            var user = this.state.username;
                            var headportrait = data;
                            this.setState({headportrait: data})
                            if (this.state.headportrait.length !== 0) {
                                var user_avater = headportrait.filter(function (e) {
                                    return e.username === user;
                                });
                                var avater = user_avater[0].img;
                                if (avater == null) {
                                    document.getElementById('headportrait').style.backgroundImage = "url('" + huaji + "')";
                                }
                                else {
                                    document.getElementById('headportrait').style.backgroundImage = "url('" + avater + "')";
                                }
                            }
                        })
                }
            })
        document.getElementById('messages').addEventListener('scroll', function () {
            if (document.getElementById('messages').scrollTop == 0) {
                document.getElementById('scroll').click()
            }
        })
    }

    showModal = () => {
        this.setState({
            headportrait_visible: true,
            headportrait_url: document.getElementById('headportrait').style.backgroundImage
        });
    }
    showUser = () => {
        document.getElementById('user_list').style.display = '';
        console.log(document.getElementById('user_list').style.display)
    }

    handleCancel = (e) => {
        this.setState({
            headportrait_visible: false,
        });
    }

    // 处理在线人数及用户名
    handleUsers() {
        const users = this.state.onlineUsers;
        let userhtml = '';
        let separator = '';

        for (let key in users) {
            if (users.hasOwnProperty(key)) {
                userhtml += separator + users[key];
                separator = ',';
            }
        }
        this.setState({userhtml: userhtml})
    }

    // 更新系统消息
    updateSysMsg(o, action) {
        if (o.user.uid) {
            // let messages = this.state.messages;
            // const newMsg = {
            //     type: 'system',
            //     username: o.user.username,
            //     action: action,
            //     time: this.generateTime()
            // }
            // messages = messages.concat(newMsg)
            this.setState({
                onlineCount: o.onlineCount,
                onlineUsers: o.onlineUsers,
            });
            this.handleUsers();
        }
    }

    // 发送新消息
    updateMsg(obj) {
        let messages = this.state.messages;
        const newMsg = {
            type: obj.type,
            username: obj.username,
            action: obj.message,
            time: this.generateTime()
        };
        messages = messages.concat(newMsg);
        this.setState({
            messages:messages,
            latestMessage: obj.type !== 'img' ? obj.username + "：" + obj.message : obj.username + "：[image]",
            latestTime: this.generateTime()
        })
    }

    // 生成时间
    generateTime() {
        let hour = new Date().getHours(),
            minute = new Date().getMinutes();
        hour = (hour == 0) ? '00' : hour;
        minute = (minute < 10) ? '0' + minute : minute;
        return hour + ':' + minute;
    }

    handleLogout() {
        localStorage.removeItem('username')
        window.location.reload();
    }

    // 开始监控socket
    ready() {
        const socket = this.state.socket;
        socket.on('login', (o) => {
            this.updateSysMsg(o, 'login');
        })
        socket.on('logout', (o) => {
            this.updateSysMsg(o, 'logout');
        })
        socket.on('message', (obj) => {
            this.updateMsg(obj);
            var content = document.getElementsByClassName('chatLog');
            if (obj.username === this.state.username)
                content[content.length - 1].scrollIntoView({behavior: "smooth"});
        })
        document.onclick = function (event) {
            var e = event || window.event;
            var elem = e.srcElement || e.target;

            while (elem) {
                if (elem.className == "user_list") {
                    return;
                }
                elem = elem.parentNode;
            }
            //隐藏div的方法
            document.getElementsByClassName('user_list')[0].style.display = 'none';
        }
    }

    select_headportrait = () => {
        document.getElementById('change_headportrait').click();
    }

    get_base64 = () => {
        const username = this.state.username;
        const headportrait = this.state.headportrait;
        var file = document.getElementById('change_headportrait').files[0];
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
                                        document.getElementById('headportrait').style.backgroundImage = "url('" + "http://cdn.algbb.fun/" + JSON.parse(xhr.responseText).key + "')";
                                        document.getElementById('select_headportrait').style.backgroundImage = "url('" + "http://cdn.algbb.fun/" + JSON.parse(xhr.responseText).key + "')";
                                        var list = document.getElementsByClassName('my_avater');
                                        for (var i = 0; i < list.length; i++) {
                                            list[i].style.backgroundImage = "url('" + "http://cdn.algbb.fun/" + JSON.parse(xhr.responseText).key + "')";
                                        }
                                        var json = headportrait;
                                        for (var index = 0; index < json.length; index++) {
                                            if (json[index].username === username) {
                                                json[index].img = "http://cdn.algbb.fun/" + JSON.parse(xhr.responseText).key
                                            }
                                        }
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
                            document.getElementById('sendImage').value = null;
                        })
                    }
                })
        }
        r.readAsDataURL(file);
    }

    change_password = () => {
        var used = document.getElementById('used_password').value;
        var newly = document.getElementById('new_password').value;
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
                                    this.setState({headportrait_visible: false})
                                    localStorage.removeItem('username')
                                    document.getElementById('used_password').value = '';
                                    document.getElementById('new_password').value = '';
                                }
                                else if (result[0].data === 'no') {
                                    message.error('Error occur!')
                                }
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

    jump = (url) => {
        open(url)
    }


    concat() {
        var scrollPoint = this.state.scrollPoint;
        if (scrollPoint<0)
            return
        var new_chatlog = this.state.chatLog.slice(scrollPoint - 15, scrollPoint);
        new_chatlog = scrollPoint - 15 >= 0 ? this.state.chatLog.slice(scrollPoint - 15, scrollPoint)
            : this.state.chatLog.slice(0, scrollPoint)
        var old_chatlog = this.state.messages;
        var scrollIndex = this.state.lastIndex;
        var lastMessage = scrollPoint - 15 >= 0 ? 15 : scrollPoint;
        this.setState({
            scrollPoint: scrollPoint - 15,
            messages: new_chatlog.concat(old_chatlog)
        })
        setTimeout(function () {
            var content = document.getElementsByClassName('chatLog');
            content[lastMessage].scrollIntoView()
        }, 50)
    }

    render() {
        var userinfo = this.state.userhtml.split(',');
        var headportrait = this.state.headportrait;
        return (
            <div id='main_background' className="main_background">
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
                                        visible={this.state.headportrait_visible}
                                        onCancel={this.handleCancel}
                                        footer={null}
                                    >
                                        <Divider orientation={'left'}>修改头像</Divider>
                                        <button id='select_headportrait'
                                                style={{backgroundImage: this.state.headportrait_url}}
                                                className='select_headportrait'
                                                onClick={this.select_headportrait}></button>
                                        <input id={'change_headportrait'} accept={'image/*'}
                                               className='change_headportrait'
                                               type={'file'} onChange={this.get_base64}/>
                                        <Divider orientation={'right'}>修改密码</Divider>
                                        <Input type={'password'} id={'used_password'} placeholder={'旧密码'}/>
                                        <Input type={'password'} id={'new_password'} style={{marginTop: 20}}
                                               placeholder={'新密码'}/>
                                        <Button style={{width: '100%', marginTop: 20}} type={'primary'}
                                                onClick={this.change_password}>确认修改</Button>
                                    </Modal>
                                </div>
                                <div className='sider_icon'>
                                    <div className='sider_icon_item first_item'>
                                        <Button shape={'circle'} type={'primary'} icon={'github'}
                                                onClick={() => this.jump('https://github.com/zhcxk1998/ReactChatroom')}/>
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
                                            this.concat()
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
                                        <Button className='search_button' shape={'circle'} icon={'plus'}/>
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
                                <div className='user_list_header'><span>群组信息</span></div>
                                <span className='user_list_onlinecount'>在线成员 {this.state.onlineCount}</span>
                                <div className='user_list_onlineuser'>
                                    {userinfo.map(function (user) {
                                        var user_avater = headportrait.filter(function (item) {
                                            return item.username === user;
                                        })
                                        var avater;
                                        if (user_avater.length != 0)
                                            avater = user_avater[0].img;
                                        else
                                            avater = huaji;
                                        return <div className='user_list_onlineuser_item'>
                                            <div className='user_list_onlineuser_avater'
                                                 style={{backgroundImage: 'url("' + avater + '")'}}></div>
                                            <span className='user_list_onlineuser_username'>{user}</span>

                                        </div>
                                    })}
                                </div>
                            </div>
                            <Header className='chat_header' style={{backgroundColor: 'rgba(255, 255, 255, 0.65)'}}>
                                <div className="room-name">
                                    <p>肥宅の圣地</p>
                                    <Button type={'primary'} icon={'menu-fold'} onClick={this.showUser}/>
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
                            <button id={'scroll'} style={{display: 'none'}} onClick={this.concat.bind(this)}></button>
                        </Layout>
                    </Layout>
                </div>
            </div>)
    }
}