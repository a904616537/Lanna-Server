/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: admin mongoose
 */

'use strict';

var mongoose = require('mongoose'),
Schema       = mongoose.Schema,
admin_Schema = new Schema({
		name       : String,
		username   : String,
		password   : String,
		key        : String,
		createTime : {type : Date, default : Date.now() },
		identity   : String
    });

admin_Schema.virtual('date').get(() => {
  this._id.getTimestamp();
});

admin_Schema.statics = {
	findById(id, callback) {
		return this.findOne({_id : id}, (err, admin) => callback(admin))
	}
}

mongoose.model('admin', admin_Schema, 'admin');
