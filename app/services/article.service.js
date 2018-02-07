/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config           = require('../../config/config'),
mongoose               = require('mongoose'),
behavior_service       = require('./behavior.service'),
user_mongo             = mongoose.model('user'),
article_mongo          = mongoose.model('article'),
article_comments_mongo = mongoose.model('article_comments');



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
				model    : 'user',
				select : {key : 0, password : 0}
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
	getArticleForSub(user, is_sub, callback) {
		// let query = article_mongo.find({});
		if(is_sub) {
			article_mongo.find({user : user})
			.populate({
				path     : 'user',
				model    : 'user',
				select : {key : 0, password : 0}
			})
			.sort({createTime : -1})
			.exec((err, result) => callback(result))
		} else {
			// 获取用户组
			user_mongo.findOne({_id : user})
			.exec((err, result) => {
				const users = result.subscribe.map(val => val.user);
				users.push(user);
				article_mongo.find({user : {$in : users}})
				.populate({
					path     : 'user',
					model    : 'user',
					select : {key : 0, password : 0}
				})
				.sort({createTime : -1})
				.exec((err, result) => callback(result))
			});
		}
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
				console.log('article._id', article._id)
				// 记录到用户行为
				behavior_service.post(article.user, 'Article', result._id)
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
	getComments(article, callback) {
		article_comments_mongo.find({article})
		.populate({
			path     : 'user',
			model    : 'user',
			select : {key : 0, password : 0}
		})
		.sort({createTime : -1})
		.exec((err, comments) => callback(comments))
	},
	InsertComments(comments) {
		return new Promise((resolve, reject) => {
			article_comments_mongo.create(comments, (err, result) => {
				if(err) return reject(err);
				else {
					resolve(result);
					this.UpdateComments(comments)
					.then(article => {})
					.catch(err => console.log('评论失败，article——id:', comments.article));
				}
			})
		})
	},
	UpdateComments(comment) {
		return new Promise((resolve, reject) => {
			article_mongo.findOne({_id : comment.article})
			.exec((err, article) => {
				article.evaluate = article.evaluate || {total : 0, number : 0, star : 5};
				article.evaluate.total += comment.star;
				article.evaluate.number += 1;
				article.evaluate.star = (article.evaluate.total/article.evaluate.number).toFixed(1);
				article.save(err => {
					if(err) return reject(err);
					resolve(article);
				})
			})
		})
	},
}
