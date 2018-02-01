/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config  = require('../../config/config'),
mongoose      = require('mongoose'),
product_mongo = mongoose.model('product'),
product_comments_mongo = mongoose.model('product_comments');

module.exports = {
	getProduct(page = 1, size = 10, sort = 'createTime|asc', callback) {
		product_mongo.count()
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = product_mongo.find({})
			query.populate({
				path : 'user',
				select : {key : 0, password : 0}
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
			query.exec((err, products) => {
				return callback(products, count)
			})
		})
	},
	getComments(product) {
		return new Promise((resolve, reject) => {
			product_comments_mongo.find({product})
			.populate({
				path   : 'user',
				model  : 'user',
				select : {key : 0, password : 0}
			})
			.sort({createTime : -1})
			.exec((err, result) => {
				if(err) return reject(err);
				resolve(result);
			})
		})
	},
	getProductForMe(user) {
		return new Promise((resolve, reject) => {
			product_mongo.find({user})
			.populate({
				path   : 'user',
				model  : 'user',
				select : {key : 0, password : 0}
			})
			.exec((err, result) => {
				if(err) return reject(err);
				resolve(result);
			})
		})
	},
	getProductList(callback) {
		product_mongo.find({})
		.exec((err, products) => callback(products))
	},
	getProductById(_id, callback) {
		product_mongo.findOne({_id})
		.exec((err, product) => callback(product))
	},
	Insert(product) {
		return new Promise((resolve, reject) => {
			product_mongo.create(product, (err, result) => {
				if(err) return reject(err);
				resolve(result);
			})
		})
	},
	InsertComments(comments) {
		return new Promise((resolve, reject) => {
			console.log('comments', comments)
			product_comments_mongo.create(comments, (err, result) => {
				if(err) return reject(err);
				resolve(result);
				comments.forEach(val => {
					this.UpdateComments(val)
					.then(product => {})
					.catch(err => console.log('评论失败，product——id:', val.product));
				})
			})
		})
	},
	UpdateComments(comment) {
		return new Promise((resolve, reject) => {
			product_mongo.findOne({_id : comment.product})
			.exec((err, product) => {
				product.evaluate = product.evaluate || {total : 0, number : 0, star : 5};
				product.evaluate.total += comment.star;
				product.evaluate.number += 1;
				product.evaluate.star = (product.evaluate.total/product.evaluate.number).toFixed(1);
				product.save(err => {
					if(err) return reject(err);
					resolve(product);
				})
			})
		})
	},
	Update(product) {
		return new Promise((resolve, reject) => {
			const _id = product._id;
			delete product._id;
			product_mongo.update({_id}, product, err => {
				if(err) return reject(err);
				else {
					// 评论成功后修改商品评论
					resolve(product);

				}
			})
		})
	},
	Delete(_id) {
		return new Promise((resolve, reject) => {
			this.getProductById(_id, product => {
				if(!product) return reject();
				product.remove(err => {
					if(err) return reject(err);
					resolve();
				})
			})
		})
	}
}
