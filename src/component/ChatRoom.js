import React, {Component} from 'react';
import RoomStatus from './RoomStatus';
import Messages from './Messages';
import ChatInput from './ChatInput';
import {Layout, Input, Icon, Button, Drawer, Modal, message, Divider} from 'antd';
import 'antd/dist/antd.css';

var temp;

var huaji = 'data:image/jpeg;base64,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'

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
            userhtml: '',
            latestmessage: '',
            latesttime: '',
            visible: false,
            headportrait_visible: false,
            headportrait_url: '',
            headportrait: []
        };
        this.ready();
    }

    componentWillMount() {
        fetch('http://localhost:4000/avater')
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            // console.log('WillMount222')
                            // console.log(data)
                            this.setState({headportrait: data})
                        })
                }
            })
        fetch('http://localhost:4000/chathistory')
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            this.setState({
                                messages: data,
                                latestmessage: data[data.length - 1].username + "：" + data[data.length - 1].action,
                                latesttime: data[data.length - 1].time
                            })
                            if (document.getElementById('messages')) {
                                var div = document.getElementById('messages');
                                div.scrollTop = div.scrollHeight;
                            }

                        })
                }
            })
        fetch('http://localhost:4000/avater')
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
    }

    componentDidMount() {

    }

    showModal = () => {
        this.setState({
            headportrait_visible: true,
            headportrait_url: document.getElementById('headportrait').style.backgroundImage
        });
    }

    handleCancel = (e) => {
        this.setState({
            headportrait_visible: false,
        });
    }

    componentDidUpdate() {
        var str = window.getComputedStyle(document.getElementById('sider_item_avater'), null)['background'];
        var base64 = str.split('("')[1].split('")')[0]
        fetch('http://localhost:4000/headportrait', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "img=" + base64,
        })
            .then(result => result.json())
            .then(result => {
                var str = result[0].img;
            })
    }

    // 处理在线人数及用户名
    handleUsers() {
        const users = this.state.onlineUsers;
        let userhtml = '';
        let separator = '';
        for (let key in users) {
            if (users.hasOwnProperty(key)) {
                userhtml += separator + users[key];
                separator = '、';
            }
        }
        this.setState({userhtml: userhtml})
    }

    // 更新系统消息
    updateSysMsg(o, action) {
        if (o.user.uid) {
            let messages = this.state.messages;
            const newMsg = {
                type: 'system',
                username: o.user.username,
                action: action,
                time: this.generateTime()
            }
            messages = messages.concat(newMsg)
            this.setState({
                onlineCount: o.onlineCount,
                onlineUsers: o.onlineUsers,
                messages: messages,
            });
            this.handleUsers();
        }
    }

    // 发送新消息
    updateMsg(obj) {
        let messages = this.state.messages;
        const newMsg = {
            type: 'chat',
            username: obj.username,
            action: obj.message,
            time: this.generateTime()
        };
        messages = messages.concat(newMsg);
        this.setState({
            messages: messages,
            latestmessage: obj.username + "：" + obj.message,
            latesttime: this.generateTime()
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
            // console.log(o, "这是o")
        })
        socket.on('logout', (o) => {
            this.updateSysMsg(o, 'logout');
        })
        socket.on('message', (obj) => {
            this.updateMsg(obj);
            var div = document.getElementById('messages');
            var height = div.scrollTop;
            if (obj.username === this.state.username) {
                div.scrollTop = div.scrollHeight;
                height = div.scrollHeight;
            }
            else {
                div.scrollTop = height;
            }
        })
    }

    showDrawer = () => {
        this.setState({
            visible: true
        })
    }
    onclose = () => {
        this.setState({
            visible: false
        })
    }

    select_headportrait = () => {
        document.getElementById('change_headportrait').click();
    }

    get_base64 = () => {
        const username = this.state.username;
        const headportrait = this.state.headportrait;
        var file = document.getElementById('change_headportrait').files[0];
        var r = new FileReader();
        var url;

        function compress(img, width, height, ratio) {
            var canvas, ctx, img64;

            canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            img64 = canvas.toDataURL("image/png", ratio);

            return img64;
        }

        r.onload = function () {
            temp = r.result;
            if (temp.split('/')[1].split(';')[0] !== 'gif') {
                var image = new Image();
                image.src = r.result;
                image.onload = function () {
                    var img64 = compress(image, 200, 200, 0.8);
                    document.getElementById('headportrait').style.backgroundImage = "url('" + img64 + "')";
                    document.getElementById('select_headportrait').style.backgroundImage = "url('" + img64 + "')";
                    var list = document.getElementsByClassName('my_avater');
                    for (var i = 0; i < list.length; i++) {
                        list[i].style.backgroundImage = "url('" + img64 + "')";
                    }
                    var json = headportrait;
                    for (var index = 0; index < json.length; index++) {
                        if (json[index].username === username) {
                            json[index].img = img64
                        }
                    }
                    message.success('Change successfully!')
                    fetch('http://localhost:4000/update_headportrait', {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: "img=" + img64 + "&username=" + username,
                    })
                        .then(result => result.json())
                        .then(result => {

                        })
                };
            }
            else {
                document.getElementById('headportrait').style.backgroundImage = "url('" + r.result + "')";
                document.getElementById('select_headportrait').style.backgroundImage = "url('" + r.result + "')";
                var list = document.getElementsByClassName('my_avater');
                for (var i = 0; i < list.length; i++) {
                    list[i].style.backgroundImage = "url('" + r.result + "')";
                }
                var json = headportrait;
                for (var index = 0; index < json.length; index++) {
                    if (json[index].username === username) {
                        json[index].img = r.result
                    }
                }
                message.success('Change successfully!')
                fetch('http://localhost:4000/update_headportrait', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "img=" + r.result + "&username=" + username,
                })
                    .then(result => result.json())
                    .then(result => {

                    })
            }
        }
        r.readAsDataURL(file);
    }

    change_password = () => {
        var used = document.getElementById('used_password').value;
        var newly = document.getElementById('new_password').value;
        if (used !== '' && newly !== '') {
            var password = document.getElementById('used_password').value
            fetch('http://localhost:4000/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "username=" + this.state.username + "&password=" + password,
            })
                .then(result => result.json())
                .then(result => {
                    // console.log(result)
                    if (result[0].data === 'loginsuccess') {
                        fetch('http://localhost:4000/change', {
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
                                    this.setState({headportrait_visible:false})
                                    localStorage.removeItem('username')
                                    document.getElementById('used_password').value='';
                                    document.getElementById('new_password').value='';
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
                        document.getElementById('used_password').value='';
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

    render() {
        return (
            <div id='main_background' className="main_background">
                <div className="chat_background">
                    <Layout style={{borderRadius: 12}}>
                        <Sider width={350} theme='light' style={{borderTopLeftRadius: 12, borderBottomLeftRadius: 12}}>
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
                                        <input id={'change_headportrait'} accept={'image/*'} className='change_headportrait'
                                               type={'file'} onChange={this.get_base64}/>
                                        <Divider orientation={'right'}>修改密码</Divider>
                                        <Input type={'password'} id={'used_password'} placeholder={'旧密码'}/>
                                        <Input type={'password'} id={'new_password'} style={{marginTop: 20}} placeholder={'新密码'}/>
                                        <Button style={{width: '100%', marginTop: 20}} type={'primary'}
                                                onClick={this.change_password}>确认修改</Button>
                                    </Modal>
                                </div>
                                <div className='sider_icon'>
                                    <div className='sider_icon_item first_item'>
                                        <Button shape={'circle'} type={'primary'} icon={'github'}/>
                                    </div>
                                    <div className='sider_icon_item'>
                                        <Button shape={'circle'} type={'primary'} icon={'qq'}/>
                                    </div>
                                    <div className='sider_icon_item'>
                                        <Button shape={'circle'} type={'primary'} icon={'wechat'}/>
                                    </div>
                                    <div className='sider_icon_item'>
                                        <Button shape={'circle'} type={'primary'} icon={'pay-circle-o'}/>
                                    </div>
                                    <div className='sider_icon_item'>
                                        <Button shape={'circle'} type={'primary'} icon={'setting'}/>
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
                                                <p className='time'>{this.state.latesttime}</p>
                                            </div>
                                            <div className='pre_content'>
                                                <p className='content'>{this.state.latestmessage}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Sider>
                        <Layout style={{borderBottomRightRadius: 12, borderTopRightRadius: 12}}>
                            <Header style={{backgroundColor: 'white', height: 60}}>
                                <div className="room-name">
                                    <p>肥宅の圣地</p>
                                    <Button type={'default'} icon={'menu-fold'} onClick={this.showDrawer.bind(this)}/>
                                    <div>
                                        <Drawer style={{height: 510}} closable={false} title={'在线用户'}
                                                visible={this.state.visible}
                                                placement={'right'} onClose={this.onclose}>
                                            <p>{this.state.userhtml}</p>
                                        </Drawer>
                                    </div>
                                </div>
                            </Header>
                            <Content>
                                <div id='chatArea' className='chatArea' ref="chatArea">
                                    <Messages messages={this.state.messages} myId={this.state.myId}
                                              username={this.state.username}
                                              headportrait={this.state.headportrait}/>
                                </div>
                            </Content>
                            <Footer className='footer'>
                                <ChatInput myId={this.state.myId} myName={this.state.myName}
                                           socket={this.state.socket}/>
                            </Footer>
                        </Layout>
                    </Layout>
                </div>
            </div>)
    }
}