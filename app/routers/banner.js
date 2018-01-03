/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: banner 路由配置
 */

'use strict';

const message = require('../helpers/message'),
service       = require('../services/banner.service');

const router = {
	get(req, reply){
		let { page, per_page, sort } = req.query;
		page     = parseInt(page);
		per_page = parseInt(per_page);

		service.getBanner(page, per_page, sort, (banners, count) => {
			let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/banner');
			reply({data: banners, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
		});
	},
	post(req, reply) {
		service.Insert(req.body)
		.then(banner => reply({status : true, data : banner}))
		.catch(err => reply({status : false, err : err}))
	},
	put(req, reply) {
		service.Update(req.body)
		.then(banner => reply({status : true, data : banner}))
		.catch(err => reply({status : false, err : err}))
	},
	delete(req, reply) {
		const _id = req.body._id;
		service.Delete(_id)
		.then(result => reply({status : result}))
		.catch(result => reply({status : false}))
	},
	getAll(req, reply) {
		service.getBannerAll(banners => {
			reply({data : banners})
		});
	}
}

module.exports = [{
	method : 'get',
	path   : '/banner',
	config : {
		handler     : router.get,
		description : '<p>获取Banner</p>'
	}
}, {
	method : 'post',
	path   : '/banner',
	config : {
		handler     : router.post,
		description : '<p>上传Banner</p>'
	}
}, {
	method : 'put',
	path   : '/banner',
	config : {
		handler     : router.put,
		description : '<p>修改Banner</p>'
	}
}, {
	method : 'delete',
	path   : '/banner',
	config : {
		handler     : router.delete,
		description : '<p>删除Banner</p>'
	}
}, {
	method : 'get',
	path   : '/banner/all',
	config : {
		handler     : router.getAll,
		description : '<p>获取所有Banner（管理员后台使用）</p>'
	}
}]