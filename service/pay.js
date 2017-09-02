'use strict';
const LoginService = require('qcloud-weapp-server-sdk').LoginService;
const md5 = require('md5');
const config = require('../config');
const WeiXinPay = require('weixinpay');
const models = require('../models/index');

let getPayConfig = (req, res)=> {
	let loginService = LoginService.create(req, res);
	loginService.check().then(result => {
		// 检查有没有注册
		models.user.findOne({
			where: {
				openid: result.userInfo.openId
			}
		}).then( regUser =>{
			if(regUser && !!regUser.id) {
				res.json({
					'code': -1000,
					'message': '已经注册成功',
					'data': {
						'userInfo': regUser,
					},
				});
			} else {
				let weixinpay = new WeiXinPay({
					// pfx: fs.readFileSync('xxx/xxx/apiclient_cert.p12'),可选，退款需要
					appid: config.WXSetting.appid,//微信小程序appid
					mch_id: config.WXSetting.mch_id,//商户帐号ID
					partner_key: config.WXSetting.secret,//秘钥
					openid: result.userInfo.openId,
				});

				let out_trade_no = req.body.out_trade_no;
				let body = '岩点赛事-报名费';
				let total_fee = config.WXSetting.normalPrice;
				if(req.body.type == '2') {
					body = '岩点赛事-报名费住宿费';
					total_fee = config.WXSetting.morePrice;
				}
				if(!out_trade_no) {
					out_trade_no = (new Date()).getTime(); // 生成订单号
				}

				let ip = req.ip.replace('::ffff:', '');
				weixinpay
					.createUnifiedOrder({
						body: body,
						out_trade_no: out_trade_no,//商户订单号
						total_fee: total_fee, //总金额		spbill_create_ip: '', // APP和网页支付提交用户端ip,
						spbill_create_ip: ip, // APP和网页支付提交用户端ip
						notify_url: 'https://64757925.qcloud.la/pay/back',//通知url 接收微信支付异步通知回调地址，通知url必须为直接可访问的url，不能携带参数。
						trade_type: 'JSAPI'
					}, function(data) {

						data.out_trade_no = out_trade_no;
						data.time_stamp = (new Date()).getTime();
						// 计算给前端用的签名
						let tmp = 'appId='+config.WXSetting.appid+'&nonceStr='+data.nonce_str+'&package=prepay_id='+data.prepay_id+'&signType=MD5&timeStamp='+data.time_stamp+'&key='+config.WXSetting.secret;
						data.signNew = md5(tmp).toLocaleUpperCase();
						res.json({
							'code': 0,
							'message': 'ok',
							'data': data,
						});
					});
			}
		});



	});
};

let payCallback = (req, res)=>{
	console.log('-------payCallback 开始-----');
	console.log(req.body);
	console.log('-------payCallback 结束-----');

};

module.exports = {
	getPayConfig: getPayConfig,
	payCallback: payCallback,

};
