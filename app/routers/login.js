/*
 * Author: Kain·Shi <kain@foowala.com>
 */

const msg = require('../helpers/message'),
_user     = require('../services/user.service'),
JWT       = require('jsonwebtoken'),
moment    = require('moment')
let uuid = 1;     // 验证身份递增数

const login = (req, reply) => {
	if (req.auth.isAuthenticated) {
		return reply(msg.success('你已登录！'));
	}
	console.log('req.payload', req.payload)
	const query = req.payload;
	_user.SelectUser(query)
	.then(user => {
		user.key      = '';
		user.password = '';
		const token = JWT.sign({_id : user._id, email : user.email, phone : user.phone}, 'LannerCoffee');
		reply(msg.success('登录成功', {token, user}))
	})
	.catch(err => {
		console.log('err', err)
		reply(msg.unsuccess('登录失败'))
	})
},
logout = (req, reply) => {
	if (!req.auth || !req.auth.isAuthenticated)
		return reply(msg.unsuccess('未找到你的登陆状态！'));
	reply(msg.success('loginout success'));
},
register = (req, reply) => {
	let { email, password } = req.payload;
	_user.Register({email, password})
	.then(user => reply(msg.success('success', user)))
	.catch(err => reply(msg.unsuccess('邮箱已被注册')))
}


module.exports = [{
	method : ['get', 'post'],
	path   : '/login',
	config : {
		auth        : false,
		handler     : login,
		plugins     : { 'hapi-auth-cookie': { redirectTo: false } } ,
		description : '<p>登陆</p>',
		validate    :{
			query: {
				username  : 'User Name',
				password  : 'Password'
			}
        }
	}
}, {
	method : 'post',
	path   : '/logout',
	config : {
		handler     : logout,
		description : '<p>登出</p>'
	}
}, {
	method : 'post',
	path   : '/register',
	config : {
		auth        :false,
		handler     : register,
		description : '<p>注册</p>',
		validate    :{
			query: {
				username  : 'User Name',
				password  : 'Password'
			}
        }
    }
}];