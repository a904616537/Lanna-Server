/*
 * Author: Kain·Shi <kain@foowala.com>
 */

const msg  = require('../helpers/message'),
_cart      = require('../services/cart.service'),
moment     = require('moment'),
ROUTE_NAME = 'cart'


const getCart = (req, reply) => {
	const user_id = req.auth.credentials._id;
	_cart.getCart(user_id)
	.then(result => reply(msg.success('success', result)))
	.catch(err => reply(msg.unsuccess('unsuccess')))
},
getCount = (req, reply) => {
	const user_id = req.auth.credentials._id;
	_cart.getCount(user_id)
	.then(result => reply(msg.success('success', '')))
	.catch(err => reply(msg.unsuccess('unsuccess')))
},
addCart = (req, reply) => {
	const user_id = req.auth.credentials._id;
	const { _id, number } = req.payload;
	_cart.getCart(user_id)
	.then(cart => {
		let cart_item = cart.cart_item.find(value => {
			if(value.product) return value.product._id == _id;
			else return false;
		})

		if(cart_item) cart_item.number += Number(number);
		else cart.cart_item.push({
				product : _id,
				number  : Number(number),
			})
		_cart.Update(cart)
		.then(cart => reply(msg.success('success', '')))
		.catch(err => reply(msg.unsuccess('unsuccess')))
	})
	.catch(err => reply(msg.unsuccess('unsuccess')))
},
putCart = (req, reply) => {
	const user_id = req.auth.credentials._id,
	item = {
		operation : req.payload.operation,
		item_id   : req.payload._id
	};
	console.log('put cart item for product', {item, user:user_id});
	_cart.getCart(user_id)
	.then(cart => {
		let cart_item = cart.cart_item.find(value => {
			return value._id == item.item_id
		})
		let product = cart_item.product;
		switch(item.operation) {
			case 'add' :
				cart_item.number += 1;
			break;
			case 'subtract' :
				cart_item.number -= 1;
			break;
		}
		_cart.Update(cart)
		.then(() => reply(msg.success('success')))
		.catch(err => reply(msg.unsuccess('unsuccess')))
	})
	.catch(err => reply(msg.unsuccess('unsuccess')))
},
delCart = (req, reply) => {
	const user_id = req.auth.credentials._id;
	const { _id } = req.payload;
	console.log('_id', _id)
	_cart.getCart(user_id)
	.then(cart => {
		let index = cart.cart_item.findIndex(value => value._id == _id)
		
		cart.cart_item.splice(index, 1)

		_cart.Update(cart)
		.then(cart => reply(msg.success('success')))
		.catch(err => reply(msg.unsuccess('unsuccess')))
	})
	.catch(err => reply(msg.unsuccess('unsuccess')))
}


module.exports = [{
	method : 'get',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : getCart,
		description : '<p>getCart</p>'
	}
}, {
	method : 'get',
	path   : `/${ROUTE_NAME}/count`,
	config : {
		handler     : getCount,
		description : '<p>getCartCount</p>'
	}
}, {
	method : 'post',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : addCart,
		description : '<p></p>'
	}
}, {
	method : 'put',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : putCart,
		description : '<p></p>'
	}
}, {
	method : 'delete',
	path   : `/${ROUTE_NAME}`,
	config : {
		handler     : delCart,
		description : '<p></p>'
	}
}];