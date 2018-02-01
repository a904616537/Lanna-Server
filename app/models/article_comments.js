/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

var mongoose = require('mongoose'),
Schema       = mongoose.Schema,
article_comments_Schema = new Schema({
		user       : {type : Schema.Types.ObjectId, ref : 'user'},
		article    : {type : Schema.Types.ObjectId, ref : 'article'},
		star       : {type : Number, default : 5},
		comment    : {type : String, default : ''},
		createTime : {type : Date, default : Date.now() }
    });

article_comments_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

article_comments_Schema.statics = {
	findById(id, callback) {
		return this.findOne({_id : id}, (err, article_comments) => callback(article_comments))
	}
}

mongoose.model('article_comments', article_comments_Schema, 'article_comments');
