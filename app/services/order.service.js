/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config      = require('../../config/config'),
mongoose          = require('mongoose'),
moment            = require('moment'),
order_mongo       = mongoose.model('order'),
user_service      = require('./user.service');

const getId = () => {
	var str = "" + moment().unix(),
    pad = "000000000",
    _id = moment().format("YYYY") + moment().format("MM") + pad.substring(0, pad.length - str.length) + str;
    return _id;
}

module.exports = {
	// 获取订单
	getOrder(page = 1, size = 1, sort = 'createTime|asc', filter='', status, callback) {
		const reg = new RegExp(filter, 'i'),
		find      = status?{status}:{},
		seach     = [
			{ '_id': { $regex: reg }},
			{ 'address.recipients': { $regex: reg }},
			{ 'address.phone': { $regex: reg }}
		]
		order_mongo.count(find)
		.or(seach)
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = order_mongo.find(find)
			query.limit(size)
			query.skip(start)
			query.populate({
				path     : 'order_item.product',
				model    : 'product'
			})
			query.populate({
				path  : 'user',
				model : 'user'
			})
			query.or(seach)
			if(sort) {
				sort = sort.split("|")
				if(sort[1] == 'asc') sort = sort[0]
				else sort = '-' + sort[0]
				query.sort(sort)
			}
			query.exec((err, orders) => {
				return callback(orders, count)
			})
		})

	},
	getOrderById(_id, callback) {
		order_mongo.findById(_id, callback);
	},
	getOrderByUser(user, callback) {
		let select = {user, is_subscribe : false};
		let query = order_mongo.find(select)
		query.populate({
			path     : 'order_item.product',
			model    : 'product'
		})
		query.sort({CreateTime : -1})
		query.exec(callback)
	},
	Insert(user, order) {
		return new Promise((resolve, reject) => {
		})
	},
	Update(data) {
	}
}
