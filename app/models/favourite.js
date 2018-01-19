/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

var mongoose     = require('mongoose'),
Schema           = mongoose.Schema,
favourite_Schema = new Schema({
	user       : {type : Schema.Types.ObjectId, ref : 'user'},
	article    : {type : Schema.Types.ObjectId, ref : 'article'},
	createTime : {type : Date, default : Date.now()}
});

favourite_Schema.virtual('date').get(() => {
	 this._id.getTimestamp();
});

favourite_Schema.statics = {
	findById(_id, callback) {
		return this.findOne({_id})
		.populate({
			path     : 'user',
			model    : 'user'
		})
		.populate({
			path     : 'article',
			model    : 'article'
		})
		.exec((err, favourite) => callback(favourite))
	}
}

mongoose.model('favourite', favourite_Schema, 'favourite');
