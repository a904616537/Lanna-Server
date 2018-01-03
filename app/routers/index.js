/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 路由配置
 */

'use strict';

const message = require('../helpers/message');
const JWT     = require('jsonwebtoken');
 

const auth = (req, reply) => {
    if (req.auth.isAuthenticated) reply(message.success('验证成功', req.auth.credentials))
    else reply(message.unsuccess('验证失败'));
}

module.exports = [{
	method : 'GET',
	path   : '/',
	config : {
		handler     : (req, reply) => {
			reply(message.success('应用程序配置正常！'))
		},
		description : '<p>应用程序宕机检查！</p>'
	}
}, {
	method : ['get', 'post', 'put'],
	path   : '/auth',
	config : {
		handler     : auth,
		description : '<p>应用程序宕机检查！</p>'
	}
}]