/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config     = require('../../config/config'),
mongoose         = require('mongoose'),
moment           = require('moment'),
async            = require('async'),
order_mongo      = mongoose.model('order'),
behavior_service = require('./behavior.service'),
cart_service     = require('./cart.service'),
user_service     = require('./user.service');

const getId = () => {
	var str = "" + moment().unix(),
    pad = "000000000",
    _id = moment().format("YYYY") + moment().format("MM") + pad.substring(0, pad.length - str.length) + str + Math.ceil(Math.random()*35);
    return _id;
}

module.exports = {
	// 获取订单
	getOrder(page = 1, size = 1, sort = 'createTime|asc', filter='', status, callback) {
		const reg = new RegExp(filter, 'i'),
		find      = status ? {status, is_sub : true} : {is_sub : true},
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
			query.populate({
				path  : 'supplier',
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
		let select = {user, is_sub : true};
		let query = order_mongo.find(select)
		query.populate({
			path     : 'order_item.product',
			model    : 'product'
		})
		query.populate({
			path  : 'supplier',
			model : 'user'
		})
		query.sort({CreateTime : -1})
		query.exec(callback)
	},
	getOrderBySupplier(supplier, callback) {
		let select = {supplier, is_sub : true};
		let query = order_mongo.find(select)
		query.populate({
			path     : 'order_item.product',
			model    : 'product'
		});
		query.populate({
			path     : 'user',
			model    : 'user',
			select : {key : 0, password : 0}
		});
		query.sort({CreateTime : -1})
		query.exec(callback)
	},
	updateComment(_id) {
		return new Promise((resolve, reject) => {
			order_mongo.findOne({_id})
			.exec((err, order) => {
				if(order) {
					order.is_comment = true;
					order.save((err, order) => {
						if(err) reject()
						else resolve(order)
					})
				} else reject()
			})
		});
	},
	Insert(user, order) {
		return new Promise((resolve, reject) => {
			if(!order._id) order._id = getId();
			order.order_item     = [];
			order.original_total = 0;
			order.freight        = 20;
			order.status          = 1;
			order.user            = user._id;

			// 清空购物车，并返回选择的商品
			
			cart_service.Clear(user._id)
			.then(result => {

				const {cart_item, clearNext} = result;
				let total           = 0;	// 统计总价
				let discount        = 100;	// 记录折扣
				let snackpack_total = 0;	// 套餐价格
				// 生产的子订单
				let sub_order = [];
				async.series([
					// 单品处理
					next => {
						async.each(cart_item, (item, cb) => {
							if(!item.product) return cb();
							if(!order.order_item) order.order_item = [];

							const item_model = {
								product : item.product._id,
								total   : item.product.price * item.number,
								number  : item.number,
								price   : item.product.price
							};

							order.order_item.push(item_model);
							total += item.product.price * item.number * discount / 100;
							order.original_total += item.product.price * item.number;

							console.log('item.product.user', item.product.user)
							// 子订单生成
							let sub_supplier = sub_order.find(val => {
								console.log('val.supplier == item.product.user', val.supplier , item.product.user)
								return val.supplier == item.product.user._id
							});
							// 检查供应商存在
							if(sub_supplier) {
								sub_supplier.order_item.push(item_model);
								sub_supplier.total += item.product.price * item.number * discount / 100;
								sub_supplier.original_total += item.product.price * item.number;
							} else {
								sub_supplier = {
									_id            : getId(),
									supplier       : item.product.user._id,
									pid            : order._id,
									address        : order.address,
									is_sub         : true,
									status         : 1,
									discount       : discount,
									user           : user._id,
									total          : item.product.price * item.number * discount / 100,
									original_total : item.product.price * item.number,
									freight        : 20,
									order_item     : [item_model]
								};
								sub_order.push(sub_supplier);
							}

							cb();
						}, err => {
							if(err) {console.error(moment(), '下单处理购物车单品出错!err:', err)}
							console.log('sub_supplier', sub_order)
							next();
						});
					},
					next => {
						// 绑定下单人数据主键，方便查询
						console.log(moment(), '下单金额：', order._id, order.original_total)
						if(typeof order.original_total == 'number' && parseInt(order.original_total) >= 150) order.freight = 0;
						order.total           = total + order.freight;
						order.original_total  += order.freight;
						order.discount        = discount;

						order_mongo.create(order, (err, doc) => {
							if(err) {
								console.log(moment(), '订单生成失败', err)
								reject(err);
								next(err);
							}
							else {
								console.log(moment(), '订单生成成功', order)
								// 记录购买商品
								order.order_item.forEach(val => {
									// 记录到用户行为
									behavior_service.post(user._id, 'Product', val.product)
								})
								// 生成订单未出错则通知清空购物车！
								clearNext();
								console.log('---------- 后台继续拆分订单 ----------');
								sub_order.forEach(val => {

									order_mongo.create(val, (err, doc) => {
										if(err) console.log(moment(), '拆分订单生成失败', err)
										else console.log(moment(), '拆分订单生成成功', val)
									})
								})
								resolve(order);
								next();
							}
						})
					}
					// 合计
				], err => {
					
				});
			})
			.catch(err => {
				reject(err)
			})
		})
	},
	Update(data) {
	}
}
