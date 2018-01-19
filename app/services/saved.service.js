/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config    = require('../../config/config'),
mongoose        = require('mongoose'),
saved_mongo = mongoose.model('saved');

module.exports = {
	getSaved(page = 1, size = 10, sort = 'createTime|asc', callback) {
		saved_mongo.count()
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = saved_mongo.find({})
			query.populate({
				path : 'user',
				select : ['_id', 'name', 'headerImage']
			})
			query.limit(size)
			query.skip(start)
			if(sort) {
				sort = sort.split("|")
				if(sort[1] == 'asc') sort = sort[0]
				else sort = '-' + sort[0]
				query.sort(sort)
			}
			query.sort({createTime : -1})
			query.exec((err, saveds) => {
				return callback(saveds, count)
			})
		})
	},
	getSavedForUser(user) {
		return new Promise((resolve, reject) => {
			saved_mongo.find({user})
			.populate({
				path  : 'article',
				model : 'article',
				populate : {
					path : 'user',
					model : 'user',
					select : ['_id', 'name', 'headerImage']
				}
			})
			.exec((err, result) => {
				console.log('result' ,result)
				if(err) return reject(err);
				resolve(result);
			})
		})
	},
	getSavedList(callback) {
		saved_mongo.find({})
		.exec((err, saveds) => callback(saveds))
	},
	getSavedById(_id, callback) {
		saved_mongo.findOne({_id})
		.exec((err, saved) => callback(saved))
	},
	Insert(saved) {
		return new Promise((resolve, reject) => {
			saved_mongo.findOne({user : saved.user, article : saved.article})
			.exec((err, model) => {
				if(model) {
					model.remove(err => {
						if(err) return reject(err);
						resolve(false);
					})
				} else {
					saved_mongo.create(saved, (err, result) => {
						if(err) return reject(err);
						resolve(true);
					})
				}
			})
			
		})
	},
	Update(saved) {
		return new Promise((resolve, reject) => {
			const _id = saved._id;
			delete saved._id;
			saved_mongo.update({_id}, saved, err => {
				if(err) return reject(err);
				resolve(saved);
			})
		})
	},
	Delete(_id) {
		return new Promise((resolve, reject) => {
			this.getSavedById(_id, saved => {
				if(!saved) return reject();
				saved.remove(err => {
					if(err) return reject(err);
					resolve();
				})
			})
		})
	}
}
