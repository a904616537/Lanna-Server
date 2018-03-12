/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: product 路由配置
 */

'use strict';

const msg  = require('../helpers/message'),
help       = require('../helpers/page.help.js'),
service    = require('../services/product.service'),
ROUTE_NAME = 'product'

const router = {
	get(req, reply) {
		let { page, per_page, sort } = req.query;
		page     = parseInt(page);
		per_page = parseInt(per_page);
		service.getProduct(page, per_page, sort, (products, count) => {
			let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/product');
			reply({data: products, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
		})
	},
	delete(req, reply) {
		const {_id} = req.query;
		service.Delete(_id)
		.then(result => reply(msg.success('success', result)))
		.catch(err => reply(msg.unsuccess('error', err)));
	},
	getMe(req, reply) {
		const user = req.auth.credentials._id;
		service.getProductForMe(user)
		.then(result => reply(msg.success('success', result)))
		.catch(err => reply(msg.unsuccess('error', err)));
	},
	getComments(req, reply) {
		// const user = req.auth.credentials._id;
		const {_id} = req.query;
		service.getComments(_id)
		.then(result => reply(msg.success('success', result)))
		.catch(err => reply(msg.unsuccess('error', err)));
	},
	getRecommend(req, reply) {
		service.getRecommend()
		.then(result => reply(msg.success('success', result)))
		.catch(err => reply(msg.unsuccess('error', err)));
	},
	put(req, reply) {
		service.Update(req.payload)
		.then(result => reply(msg.success('success', result)))
		.catch(err => reply(msg.unsuccess('error', err)));
	},
	postComments(req, reply) {
		service.InsertComments(req.payload)
		.then(result => reply(msg.success('success', result)))
		.catch(err => reply(msg.unsuccess('error', err)));
	},
	post(req, reply) {
		req.payload.user = req.auth.credentials._id;
		req.payload.attribute = [];

		req.payload.attribute.push({
			title   : 'Roast',
			desc    : req.payload.roast_title,
			content : req.payload.roast
		})
		req.payload.attribute.push({
			title   : 'Body',
			desc    : req.payload.body_title,
			content : req.payload.body
		})
		req.payload.attribute.push({
			title   : 'Flavors',
			desc    : req.payload.flavors_title,
			content : req.payload.flavors
		})
		req.payload.attribute.push({
			title   : 'Aromas',
			desc    : req.payload.aromas_title,
			content : req.payload.aromas
		})
		req.payload.attribute.push({
			title   : 'Detail',
			desc    : req.payload.detail_title,
			content : req.payload.detail
		})
		req.payload.attribute.push({
			title   : 'Detail',
			desc    : req.payload.detail_more,
			content : req.payload.detail_more
		})

		service.Insert(req.payload)
		.then(result => reply(msg.success('success', result)))
		.catch(err => reply(msg.unsuccess('error', err)));
	}
}



module.exports = [{
	method : 'get',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.get,
		description : '<p>获取商品</p>'
	}
},{
	method : 'delete',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.delete,
		description : '<p>删除商品</p>'
	}
}, {
	method : 'get',
	path   : `/${ROUTE_NAME}/me`,
	config : {
		handler     : router.getMe,
		description : '<p>获取自己上传商品</p>'
	}
}, {
	method : 'get',
	path   : `/${ROUTE_NAME}/comments`,
	config : {
		handler     : router.getComments,
		description : '<p>获取商品评论</p>'
	}
}, {
	method : 'get',
	path   : `/${ROUTE_NAME}/recommend`,
	config : {
		handler     : router.getRecommend,
		description : '<p>获取推荐商品</p>'
	}
}, {
	method : 'post',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.post,
		description : '<p>新增商品</p>'
	}
}, {
	method : 'post',
	path   : `/${ROUTE_NAME}/comments`,
	config : {
		handler     : router.postComments,
		description : '<p>商品新增评论</p>'
	}
}, {
	method : 'put',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.put,
		description : '<p>修改商品</p>'
	}
}]