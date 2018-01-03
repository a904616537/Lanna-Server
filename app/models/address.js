/*
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 统一地址格式
 */

'use strict';

var mongoose  = require('mongoose'),
Schema        = mongoose.Schema,
address_Scheam = new Schema({
	title      : {type : String, default : 'home'},
	recipients : String,
	phone      : String,
	email      : String,
	province   : String,
	city       : String,
	district   : String,
	address    : String,
	note       : String,
	remark     : String
});

module.exports = address_Scheam;