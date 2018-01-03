const path = require('path'),
rootPath   = path.normalize(__dirname + '/..'),
env        = process.env.NODE_ENV || 'development';

console.log('当前环境', env)

const config = {
	//开发者环境配置
	development: {
		root         : rootPath,
		maxOrderTime : 1080,
		app          : {
			name : 'LannaCoffee-test',
			local: 'http://localhost:8050'
		},
		mongo : 'mongodb://127.0.0.1/LannaCoffee',
		main  : {
			languagePath : rootPath + '/language/',
			port         : 8050,
		},
		cookie : {
			secret      : 'LannaCoffee',
			sessionName : 'session'
		},
		yunpian : {
			apiKey  : '20a4152a354eaea512a093e891e08639'
		}
	},
	test: {
		root         : rootPath,
		port         : 8050,
		maxOrderTime : 1080,
		app          : {
			name : 'LannaCoffee-test',
			local: 'http://localhost:8050'
		},
		mongo : 'mongodb://ec2-54-223-41-81.cn-north-1.compute.amazonaws.com.cn:27017/LannaCoffee',
		main  : {
			languagePath : rootPath + '/language/',
			port         : 8050,
		},
		cookie : {
			secret      : 'LannaCoffee',
			sessionName : 'session'
		}
	},
	// 线上产品配置
	production : {
		root         : rootPath,
		port         : 8050,
		maxOrderTime : 1080,
		app          : {
			name : 'LannaCoffee-test',
			local: 'http://localhost:8050'
		},
		mongo : 'mongodb://127.0.0.1/LannaCoffee',
		main  : {
			languagePath : rootPath + '/language/',
			port         : 8050,
		},
		cookie : {
			secret      : 'LannaCoffee',
			sessionName : 'session'
		}
	}
}

module.exports = config[env];
