/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: article 路由配置
 */

'use strict';

const message = require('../helpers/message'),
help       = require('../helpers/page.help.js'),
service       = require('../services/article.service'),
moment        = require('moment'),
ROUTE_NAME    = 'article'

const router = {
	get(req, reply){
		let { page, per_page, sort } = req.query;
		page     = parseInt(page);
		per_page = parseInt(per_page);

		service.getArticle(page, per_page, sort, (articles, count) => {
			let { total, last_page, next_page_url, prev_page_url} = help.calculate(page, per_page, count, '/article');
			reply({data: articles, current_page: page, total, per_page, last_page, next_page_url, prev_page_url })
		});
	},
	getSubscribe(req, reply) {
		const is_sub = req.query.is_sub == 'undefined'? true : false;
		const user = is_sub?req.query.user : req.auth.credentials._id;
		service.getArticleForSub(user, is_sub, (articles) => reply(message.success('success', articles)))
	},
	// 获取文章评论
	getComments(req, reply) {
		const {_id} = req.params;
		const user  = req.auth.credentials._id;
		console.log('article _id', _id);

		service.getComments(_id, (comments) => reply(message.success('success', comments)))
	},
	getById(req, reply) {
		const {_id} = req.payload;
		service.getAryicleById(_id)
		.then(result => reply(message.success('success', result)))
		.catch(err => reply(message.unsuccess('error', err)));
	},
	post(req, reply) {
		const user = req.auth.credentials._id;
		req.payload.user = user;
		service.Insert(req.payload)
		.then(result => reply(message.success('success', result)))
		.catch(err => reply(message.unsuccess('error', err)));
	},
	insertComments(req, reply) {
		const user = req.auth.credentials._id;
		req.payload.user = user;
		service.InsertComments(req.payload)
		.then(result => reply(message.success('success', result)))
		.catch(err => reply(message.unsuccess('error', err)));
	},
	put(req, reply) {

		service.Update(req.payload)
		.then(result => reply(message.success('success', result)))
		.catch(err => reply(message.unsuccess('error', err)));
	},
	delete(req, reply) {
		const {_id} = req.payload;
		console.log('_id', _id)
		service.Delete(_id)
		.then(result => reply(message.success('success', result)))
		.catch(err => reply(message.unsuccess('error', err)));
	},
	getAll(req, reply) {
		service.getArticleAll(articles => {
			reply(message.success('success', result))
		});
	}
}


module.exports = [{
	method : 'get',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.get,
		description : '<p>getArticle</p>'
	}
}, {
	method : 'get',
	path   : `/${ROUTE_NAME}/user/subscribe`,
	config : {
		handler     : router.getSubscribe,
		description : '<p>getArticleForSubscribe</p>'
	}
}, {
	method : 'get',
	path   : `/${ROUTE_NAME}/{_id}`,
	config : {
		handler     : router.getById,
		description : '<p>getCartCount</p>'
	}
}, {
	method : 'get',
	path   : `/${ROUTE_NAME}/comments/{_id}`,
	config : {
		handler     : router.getComments,
		description : '<p>getCartCount</p>'
	}
}, {
	method : 'post',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.post,
		description : '<p></p>'
	}
}, {
	method : 'post',
	path   : `/${ROUTE_NAME}/comments`,
	config : {
		handler     : router.insertComments,
		description : '<p></p>'
	}
}, {
	method : 'put',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.put,
		description : '<p></p>'
	}
}, {
	method : 'delete',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : router.delete,
		description : '<p></p>'
	}
}];