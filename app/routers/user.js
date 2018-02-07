/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: product 路由配置
 */

'use strict';

const msg  = require('../helpers/message'),
help       = require('../helpers/page.help.js'),
service    = require('../services/user.service'),
ROUTE_NAME = 'user'

const router = {
	getUser(req, reply) {
		const _id = req.query._id;
		service.getUserById(_id, (result) => {
			if(result) reply(msg.success('success', result))
			else reply(msg.unsuccess('error'))
		})
	},
	get(req, reply) {
		let {page, per_page, sort } = req.query;
		page     = parseInt(page);
		per_page = parseInt(per_page);
		service.getUser(page, per_page, sort, (users, count) => {
			let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/user');
			reply({data: users, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
		})
	},
	put(req, reply) {
		const {_id, key, value} = req.payload;

		service.Update(_id, key, value)
		.then(user => reply({status : true, data : user}))
		.catch(err => reply({status : false, err : err}))
	},
	getSuppler(req, reply) {
		let { page, per_page, sort } = req.query;
		page     = parseInt(page);
		per_page = parseInt(per_page);
		service.getSuppler(page, per_page, sort, (users, count) => {
			let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/user');
			reply({data: users, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
		})	
	},
	getSubscribe(req, reply) {
		const _id = req.auth.credentials._id;
		service.getSubscribe(_id)
		.then(result => reply(msg.success('success', result.subscribe)))
		.catch(err => reply(msg.unsuccess('error', err)))
	},
	putSubscribe(req, reply) {
		const _id = req.auth.credentials._id;
		const {user_id} = req.payload;
		service.putSubscribe(_id, user_id)
		.then(result => reply(msg.success('success', result)))
		.catch(err => reply(msg.unsuccess('error', err)))	
	}
}



module.exports = [{
	method : 'get',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.get,
		description : '<p>获取用户</p>'
	}
}, {
	method : 'get',
	path   : `/${ROUTE_NAME}/me`,
	config : {
		handler     : router.getUser,
		description : '<p>获取用户</p>'
	}
},{
	method : 'put',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.put,
		description : '<p>修改用户</p>'
	}
},{
	method : 'get',
	path   : `/${ROUTE_NAME}/suppler`,
	config : {
		handler     : router.getSuppler,
		description : '<p></p>'
	}
},{
	method : 'get',
	path   : `/${ROUTE_NAME}/subscribe`,
	config : {
		handler     : router.getSubscribe,
		description : '<p></p>'
	}
},{
	method : 'put',
	path   : `/${ROUTE_NAME}/subscribe`,
	config : {
		handler     : router.putSubscribe,
		description : '<p></p>'
	}
}]