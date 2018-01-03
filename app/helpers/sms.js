/*
 * Author: Kain · Shi <kain@foowala.com>
 * Module description: 短信发送帮助
 */

var async  = require('async'),
    moment = require('moment'),
    https  = require('https'),
    qs     = require('querystring'),
    config = require('../../config/config');

var sms_timeout = new Map();

function querySMS(phone, callback) {

  var bo = true;
  var sms = sms_timeout.get(phone);
  if(typeof(sms) === 'undefined') {
    callback(true);
  } else {
    var time     = new Date().getTime(),
        dateTime = time - sms.time,
        leave    = dateTime%(24 * 3600 * 1000),
        hours    = Math.floor(leave/(3600 * 1000));

    if(hours > 0) {
      sms = null;
      bo = true;
      callback(true);
    } else {

      callback(false);
    }
  }
}


var smsHelp = {
  // This function accepts a message and mobile (ex: 12312345678) parameter
  // Leverages the 云片 API to forward an SMS to the mobile number provided
  // Error messages are forward to the system administrators' WeChat accounts
  sendSMS: function(message, mobile, callback) {
    var post_data = {
    'apikey': config.yunpian.apiKey,
    'mobile': Number(mobile),
    'text'  : message,
    };//这是需要提交的数据
    var content = qs.stringify(post_data);

    // NOTE:DON'T FORGET TO RENABLE ONCE YOU COPY TO LIVE SERVER
    this.post("/v2/sms/single_send.json",content,"sms.yunpian.com", mobile);
    callback(true);
  },
  post: (uri, content, host, mobile) => {
      var options = {
          hostname: host,
          port    : 443,
          path    : uri,
          method  : 'POST',
          headers : {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
      };

      querySMS(mobile, (bo) => {
        if(bo) {
          var req = https.request(options, (res) => {
              res.setEncoding('utf8');
              res.on('data', (chunk) => {
                var obj = JSON.parse(chunk);
                if(obj.code === 0) console.log('send sms is ok!');
                else {sms_timeout.set(mobile, new Date().getTime());}
                console.log('BODY: ' + chunk);
              });
          });
          req.write(content);
          req.end();
        }
      });
  }
};

module.exports = smsHelp;
