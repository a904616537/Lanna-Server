/*
 * Author: Kain·Shi <kain@foowala.com>
 * Module description: 统一消息发送
 */

// error code 编号机制
// 100+ 接收到请求，等待下一个请求
// 200+ 处理成功，有返回
// 300+ 重定向
// 400+ 请求错误
// 401  登陆超时
// 403  请求被拒绝
// 404  找不到
// 500  服务器出错
// 505  操作失败

'use strict';

const messageModel = () => {
    return {
        data      : [],
        status    : 0,
        errorcode : 0,
        count     : 0,
        msg       : '错误操作！'
    }
}

const Message = {
    success : (msg, data) => {
        let message       = messageModel();
        message.status    = 1;
        message.errorcode = 200;
        message.msg       = msg;
        message.data      = data;

        if (data) message.count = data.length ? data.length : 0;
        else message.count      = 0;
        
        return message;
    },
    unsuccess : (msg, code, errData) => {
        if(errData) console.dir(errData);

        let message    = messageModel();
        message.status = 0;
        message.msg    = msg;

        if(code) message.errorcode = code;
        else message.errorcode     = 500;
        return message;
    }
}

module.exports = Message;
