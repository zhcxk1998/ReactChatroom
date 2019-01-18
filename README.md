# BB小天使聊天室:sunny:~

## 介绍
BB小天使聊天室是一个主要面向校园闲置物品交易
、学生互帮互助、吹水吐槽等功能的聊天室:pig:

在线地址：[https://chat.algbb.fun/](https://chat.algbb.fun/)

## 技术选型

前端：React + Antd

后端：Node.js + Mysql

其他：七牛云存储 + socket.io

## 功能
> 已完成
1. 群聊
2. 发送文本、图片消息
3. 发送emoji表情
4. 显示在线用户

> 待完成
1. 实现私聊
2. 搜索/添加好友
3. 搜索/创建群聊
4. 自定义主题

## 运行截图

![](http://cdn.algbb.fun/show1.png)
![](http://cdn.algbb.fun/show2.png)
![](http://cdn.algbb.fun/show4.png)

## 安装运行

* ##### 第一步
    * 克隆项目到本地`git clone http://github.com/zhcxk1998/ReactChatroom
* #### 第二步
    * `npm i`安装依赖
* #### 第三步
    * 运行服务端`node server.js`
* #### 第四步
    * 运行客户端`webpack-dev-server`
* #### 第五步
    * 浏览器输入`localhost:8080`

## 目录结构

    |-- [build]                   // webpack构建
    |-- [public]                  // 静态资源
    |-- [sceneshots]              // 运行截图
    |-- [src]                     // 客户端代码
        -- [component]            // 组件代码
    |-- server.js                 // 服务端代码
    |-- .gitignore                // git忽略配置
    |-- package-lock.json         // npm
    |-- package.json              // npm
    ...
