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
			console.log('products', products)
			let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/product');
			reply({data: products, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
		})
	},
	put(req, reply) {
		service.Update(req.payload)
		.then(product => reply({status : true, data : product}))
		.catch(err => reply({status : false, err : err}))
	},
	post(req, reply) {
		req.payload.user = req.auth.credentials._id;
		req.payload.attribute = [];
		req.payload.attribute.push({
			title   : 'Roast',
			content : req.payload.roast
		})
		req.payload.attribute.push({
			title   : 'Body',
			content : req.payload.body
		})
		req.payload.attribute.push({
			title   : 'Flavors',
			content : req.payload.flavors
		})
		req.payload.attribute.push({
			title   : 'Aromas',
			content : req.payload.aromas
		})
		req.payload.attribute.push({
			title   : 'Detail',
			content : req.payload.detail
		})
		req.payload.attribute.push({
			title   : 'Detail',
			content : req.payload.detail_more
		})

		service.Insert(req.payload)
		.then(product => reply({status : true, data : product}))
		.catch(err => reply({status : false, err : err}))
	}
}



module.exports = [{
	method : 'get',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.get,
		description : '<p>获取商品</p>'
	}
}, {
	method : 'post',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.post,
		description : '<p>新增商品</p>'
	}
}, {
	method : 'put',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.put,
		description : '<p>修改商品</p>'
	}
}]