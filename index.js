/**
 * Author: Kain·Altion <kain@foowala.com>
 * Module description: 启动
 */
'use strict';

const Hapi     = require('hapi'),
server         = new Hapi.Server(),
config         = require('./config/config'),
good           = require('good'),
goodConsole    = require('good-console'),
plugRoutes     = require('hapi-router'),
hapi_auth      = require('hapi-auth-cookie'),
bodyParser     = require('body-parser'),
vision         = require('vision'),
inert          = require('inert'),
lout           = require('lout'),
pmx            = require('pmx'),
glob           = require('glob'),
hapi_auth_jwt2 = require('hapi-auth-jwt2'),
HAPIWebSocket  = require("hapi-plugin-websocket"),
mainConnection = config.main,
models         = glob.sync(config.root + '/app/models/*.js');

//secret of jwt, important
const secret = 'LannerCoffee';

models.forEach((model) => {
    console.log('Loading Mongodb model：' + model);
    require(model);
});

var http_server = require('http').createServer();

require('./app/services/mongodb.client');

pmx.init({
    ignore_routes : [/notFound/],
    http          : true,
    errors        : true,
    custom_probes : true,
    network       : true,
    ports         : true
});

//cookie options
var cookie_options = {
  ttl          : 365 * 24 * 60 * 60 * 1000, // expires a year from today
  encoding     : 'none',    // we already used JWT to encode
  isSecure     : false,     // warm & fuzzy feelings
  isHttpOnly   : true,      // prevent client alteration
  clearInvalid : false,     // remove invalid cookies
  strictHeader : true,      // don't allow violations of RFC 6265
  path         : '/login'   // set the cookie for only admin routes
}

http_server.listen(mainConnection.port);

server.connection({
    listener : http_server,
    labels   : mainConnection.labels,
    routes   : { cors: true }
});

var validate = function(decoded, request, callback) {
    return callback(null, true);
};

server.register(hapi_auth_jwt2, (err) => {
    if (err) {
        console.log(err);
    }
    server.auth.strategy('jwt', 'jwt', {
        key           : secret,
        validateFunc  : validate,
        verifyOptions : { algorithms: ['HS256'] }
    });

    server.auth.default('jwt');
});

//权限判定系统，待完善
// server.ext('onRequest', function(request, reply) {
//     const JWT = require('jsonwebtoken');
//     const token = request.headers.authorization;
//     console.log("token", token)
//     if (token) {
//         console.log(1)
//         const path = request.path;
//         const decoded = JWT.verify(token, secret);
//         console.log("decoded", decoded);
//     }
//     return reply.continue();
// });

server.register([
    inert, {
        register: vision,
        options: {
            encoding: 'utf-8'
        }
    }, {
        register: lout,
        options: {
            endpoint: '/doc'
        }
    }, {
        register: good,
        options: {
            ops: {
                interval: 1000
            },
            reporters: {
                console: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{
                        log: '*',
                        response: '*'
                    }]
                }, {
                    module: 'good-console'
                }, 'stdout'],
                file: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{
                        ops: '*'
                    }]
                }, {
                    module: 'good-squeeze',
                    name: 'SafeJson'
                }, {
                    module: 'good-file',
                    args: ['./test/fixtures/awesome_log']
                }],
                http: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{
                        error: '*'
                    }]
                }, {
                    module: 'good-http',
                    args: ['http://prod.logs:3000', {
                        wreck: {
                            headers: {
                                'x-api-key': 12345
                            }
                        }
                    }]
                }]
            }
        }
    }, {
        register: plugRoutes,
        options: {
            routes: './app/routers/*.js'
        }
    }
], (err) => {
    if (err) {
        console.log(err);
    }

    server.start((err) => {
        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
