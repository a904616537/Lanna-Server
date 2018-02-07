/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const message = require('../helpers/message'),
help          = require('../helpers/page.help.js'),
service       = require('../services/favourite.service'),
ROUTE_NAME    = 'favourite'

const router = {
	get(req, reply){
		let { page, per_page, sort } = req.query;
		page     = parseInt(page);
		per_page = parseInt(per_page);

		service.getFavourite(page, per_page, sort, (favourites, count) => {
			let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/favourite');
			reply({data: favourites, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
		});
	},
	post(req, reply) {
		const user_id = req.auth.credentials._id;
		const {article_id} = req.payload;
		service.Insert({user : user_id, article : article_id})
		.then(result => reply(message.success('success', result)))
		.catch(err => reply(message.unsuccess('error', err)))
	},
	put(req, reply) {
		service.Update(req.payload)
		.then(result => reply(message.success('success', result)))
		.catch(err => reply(message.unsuccess('error', err)))
	},
	delete(req, reply) {
		const _id = req.payload._id;
		service.Delete(_id)
		.then(result => reply(message.success('success', result)))
		.catch(err => reply(message.unsuccess('error', err)))
	},
	getForUser(req, reply) {
		const user_id = req.auth.credentials._id;
		service.getFavouriteForUser(user_id)
		.then(result => reply(message.success('success', result)))
		.catch(err => reply(message.unsuccess('error', err)))
	}
}

module.exports = [{
	method : 'get',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.get,
		description : '<p>获取Favourites</p>'
	}
}, {
	method : 'post',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.post,
		description : '<p>上传Favourites</p>'
	}
}, {
	method : 'put',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.put,
		description : '<p>修改Favourites</p>'
	}
}, {
	method : 'delete',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.delete,
		description : '<p>删除Favourites</p>'
	}
}, {
	method : 'get',
	path   : `/${ROUTE_NAME}/me`,
	config : {
		handler     : router.getForUser,
		description : '<p>获取所有</p>'
	}
}]