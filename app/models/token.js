/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: token mongoose
 */

'use strict';

var mongoose   = require('mongoose'),
Schema         = mongoose.Schema,
token_schema = new Schema({
	access_token  : String,
	expires_in    : Number,
	refresh_token : String,
	openid        : String,
	scope         : String,
	create_at     : String
});

token_schema.statics = {
	getToken(openid) {
		return new Promise((resolve, reject) => {
			this.findOne({openid}, (err, result) => {
				if (err) return reject(err);
				return resolve(result);
			})
		})
	},
	setToken(openid, token, cb) {
		// 有则更新，无则添加
		return new Promise((resolve, reject) => {
			const query = {openid : openid},
			options     = {upsert : true}
			this.update(query, token, options, (err, result) => {
				if (err) return reject(err);
				return resolve();
			})
		})
	}
}

mongoose.model('token', token_schema, 'token');



