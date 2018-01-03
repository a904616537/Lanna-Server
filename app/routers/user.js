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
		console.log('req.payload', req.payload);
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
	}
}



module.exports = [{
	method : 'get',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.get,
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
}]