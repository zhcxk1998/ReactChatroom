import React from 'react';

const qq = (
    <div
        style={{display: 'flex', flexDirection: 'column ', alignItems: 'center', justifyContent: 'center'}}><img
        width={100} height={100}
        src={'http://cdn.algbb.fun/icon/qq.png'}/>
        <p style={{textAlign: 'center', fontSize: 12}}>QQ号：464203147</p>
    </div>
);
const wechat = (
    <div
        style={{display: 'flex', flexDirection: 'column ', alignItems: 'center', justifyContent: 'center'}}>
        <img width={100} height={100}
             src={'http://cdn.algbb.fun/icon/wechat.jpg'}/>
        <p style={{textAlign: 'center', fontSize: 12}}>微信号：zhcxk1998</p>
    </div>
);

module.exports = {
    qq:  qq,
    wechat: wechat,
};
