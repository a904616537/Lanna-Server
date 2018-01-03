/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 订单 路由配置
 */

'use strict';

const msg  = require('../helpers/message'),
help       = require('../helpers/page.help.js'),
service    = require('../services/order.service'),
ROUTE_NAME = 'order'

const router = {
	get(req, reply) {
		let { page, per_page, sort, filter, status } = req.query;
		page     = parseInt(page);
		per_page = parseInt(per_page);

		service.getOrder(page, per_page, sort, filter, status, (orders, count) => {
			let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/order');
			reply({data: orders, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
		})
	},
	put(req, reply) {
		req.body.address    = JSON.parse(req.body.address);
		req.body.order_item = JSON.parse(req.body.order_item);

		service.Update(req.body)
		.then(result => reply(msg.success('success', result)))
		.catch(err => reply(msg.unsuccess('error', err)));
	},
	post(req, reply) {
		const user = req.session.user;
		req.body.address = JSON.parse(req.body.address);
		service.Insert(user, req.body)
		.then(order => reply(msg.success('success', order)))
		.catch(err => reply(msg.unsuccess('error', err)))
	},
	getById(req, reply) {
		const _id = req.params.id;
		service.getOrderById(_id, (err, order) => {
			if(err) return reply({status: false, err})
			reply(msg.success('success', order))
		})
	},
	putById(req, reply) {
		const _id      = req.params.id;
		const {status} = req.body;

		service.UpdateStatus(_id, status)
		.then(result => reply(msg.success('success', result)))
		.catch(err => reply(msg.unsuccess('error', err)))
	}
}

module.exports = [{
	method : 'get',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.get,
		description : '<p>获取订单</p>'
	}
}, {
	method : 'post',
	path   : `/$ROUTE_NAME`,
	config : {
		handler     : router.post,
		description : '<p>提交订单</p>'
	}
}, {
	method : 'put',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.put,
		description : '<p>修改订单</p>'
	}
}, {
	method : 'get',
	path   : `/${ROUTE_NAME}/{_id}`,
	config : {
		handler     : router.getById,
		description : '<p>获取指定订单</p>'
	}
}, {
	method : 'put',
	path   : `/${ROUTE_NAME}/{_id}`,
	config : {
		handler     : router.putById,
		description : '<p>修改指定订单状态</p>'
	}
}]