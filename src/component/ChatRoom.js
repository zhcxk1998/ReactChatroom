import React, {Component} from 'react';
import RoomStatus from './RoomStatus';
import Messages from './Messages';
import ChatInput from './ChatInput';
import {Layout, Input, Icon, Button, Drawer} from 'antd';
import 'antd/dist/antd.css';
import $ from 'jquery';

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
            visible: false
        };
        this.ready();
    }

    componentDidMount() {
        fetch('http://192.168.1.104:4000/chathistory')
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            // console.log(data)
                            this.setState({
                                messages: data,
                                latestmessage: data[data.length - 1].username + "：" + data[data.length - 1].action,
                                latesttime: data[data.length - 1].time
                            })
                            console.log(this.state.messages, 'first load')
                            var div = document.getElementById('messages');
                            div.scrollTop = div.scrollHeight;
                        })

                }
            })
        var s = 'Hello World!';
        var enc = window.btoa(s);
        var dec = window.atob(enc);
        var res = "Encode:" + enc + ",Decode:" + dec;
        console.log(res);
        // console.log(window.getComputedStyle(document.getElementById('headportrait'),null)['background'])
        // console.log(window.getComputedStyle(document.getElementById('sider_item_avater'),null)['background'])
        // document.getElementById('chat_avater').style.backgroundImage='url("")'

    }

    componentDidUpdate() {
        var str = window.getComputedStyle(document.getElementById('sider_item_avater'), null)['background'];
        var base64 = str.split('("')[1].split('")')[0]
        fetch('http://192.168.1.104:4000/headportrait', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "img=" + base64,
        })
            .then(result=>result.json())
            .then(result=>{
                // console.log(result[0].img)
            })
        // document.getElementById('headportrait').style.backgroundImage = 'url("' + base64 + '")';
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

    // 生成消息id
    // generateMsgId() {
    //     return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
    // }

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
            console.log(this.state.onlineCount, this.state.onlineUsers, "这是用户信息")
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
        window.location.reload();
    }

    // 开始监控socket
    ready() {
        const socket = this.state.socket;
        socket.on('login', (o) => {
            this.updateSysMsg(o, 'login');
            console.log(o, "这是o")
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

    render() {
        return (
            <div id='main_background' className="main_background">
                <div className="chat_background">
                    <Layout style={{borderRadius: 12}}>
                        <Sider width={350} theme='light' style={{borderTopLeftRadius: 12, borderBottomLeftRadius: 12}}>
                            <div className='sider_tools'>
                                <div className='sider_avater'>
                                    <div id='headportrait' className='headportrait'></div>
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
                                    {/*<RoomStatus onlineCount={this.state.onlineCount} userhtml={this.state.userhtml}/>*/}
                                </div>
                            </Header>
                            <Content>
                                <div id='chatArea' className='chatArea' ref="chatArea">
                                    <Messages messages={this.state.messages} myId={this.state.myId}
                                              username={this.state.username}/>
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