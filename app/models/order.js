/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: order mongoose
 */

'use strict';

var mongoose   = require('mongoose'),
Schema         = mongoose.Schema,
address_Scheam = require('./address'),
// 订单中的商品
order_item_Schema = new Schema({
	product  : { type: Schema.Types.ObjectId, ref : 'product'},
	number   : { type: Number, default: 1},     // 数量
	price    : { type: Number, set: v => Number(v).toFixed(2)},   // 购买时的单价
	discount : { type: Number, set: v => Number(v).toFixed(2)},   // 折扣
	total    : { type: Number, default: 0, set: v => Number(v).toFixed(2)}
}),
order_Schema = new Schema({
	_id        : { type: String, required: true},
	user       : { type: Schema.Types.ObjectId, ref: 'user'},
	supplier   : { type: Schema.Types.ObjectId, ref: 'user'},	// 供应⬆商
	pid        : { type: String},	//  父订单
	is_sub     : { type: Boolean, default : false},	// 子订单
	is_comment : { type : Boolean, default: false},	// 是否被评论
	total      : { type: Number, default: 0, min: 0, set: v => Number(v).toFixed(2) },//总价
	freight    : { type: Number, default: 0, min: 0, set: v => Number(v).toFixed(2) },//运费
	status     : { type: Number, default: 0 }, // 订单状态，0: 已下单但未付款,1: 已付款, 2: 已出货，3，已完成, 4：取消
	discount   : { type: Number, default: 0, set: v => Number(v).toFixed(2) }, // 折扣
	CreateTime : { type: Date, default : Date.now },
	order_item : [order_item_Schema],
	address    : address_Scheam
});

order_Schema.statics = {
	findById(_id, callback) {
		this.findOne({_id})
		.populate({
			path     : 'order_item.product',
			model    : 'product',
			populate : {
			  	path  : 'user',
				model : 'user',
				select : {key : 0, password : 0}
			}
		})
		.populate({
			path  : 'supplier',
			model : 'user'
		})
		.exec(callback)
	},
	getAll(callback) {
		this.findOne({})
		.populate({
			path     : 'order_item.product',
			model    : 'product'
		})
		.populate({
			path  : 'supplier',
			model : 'user'
		})
		.exec(callback)
	},
	getOrderByUser(user_id, callback) {
		this.find({user : user_id})
		.populate({
			path     : 'order_item.product',
			model    : 'product'
		})
		.populate({
			path  : 'supplier',
			model : 'user'
		})
		.select({_id : 1, status : 1, product : 1, CreateTime : 1})
		.exec(callback)
	}
}

mongoose.model('order', order_Schema, 'order');



