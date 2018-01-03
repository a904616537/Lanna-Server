/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: shippingcart mongoose
 */

'use strict';

var mongoose     = require('mongoose'),
Schema           = mongoose.Schema,
// 购物车中普通商品
cart_item_Schema = new Schema({
	product    : { type : Schema.Types.ObjectId, ref : 'product'},
	number     : { type : Number, default: 1},     // 数量
	CreateTime : { type : Date, default : Date.now }
}),
cart_Schema = new Schema({
	user_id        : { type : Schema.Types.ObjectId, ref : 'user'},
	cart_item      : [cart_item_Schema]
})

cart_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
})

cart_Schema.statics = {
	findById(_id, callback) {
		return this.findOne({_id}, (err, cart) => callback(cart))
	},
	getUserId(user_id, callback) {
		this.findOne({user_id})
		.populate({
			path     : 'cart_item.product',
			model    : 'product',
		})
		.exec(callback)
	}
}

mongoose.model('cart', cart_Schema, 'cart');