/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config   = require('../../config/config'),
mongoose       = require('mongoose'),
behavior_mongo = mongoose.model('behavior');



module.exports = {
	get(user, callback) {
		behavior_mongo.find({user})
		.populate({
			path     : 'user',
			model    : 'user',
			select : {key : 0, password : 0}
		})
		.populate({
			path     : 'product',
			model    : 'product',
			populate : {
				path     : 'user',
				model    : 'user'
			}
		})
		.populate({
			path     : 'subscribe',
			model    : 'user'
		})
		.populate({
			path     : 'unsubscribe',
			model    : 'user'
		})
		.populate({
			path     : 'article',
			model    : 'article',
			populate : {
				path     : 'user',
				model    : 'user'
			}
		})
		.sort({createTime : -1})
		.exec((err, behaviors) => {
			console.error(err)
			callback(behaviors)
		});
	},
	getSubscribe(users, callback) {
		behavior_mongo.find({user : {$in : users}})
		.populate({
			path     : 'user',
			model    : 'user',
			select : {key : 0, password : 0}
		})
		.populate({
			path     : 'product',
			model    : 'product',
			populate : {
				path     : 'user',
				model    : 'user'
			}
		})
		.populate({
			path     : 'subscribe',
			model    : 'user'
		})
		.populate({
			path     : 'unsubscribe',
			model    : 'user'
		})
		.populate({
			path     : 'article',
			model    : 'article',
			populate : {
				path     : 'user',
				model    : 'user'
			}
		})
		.sort({createTime : -1})
		.exec((err, behaviors) => callback(behaviors));
	},
	post(user, type, u_id) {
		let behavior = {
			user,
			type
		}
		switch(type) {
			case 'Article': 
				behavior.article = u_id;
			break;
			case 'Product': 
				behavior.product = u_id;
			break;
			case 'Subscribe': 
				behavior.subscribe = u_id;
			break;
			case 'Unsubscribe': 
				behavior.unsubscribe = u_id;
			break;
		}
		behavior_mongo.create(behavior, (err, result) => {
			if(err) console.log('记录用户行为失败', err)
			console.log('记录用户行为', result.type)
		})
	}
}
