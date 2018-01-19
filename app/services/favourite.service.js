/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config    = require('../../config/config'),
mongoose        = require('mongoose'),
favourite_mongo = mongoose.model('favourite');

module.exports = {
	getFavourite(page = 1, size = 10, sort = 'createTime|asc', callback) {
		favourite_mongo.count()
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = favourite_mongo.find({})
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
			query.exec((err, favourites) => {
				return callback(favourites, count)
			})
		})
	},
	getFavouriteForUser(user) {
		return new Promise((resolve, reject) => {
			favourite_mongo.find({user})
			.populate({
				path  : 'article',
				model : 'article'
			})
			.exec((err, result) => {
				console.log('result' ,result)
				if(err) return reject(err);
				resolve(result);
			})
		})
	},
	getFavouriteList(callback) {
		favourite_mongo.find({})
		.exec((err, favourites) => callback(favourites))
	},
	getFavouriteById(_id, callback) {
		favourite_mongo.findOne({_id})
		.exec((err, favourite) => callback(favourite))
	},
	Insert(favourite) {
		return new Promise((resolve, reject) => {
			favourite_mongo.findOne({user : favourite.user, article : favourite.article})
			.exec((err, model) => {
				if(model) {
					model.remove(err => {
						if(err) return reject(err);
						resolve(false);
					})
				} else {
					favourite_mongo.create(favourite, (err, result) => {
						if(err) return reject(err);
						resolve(true);
					})
				}
			})
			
		})
	},
	Update(favourite) {
		return new Promise((resolve, reject) => {
			const _id = favourite._id;
			delete favourite._id;
			favourite_mongo.update({_id}, favourite, err => {
				if(err) return reject(err);
				resolve(favourite);
			})
		})
	},
	Delete(_id) {
		return new Promise((resolve, reject) => {
			this.getFavouriteById(_id, favourite => {
				if(!favourite) return reject();
				favourite.remove(err => {
					if(err) return reject(err);
					resolve();
				})
			})
		})
	}
}
