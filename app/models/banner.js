/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: banner mongoose
 */

'use strict';

var mongoose  = require('mongoose'),
Schema        = mongoose.Schema,
banner_Schema = new Schema({
	key        : String,
	img        : String,
	link       : String,
	alt        : String,
	order      : {type: Number, default: 0},
	createTime : {type : Date, default : Date.now}
});

banner_Schema.virtual('date').get(() => {
	 this._id.getTimestamp();
});

banner_Schema.statics = {
	findById(_id, callback) {
		return this.findOne({_id}, (err, banner) => callback(banner))
	}
}

mongoose.model('banner', banner_Schema, 'banner');
