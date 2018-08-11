import React, {Component} from 'react';
import RoomStatus from './RoomStatus';
import Messages from './Messages';
import ChatInput from './ChatInput';
import {Layout, Input, Icon, Button, Drawer, Modal, message, Divider} from 'antd';
import 'antd/dist/antd.css';

var temp;

var huaji='data:image/jpeg;base64,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'

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
        fetch('http://112.74.57.211 :4000/avater')
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
        fetch('http://112.74.57.211 :4000/chathistory')
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
        fetch('http://112.74.57.211 :4000/avater')
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
        fetch('http://112.74.57.211 :4000/headportrait', {
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
            var height = div.scrollHeight;
            if (obj.username === this.state.username) {
                console.log('isME')
                div.scrollTop = div.scrollHeight;
                height = div.scrollHeight;
            }
            else {
                console.log('not ME')
                // div.scrollTop = height;
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
                    fetch('http://112.74.57.211 :4000/update_headportrait', {
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
                fetch('http://112.74.57.211 :4000/update_headportrait', {
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
            fetch('http://112.74.57.211 :4000/login', {
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
                        fetch('http://112.74.57.211 :4000/change', {
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