import React, {Component} from 'react';
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

const error = () => {
    message.error("Wrong Password!");
}
const success = () => {
    message.success("Login Success!")
}


class HorizontalLoginForm extends React.Component {
    componentDidUpdate() {
        console.log('hehehehe')
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLogin: false,
            isLoding: false,
            username: ''
        }
        this.loginsuccess = this.loginsuccess.bind(this);
        this.wrongpassword = this.wrongpassword.bind(this);
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();

    }

    generateUid() {
        return new Date().getTime() + "" + Math.floor(Math.random() * 9 + 1);
    }

    link_to_chat=  () => {
        this.setState({isLogin: true});
    }
    loginsuccess = () => {
        success()
        setTimeout(this.link_to_chat, 2000)
    }
    wrongpassword = () => {
        error();
    }

    loginSubmit = (e) => {
        this.setState({
            isLoding: true
        })
        e.preventDefault();
        var list;
        var t;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    data: [values]
                })
                t = [values];
                var username = t[0].userName;
                var password = t[0].password;
                this.setState({username: username})
                // console.log(username, password);
                fetch('http://192.168.1.103:4000/formitem')
                    .then(res => res.json())
                    .then(data => {
                        list = data;
                        try {
                            var temp = list.filter(function (e) {
                                return e.user.includes(username);
                            })
                            if (temp[0].pwd === password) {
                                this.loginsuccess();
                            }
                            else {
                                this.wrongpassword();
                            }
                        }
                        catch (err) {
                            alert("用户不存在!!")
                        }
                    });
                console.log('Received values of form: ', values);
            }
        });
        this.props.form.resetFields();
    };
    registSubmit = (e) => {
        e.preventDefault();
        var list;
        var t;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    data: [values]
                })
                t = [values];
                var username = t[0].userName;
                var password = t[0].password;
                // console.log(username, password);
                fetch('http://192.168.1.103:4000/form', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "userName=" + username + "&password=" + password,
                })
                console.log('Received values of form: ', values);
            }
        });
        this.props.form.resetFields();
        message.success("Regist Success!");
        window.location.reload(true);
    };

    render() {
        const flag=true;
        let renderdom;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        // Only show error after a field is touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        if (this.state.isLogin) {
            renderdom = <Chat username={this.state.username} uid={this.generateUid()}/>
        }
        else {
        renderdom = (<div className='main_background'>
                <div className='login_form'>
                    <Tabs defaultActiveKey="Login" tabBarStyle={{textAlign: 'center'}}>
                        <TabPane tab={<span><Icon type="login"/>Login</span>} key="Login">
                            <Form hideRequiredMark={flag} onSubmit={this.loginSubmit}>
                                <FormItem
                                    label='Username'
                                    validateStatus={userNameError ? 'error' : ''}
                                    help={userNameError || ''}
                                >
                                    {getFieldDecorator('userName', {
                                        rules: [{
                                            required: true,
                                            whitespace: true,
                                            message: 'Please input your username!'
                                        }],
                                    })(
                                        <Input className='login_input'
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
                                        <Input className='login_input'
                                               prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               type="password"
                                               placeholder="Password"/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button className='login_button' type="primary" htmlType="submit"
                                            loading={this.state.isLoding}>
                                        L O G I N
                                    </Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane tab={<span><Icon type="user-add"/>Regist</span>} key="Regist">
                            <Form hideRequiredMark='true' onSubmit={this.registSubmit}>
                                <FormItem
                                    label='Username'
                                    validateStatus={userNameError ? 'error' : ''}
                                    help={userNameError || ''}
                                >
                                    {getFieldDecorator('userName', {
                                        rules: [{
                                            required: true,
                                            whitespace: true,
                                            message: 'Please input your username!'
                                        }],
                                    })(
                                        <Input className='login_input'
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
                                        <Input className='login_input'
                                               prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               type="password"
                                               placeholder="Password"/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button className='login_button' type="primary" htmlType="submit">
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


const CollectionCreateForm = Form.create()(
    class extends React.Component {
        render() {
            const {visible, onCancel, onCreate, form} = this.props;
            const {getFieldDecorator} = form;
            return (
                <Modal
                    visible={visible}
                    title="登录您的账号..."
                    okText="Login"
                    cancelText="Cancel"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical" hideRequiredMark={true}>
                        <FormItem label="UserName">
                            {getFieldDecorator('userName', {
                                rules: [{required: true, message: 'Please input the title of collection!'}],
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem label="PassWord">
                            {getFieldDecorator('password', {rules: [{required: true}]})(<Input/>)}
                        </FormItem>
                        <FormItem className="collection-create-form_last-form-item">
                            {getFieldDecorator('modifier', {
                                initialValue: 'public',
                            })(
                                <Radio.Group>
                                    <Radio value="public">Public</Radio>
                                    <Radio value="private">Private</Radio>
                                </Radio.Group>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);

class CollectionsPage extends React.Component {
    state = {
        visible: false,
    };

    showModal = () => {
        this.setState({visible: true});
    }

    handleCancel = () => {
        this.setState({visible: false});
    }

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var t = [values];
            var username = t[0].userName;
            var password = t[0].password;
            fetch('http://localhost:4000/form', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "userName=" + username + "&password=" + password,
            }).then((res) => {
                if (res.ok) {
                    alert('ok');
                }
                else {
                    alert('no');
                }
            });
            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({visible: false});
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>登录</Button>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <HorizontalLoginForm/>
        )
    }
}

export default App;