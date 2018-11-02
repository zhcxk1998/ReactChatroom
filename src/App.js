import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import {Form, Icon, Input, Button, Modal, Radio, Tabs, notification, message} from 'antd';
import Chat from './component/Chat';
import './style.css';


const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const openNotificationWithIcon = (type) => {
    notification[type]({
        message: 'Wrong Password',
        // description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
};

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class HorizontalLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLogin: false,
            isLoding: false,
            username: '',
            // uid:''
        }
        this.loginsuccess = this.loginsuccess.bind(this);
        this.wrongpassword = this.wrongpassword.bind(this);
    }


    componentWillMount() {

    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
        if (localStorage.getItem('username') !== null) {
            this.setState({isLogin: true, username: localStorage.getItem('username')})
        }
    }

    generateUid = () => {
        return new Date().getTime() + "" + Math.floor(Math.random() * 9 + 1);
    }

    loginsuccess = () => {
        message.success("Login Success!")
        localStorage.setItem('username', this.state.username);
        localStorage.setItem('isLogin', 'true');
        setTimeout(() => {
            this.setState({isLogin: true})
        }, 1500)
    }
    wrongpassword = () => {
        message.error("Wrong Password!");
        this.setState({isLoding: false})
    }
    notsexist = () => {
        message.warning('User Not Exist!')
        this.setState({isLoding: false})
    }
    loginSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    data: [values]
                })
                const data = [values],
                    username = data[0].username,
                    password = data[0].password;
                this.setState({username: username})
                fetch('http://112.74.57.211:4000/login', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "username=" + username + "&password=" + password,
                })
                    .then(result => result.json())
                    .then(result => {
                        if (result[0].data === 'loginsuccess') {
                            this.loginsuccess()
                        }
                        else if (result[0].data === 'wrongpassword') {
                            this.wrongpassword()
                        }
                        else if (result[0].data === 'notexist') {
                            this.notsexist()
                        }
                    })
                    .catch(error => {
                        this.wrongpassword()
                        console.log(error)
                    })
            }
        });
        this.props.form.resetFields();
    };

    registSubmit = (e) => {
        e.preventDefault();
        let that = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    data: [values]
                })
                const data = [values],
                    username = data[0].username,
                    password = data[0].password;
                fetch('http://112.74.57.211:4000/regist', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "username=" + username + "&password=" + password,
                })
                    .then(result => result.json())
                    .then(result => {
                        if (result[0].data === 'registsuccess') {
                            this.setState({username: username})
                            message.success('Regist Success!')
                            setTimeout(function () {
                                // window.location.reload(true)
                                that.loginsuccess();
                            }, 1000)
                        }
                        else
                            message.warning('User Has Existed!')
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        });
        this.props.form.resetFields();
    };

    render() {
        let renderdom;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        // Only show error after a field is touched.
        const userNameError = isFieldTouched('username') && getFieldError('username');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        if (this.state.isLogin) {
            renderdom = <Chat username={this.state.username} uid={this.generateUid()}/>
        }
        else {
            renderdom = (<div className='main-background'>
                    <div className='login-form'>
                        <Tabs defaultActiveKey="Login" tabBarStyle={{textAlign: 'center'}}>
                            <TabPane tab={<span><Icon type="login"/>Login</span>} key="Login">
                                <Form hideRequiredMark={true} onSubmit={this.loginSubmit}>
                                    <FormItem
                                        label='Username'
                                        validateStatus={userNameError ? 'error' : ''}
                                        help={userNameError || ''}
                                    >
                                        {getFieldDecorator('username', {
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: 'Please input your username!'
                                            }],
                                        })(
                                            <Input className='login-input'
                                                   prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                   placeholder="Username"/>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        label='Password'
                                        validateStatus={passwordError ? 'error' : ''}
                                        help={passwordError || ''}
                                    >
                                        {getFieldDecorator('password', {
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: 'Please input your Password!'
                                            }],
                                        })(
                                            <Input className='login-input'
                                                   prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                   type="password"
                                                   placeholder="Password"/>
                                        )}
                                    </FormItem>
                                    <FormItem>
                                        <Button className='login-button' type="primary" htmlType="submit"
                                                loading={this.state.isLoding}>
                                            L O G I N
                                        </Button>
                                    </FormItem>
                                </Form>
                            </TabPane>
                            <TabPane tab={<span><Icon type="user-add"/>Regist</span>} key="Regist">
                                <Form hideRequiredMark={true} onSubmit={this.registSubmit}>
                                    <FormItem
                                        label='Username'
                                        validateStatus={userNameError ? 'error' : ''}
                                        help={userNameError || ''}
                                    >
                                        {getFieldDecorator('username', {
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: 'Please input your username!'
                                            }],
                                        })(
                                            <Input className='login-input'
                                                   prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                   placeholder="Username"/>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        label='Password'
                                        validateStatus={passwordError ? 'error' : ''}
                                        help={passwordError || ''}
                                    >
                                        {getFieldDecorator('password', {
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: 'Please input your Password!'
                                            }],
                                        })(
                                            <Input className='login-input'
                                                   prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                   type="password"
                                                   placeholder="Password"/>
                                        )}
                                    </FormItem>
                                    <FormItem>
                                        <Button className='login-button' type="primary" htmlType="submit">
                                            R E G I S T
                                        </Button>
                                    </FormItem>
                                </Form>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            )
        }
        return (
            <div>
                {renderdom}
            </div>
        );
    }
}

HorizontalLoginForm = Form.create()(HorizontalLoginForm);

class App extends React.Component {
    render() {
        return (
            <HorizontalLoginForm/>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));