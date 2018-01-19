/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../config/config'),
mongoose     = require('mongoose'),
article_mongo = mongoose.model('article');



module.exports = {
	getArticle(page = 1, size = 3, sort = 'order|asc', callback) {
		article_mongo.count()
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = article_mongo.find({})
			query.limit(size)
			query.skip(start)
			query.populate({
				path     : 'user',
				model    : 'user'
			})
			if(sort && sort != '') {
				sort = sort.split("|")
				if(sort[1] == 'asc') sort = sort[0]
				else sort = '-' + sort[0]
				query.sort(sort)
			}
			query.sort({createTime : -1})
			query.exec((err, articles) => callback(articles, count));
		})
	},
	getArticleById(_id) {
		return new Promise((resolve, reject) => {
			article_mongo.findById(_id, article => {
				reject(article);
			})
		})
	},
	getArticleAll(callback) {
		article_mongo.find({})
		.sort({order : 1})
		.exec((err, articles) => {
			callback(articles);
		})
	},
	Delete(_id) {
		return new Promise((resolve, reject) => {
			article_mongo.findById(_id, article => {
				if(!article) return reject();
				article.remove(err => {
					if(err) return reject(err);
					resolve();
				})
			})
		})
	},
	Insert(article) {
		return new Promise((resolve, reject) => {
			article_mongo.create(article, (err, result) => {
				if(err) return reject(err);
				resolve(result);
			})
		})
	},
	Update(article) {
		return new Promise((resolve, reject) => {
			const _id = article._id;
			delete article._id;
			article_mongo.update({_id}, article, err => {
				if(err) return reject(err);
				resolve(article);
			})
		})
	},
}
