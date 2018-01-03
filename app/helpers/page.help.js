/*
 * Author: Kain·Altion <kain@foowala.com>
 */

'use strict';

const config = require('../../config/config');

const help = {
	calculate(page, per_page, total, route) {
		let last_page = Math.ceil(total/per_page);
		let next_page_url = config.app.local + route + "?page=" + (page + 1);
		let prev_page_url = config.app.local + route + "?page=" + (page - 1);
		return {
			total,
			per_page,
			last_page,
			next_page_url,
			prev_page_url
		}
	}
}

 module.exports = help