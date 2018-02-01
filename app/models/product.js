/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: product mongoose
 */

'use strict';

var mongoose   = require('mongoose'),
Schema         = mongoose.Schema,
attribute_Schema = new Schema({
	title      : { type : String, default : '' },
	desc      : { type : String, default : '' },
	content    : { type : String, default : '' },
	CreateTime : { type : Date, default : Date.now }
}),
product_Schema = new Schema({
	user     : { type : Schema.Types.ObjectId, ref : 'user', required : true},	// 供应者
	category : { type : Number, default : 0 },	// 0:BEAN, 1:CAPSULE

	attribute : [attribute_Schema],	// 属性

	name     : { type : String, default: '' },	// 名字
	desc     : { type : String, default: '' },	// 描述
	content  : { type : String, default: '' },	// 介绍

	price : { type : Number, default : 0, min : 0, set : v => Number(v).toFixed(2) },	// 价格
	top   : { type : Boolean, default : false },	// 置顶
	spec  : { type : String, default : ''},
	order : { type : Number, default : 0 },
	img   : [ String ],
	evaluate : {
		star   : { type : Number, default : 5, min : 1, max : 5 },	// 星级
		total  : { type : Number, default : 0 },	// 总分
		number : { type : Number, default : 0 },	// 评价人数
	},
	CreateTime : { type : Date, default : Date.now }
});

product_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

product_Schema.statics = {
	findById(_id, callback) {
		return this.findOne({_id})
		.exec((err, product) => callback(product))
	}
}

mongoose.model('product', product_Schema, 'product');



