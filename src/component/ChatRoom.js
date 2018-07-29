import React, {Component} from 'react';
import RoomStatus from './RoomStatus';
import Messages from './Messages';
import ChatInput from './ChatInput';
import {Layout, Input, Icon, Button} from 'antd';
import 'antd/dist/antd.css';

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
            latesttime: ''
        };
        this.ready();
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
    generateMsgId() {
        return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
    }

    // 更新系统消息
    updateSysMsg(o, action) {
        let messages = this.state.messages;
        const newMsg = {
            type: 'system',
            username: o.user.username,
            uid: o.user.uid,
            action: action,
            msgId: this.generateMsgId(),
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

    // 发送新消息
    updateMsg(obj) {
        let messages = this.state.messages;
        const newMsg = {
            type: 'chat',
            username: obj.username,
            uid: obj.uid,
            action: obj.message,
            msgId: this.generateMsgId(),
            time: this.generateTime()
        };
        messages = messages.concat(newMsg);
        this.setState({
            messages: messages,
            latestmessage: obj.username + "：" + obj.message,
            latesttime: this.generateTime()
        })
        console.log(this.state.messages)
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
        })
        socket.on('logout', (o) => {
            this.updateSysMsg(o, 'logout');
        })
        socket.on('message', (obj) => {
            this.updateMsg(obj)
        })
    }

    render() {
        return (
            <div className="main_background">
                <div className="chat_background">
                    <Layout style={{borderRadius: 12}}>
                        <Sider width={350} theme='light' style={{borderTopLeftRadius: 12, borderBottomLeftRadius: 12}}>
                            <div className='sider_tools'>
                                {/*<div className="button">*/}
                                {/*<button onClick={this.handleLogout}>登出</button>*/}
                                {/*</div>*/}
                                <div className='sider_avater'>
                                    <div className='headportrait'></div>
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
                                        <Button shape={'circle'} type={'primary'} icon={'poweroff'} onClick={this.handleLogout}/>
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
                                        <div className='sider_item_avater'></div>
                                        <div className='sider_item_content'>
                                            <div className='sider_item_content_nametime'>
                                                <p className='name'>BBの聊天室</p>
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
                                    <h3>BBの聊天室</h3>
                                    {/*<RoomStatus onlineCount={this.state.onlineCount} userhtml={this.state.userhtml}/>*/}
                                </div>
                            </Header>
                            <Content>
                                <div id='chatArea' className='chatArea' ref="chatArea">
                                    <Messages messages={this.state.messages} myId={this.state.myId}/>
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