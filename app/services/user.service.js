/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config     = require('../../config/config'),
mongoose         = require('mongoose'),
moment           = require('moment'),
user_mongo       = mongoose.model('user'),
behavior_service = require('./behavior.service'),
sms              = require('../helpers/sms'),
encryption       = require('../helpers/crypto');

module.exports = {
	getUserById(user_id, callback) {
		user_mongo.findOne({_id : user_id})
		.select({
			password : 0,
			key      : 0
		})
		.exec((err, user) => callback(user))
	},
	// 获取用户
	getUser(page = 1, size = 1, sort = 'CreateTime|asc', callback) {
		let q = {};
		user_mongo.count(q)
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = user_mongo.find(q)
			query.limit(size)
			query.skip(start)
			query.select({key : 0, password : 0})
			if(sort && sort != '') {
				sort = sort.split("|")
				if(sort[1] == 'asc') sort = sort[0]
				else sort = '-' + sort[0]
				query.sort(sort)
			}
			query.exec((err, users) => {
				return callback(users, count)
			})
		})
	},
	getSubscribe(user) {
		return new Promise((resolve, reject) => {
			user_mongo.findOne({_id : user})
			.populate({
				path   : 'subscribe.user',
				model  : 'user',
				select : {_id : 1, headerImage : 1, desc : 1, username : 1, name : 1, phone : 1, email : 1}
			})
			.exec((err, result) => {
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	putSubscribe(_id, user_id) {
		return new Promise((resolve, reject) => {
			user_mongo.findOne({_id})
			.exec((err, user) => {
				const subindex = user.subscribe.findIndex(val => {
					return val.user == user_id
				});
				let behavior_fun = () => {};
				if(subindex > -1) {
					// 取消关注
					user.subscribe.splice(subindex, 1);
					// 记录到用户行为
					behavior_fun = () => {behavior_service.post(user._id, 'Unsubscribe', user_id)}
				} else {
					// 关注
					user.subscribe.push({user : user_id});
					// 记录到用户行为
					behavior_fun = () => {behavior_service.post(user._id, 'Subscribe', user_id)}
				}
				user.save(err => {
					if(err) reject(err);
					else {
						resolve(user);
						behavior_fun();
					}
				})
			})
		})
	},
	getSuppler(page = 1, size = 1, sort = 'CreateTime|asc', callback) {
		let q = {identity : true};
		user_mongo.count(q)
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = user_mongo.find(q)
			query.limit(size)
			query.skip(start)
			if(sort && sort != '') {
				sort = sort.split("|")
				if(sort[1] == 'asc') sort = sort[0]
				else sort = '-' + sort[0]
				query.sort(sort)
			}
			query.exec((err, users) => {
				return callback(users, count)
			})
		})
	},
	// 获取最后关注的十个用户
	getUserForTen(callback) {
		let query = user_mongo.find({})
		query.limit(10)
		query.sort({CreateTime : -1})
		query.exec((err, users) => {
			callback(users)
		})
	},

	getUserForOpenId(openid, callback) {
		user_mongo.findOne({openid})
		.select({
			password : 0,
			key      : 0
		})
		.exec((err, user) => callback(user))
	},

	UpdateImage(demo) {
		return new Promise((resolve, reject) => {
			user_mongo.findOne({_id : demo._id})
			.exec((err, user) => {
				if(user) {
					user.headimgurl = demo.url;
					user.save(err => {
						if(err) return reject(err)
						resolve(user);
					})
				} else reject()
			})
		})
	},
	
	Update(_id, key, value) {
		return new Promise((resolve, reject) => {
			user_mongo.findById(_id, (err, doc) => {
				if (err) return reject(err);
				doc[key] = value;
				doc.save(err => {
					if(err) return reject(err)
					resolve(doc);
				})
			})
		})
	},
	InsertUser(user) {
		return new Promise((resolve, reject) => {
			user_mongo.findOne({_id : user._id})
			.exec((err, mongo) => {
				let is_sub = true;
				if(mongo) is_sub = false;
				user_mongo.update(
				{_id: user._id},
				user,
				{upsert : true},
				err => {
					if(err) return reject({err, is_sub})
					resolve({user, is_sub});
				})
			})
		})
	},

	SelectByOpenId(openid) {
		return new Promise((resolve, reject) => {
			user_mongo.findOne({openid})
			.select({
				password : 0,
				key      : 0
			})
			.exec((err, doc) => {
				if (err) return reject(err);
				resolve(doc);
			})
        })
	},
	SelectUser(query) {
		return new Promise((resolve, reject) => {
			user_mongo.findByUser([query.key], (err, user) => {
				console.log('user', user)
				if (err) return reject(err);
				if(user) {
					// 解密
					encryption.decipher(user.password, user.key, pwd => {
						console.log('pwd == query.password', pwd , query.password)
						if(pwd == query.password) return resolve(user)
						else return reject();
					})
				} else return reject();
			})
        })
	},
	// 账户注册
	Register(user) {
		return new Promise((resolve, reject) => {
			user_mongo.findByUser([user.phone, user.email], (err, doc) => {
				if(doc) return reject();
				// 加密
				encryption.cipher(user.password, (pwd, key) => {
					user = new user_mongo({
						email    : user.email,
						password : pwd,
						key      : key,
					})
					user.save(err => {
						if(err) return reject(err);
						resolve(user);
					})
				})
			})
		})
	},

	// 发送短信验证码
	getSMSCode(phone, callback) {
		let Num = "";

	    for (var i = 0; i < 6; i++) {
	        Num += Math.floor(Math.random() * 10);
	    }
	    console.log('验证码:' + Num);

	    let str = '【福哇啦】您的验证码是';
	    sms.sendSMS(str + Num, phone, (bo) => {
	    	if(bo) callback({status : true, code : Num, phone});
	    	else callback({status : false})
	    });
	}
}

	
