/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: user mongoose
 */

'use strict';

var mongoose = require('mongoose'),
Schema       = mongoose.Schema,
user_Schema  = new Schema({
	email       : { type : String, default : ''},
	phone       : { type : String, default : ''},
	name        : { type : String, default : ''},
	username    : { type : String, default : ''},
	local       : { type : String, default : ''},		// 地址
	desc        : { type : String, default : ''},		// 描述
	img         : [String],	// 图片组
	headerImage : { type : String, default : ''},		// 头像地址
	password    : { type : String, default : ''},
	identity    : { type : Boolean, default : false},	// 身份，确认为供应商，name为公司名称
	is_admin    : { type : Boolean, default : false},
	key         : String,	// 加密key
	sex         : Number,
	evaluate    : {	// 评分
		star   : { type : Number, default : 4, min : 1, max : 5 },	// 星级
		total  : { type : Number, default : 0 },	// 总分
		number : { type : Number, default : 0 },	// 评价人数
	},
	following  : { type : Number, default : 0 },	// ？？？？
	followers  : { type : Number, default : 0 },	// 追随？？？
	points     : { type : Number, default : 0 },	// 点赞？？？
	CreateTime : { type : Date, default : Date.now }
});


user_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

user_Schema.statics = {
	findById(_id, callback) {
		this.findOne({_id})
		.select({
			password : 0,
			key      : 0
		})
		.exec(callback);
	},
	findByUser(select, callback) {
		this.findOne({})
		.or([
			{'phone': { $in: select }},
			{'email': { $in: select }}
		])
		.exec(callback)
	}
}

mongoose.model('user', user_Schema, 'user');



