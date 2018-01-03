/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config  = require('../../config/config'),
mongoose      = require('mongoose'),
product_mongo = mongoose.model('product');

module.exports = {
	getProduct(page = 1, size = 10, sort = 'createTime|asc', callback) {
		product_mongo.count()
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = product_mongo.find({})
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
			query.exec((err, products) => {
				return callback(products, count)
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
	Update(product) {
		return new Promise((resolve, reject) => {
			const _id = product._id;
			delete product._id;
			product_mongo.update({_id}, product, err => {
				if(err) return reject(err);
				resolve(product);
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
