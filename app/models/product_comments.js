/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

var mongoose = require('mongoose'),
Schema       = mongoose.Schema,
product_comments_Schema = new Schema({
		user       : {type : Schema.Types.ObjectId, ref : 'user'},
		product    : {type : Schema.Types.ObjectId, ref : 'product'},
		star       : {type : Number, default : 5},
		comment    : {type : String, default : ''},
		createTime : {type : Date, default : Date.now() }
    });

product_comments_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

product_comments_Schema.statics = {
	findById(id, callback) {
		return this.findOne({_id : id}, (err, article_comments) => callback(product_comments))
	}
}

mongoose.model('product_comments', product_comments_Schema, 'product_comments');
