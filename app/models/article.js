/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

var mongoose        = require('mongoose'),
Schema              = mongoose.Schema,
article_type_Schema = new Schema({
	type  : {type : String, default : 'text'},	// text or image
	value : {type : String, default : ''}
}),
article_Schema = new Schema({
	user       : {type : Schema.Types.ObjectId, ref : 'user'},
	banner     : {type : String, default : ''},
	title      : {type : String, default : ''},
	content    : [article_type_Schema],
	order      : {type : Number, default: 0},
	evaluate : {
		star   : { type : Number, default : 5, min : 1, max : 5 },	// 星级
		total  : { type : Number, default : 0 },	// 总分
		number : { type : Number, default : 0 },	// 评价人数
	},
	createTime : {type : Date, default : Date.now()}
});

article_Schema.virtual('date').get(() => {
	 this._id.getTimestamp();
});

article_Schema.statics = {
	findById(_id, callback) {
		return this.findOne({_id})
		.populate({
			path     : 'user',
			model    : 'user'
		})
		.exec((err, article) => callback(article))
	}
}

mongoose.model('article', article_Schema, 'article');
