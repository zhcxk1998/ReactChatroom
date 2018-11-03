import React from 'react';
import {Menu, Button, Tabs} from 'antd';

const TabPane = Tabs.TabPane;

const menu = (onClick) => (
    <Menu style={{marginBottom: 20}}>
        <Menu.Item>
            <Button icon={'picture'} onClick={onClick}>发送图片</Button>
        </Menu.Item>
        <Menu.Item>
            <Button icon={'smile-o'}>发表情包</Button>
        </Menu.Item>
        <Menu.Item>
            <Button icon={'heart-o'}>发送爱心</Button>
        </Menu.Item>
    </Menu>
);

const emoji = (onClick) => (
    <Menu style={{marginBottom: 20, marginLeft: -30}}>
        <div className='emoji'>
            <Tabs defaultActivekey={'1'}>
                <TabPane tab="贴吧表情" key="1">
                    <div className='emoji-content'>
                        {Array.from({length: 33}, (item, index) => index + 1).map((item,index) => {
                            let name = item.toString().length > 1 ? item.toString() : '0' + item.toString();
                            return <div key={index} className='emoji-item' onClick={() => onClick(name)}>
                                <div
                                    style={{backgroundImage: 'url("' + `http://cdn.algbb.fun/emoji/${name}.png` + '")'}}/>
                            </div>
                        })}
                    </div>
                </TabPane>
            </Tabs>
        </div>
    </Menu>
);

module.exports = {
    menu: (onClick) => menu(onClick),
    emoji: (onClick) => emoji(onClick),
};