/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

var mongoose        = require('mongoose'),
Schema              = mongoose.Schema,

behavior_Schema = new Schema({
	user        : {type : Schema.Types.ObjectId, ref : 'user'},
	type        : {type : String, default : 'Article'},
	product     : {type : Schema.Types.ObjectId, ref : 'product'},	// 支持购买产品
	subscribe   : {type : Schema.Types.ObjectId, ref : 'user'},		// 支持关注用户
	unsubscribe : {type : Schema.Types.ObjectId, ref : 'user'},		// 支持关注用户
	article     : {type : Schema.Types.ObjectId, ref : 'article'},	// 支持发表文章
	createTime  : {type : Date, default : Date.now}
});

behavior_Schema.virtual('date').get(() => {
	 this._id.getTimestamp();
});

behavior_Schema.statics = {
	findById(_id, callback) {
		return this.findOne({_id})
		.populate({
			path     : 'user',
			model    : 'user'
		})
		.exec((err, behavior) => callback(behavior))
	}
}

mongoose.model('behavior', behavior_Schema, 'behavior');
