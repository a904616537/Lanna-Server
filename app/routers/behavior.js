/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: article 路由配置
 */

'use strict';

const message = require('../helpers/message'),
service       = require('../services/behavior.service'),
user_service  = require('../services/user.service'),
moment        = require('moment'),
ROUTE_NAME    = 'behavior'

const router = {
	get(req, reply){
		const _id = req.query._id;
		console.log('_id', _id)
		service.get(_id, behaviors => {
			console.log('behaviors', behaviors)
			reply(message.success('success', behaviors))
		})
	},
	getSub(req, reply){
		user_service.getUserById(req.auth.credentials._id, user => {
			let ids = user.subscribe.map(val => val.user);
			ids.push(req.auth.credentials._id);
			service.getSubscribe(ids, behaviors => reply(message.success('success', behaviors)))
		})
	},
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
	path   : `/${ROUTE_NAME}/subscribe`,
	config : {
		handler     : router.getSub,
		description : '<p>获取关注者的状态</p>'
	}
}];