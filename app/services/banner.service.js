/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description:  Banner 数据服务
 */

'use strict';

const config = require('../../config/config'),
mongoose     = require('mongoose'),
banner_mongo = mongoose.model('banner');



module.exports = {
	// 获取Banner
	getBanner(page = 1, size = 1, sort = 'order|asc', callback) {
		banner_mongo.count()
		.exec((err, count) => {
			let start = (page - 1) * size;
			let query = banner_mongo.find({})
			query.limit(size)
			query.skip(start)
			if(sort && sort != '') {
				sort = sort.split("|")
				if(sort[1] == 'asc') sort = sort[0]
				else sort = '-' + sort[0]
				console.log('sort', sort);
				query.sort(sort)
			}
			query.exec((err, banners) => callback(banners, count));
		})
	},
	getBannerAll(callback) {
		banner_mongo.find({})
		.sort({order : 1})
		.exec((err, banners) => {
			callback(banners);
		})
	},
	getBannerById(_id, callback) {
		banner_mongo.findOne({_id})
		.exec((err, banner) => callback(banner))
	},
	getBannerByKey(key, callback) {
		banner_mongo.find({key})
		.sort({'createTime' : -1, 'order' : -1})
		.exec((err, banner) => callback(banner))	
	},
	Delete(_id) {
		return new Promise((resolve, reject) => {
			this.getBannerById(_id, banner => {
				if(!banner) return reject();
				banner.remove(err => {
					if(err) return reject(err);
					resolve();
				})
			})
		})
	},
	Insert(banner) {
		return new Promise((resolve, reject) => {
			banner_mongo.create(banner, (err, result) => {
				if(err) return reject(err);
				resolve(result);
			})
		})
	},
	Update(banner) {
		return new Promise((resolve, reject) => {
			const _id = banner._id;
			delete banner._id;
			banner_mongo.update({_id}, banner, err => {
				if(err) return reject(err);
				resolve(banner);
			})
		})
	},
}
