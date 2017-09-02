'use strict';

const LoginService = require('qcloud-weapp-server-sdk').LoginService;
let models  = require('../models');

let get = (req, res) => {
	let loginService = LoginService.create(req, res);
	loginService.check()
		.then(data => {
			let id = req.params.id;
			if(!!id) {
				Promise.all([
					models.user.findOne({
						where: {
							id: id
						}
					}),
					// 查看当前用户完成了多少线路
					models.result.findAll({
						where: {
							user_id: id,
							status: '1', //成功了的
						}
					})
				]).then(list=>{
					let user = list[0];
					let resultList = list[1];
					res.json({
						'code': 0,
						'message': 'ok',
						'data': {
							'userInfo': user,
							resultList: resultList
						},
					});
				});


			} else {
				res.json({
					'code': 1,
					'message': 'id 为空'
				});
			}
		});

};


let curr = (req, res) => {
	let loginService = LoginService.create(req, res);
	loginService.check()
		.then(data => {
			models.user.findOne({
				where: {
					openid: data.userInfo.openId
				}
			}).then((u)=>{
				res.json({
					'code': 0,
					'message': 'ok',
					'data': {
						'userInfo': u,
					},
				});
			});

		});

};
let checkRegister = (req, res) => {
	let loginService = LoginService.create(req, res);
 	let ret = {
 		'code': '1',
		'message': '未完善信息',
	};
	loginService.check()
		.then(data => {
			if(!!data && data.userInfo && data.userInfo.openId) {

				models.user.findOne({
					where: {
						openid: data.userInfo.openId
					}
				}).then( regUser =>{
					if(regUser && !!regUser.id) {
						res.json({
							'code': 0,
							'message': 'ok',
							'data': {
								'userInfo': regUser,
							},
						});
					} else {
						ret.data={
							userInfo : data.userInfo
						};
						// 返回失败
						res.json(ret);
					}
				});

			} else {
				// 返回失败
				res.json(ret);
			}
		})
		.catch(()=>{
			ret.code = '2';
			ret.message = '未登录';
			// 返回失败
			res.json(ret);
	});

};

// 注册运动员
let register = (req, res) => {
	let openid = req.body.openid;
	let nick = req.body.nick;
	let type = req.body.type;
	let idCard = req.body.idCard;
	let name = req.body.name;

	let height = req.body.height;
	let weight = req.body.weight;
	let gender = req.body.gender;
	let clothes_size = req.body.clothes_size;

	let climbing_ability = req.body.climbing_ability;
	let climbing_time = req.body.climbing_time;

	let phone = req.body.phone;
	let email = req.body.email;
	let avatar_url = req.body.avatar_url;
	let id_card = req.body.id_card;

	models.user.upsert({
		role: '2', //运动员
		openid: openid,
		nick: nick,
		type: type,
		idCard: idCard,
		name: name,

		height: height,
		weight: weight,
		gender: gender,
		clothes_size: clothes_size,
		climbing_ability: climbing_ability,
		climbing_time: climbing_time,

		phone: phone,
		email: email,
		avatar_url: avatar_url,
		id_card: id_card

	}).then(data=>{
		res.json({
			'code': 0,
			'message': 'ok',
			'data': {
				'userInfo': data,
			},
		});
	});

};

let registerJudgment = (req, res) => {
	let openid = req.body.openid;
	let nick = req.body.nick;
	let idCard = req.body.idCard;
	let name = req.body.name;

	let gender = req.body.gender;

	let phone = req.body.phone;
	let avatar_url = req.body.avatar_url;
	let id_card = req.body.id_card;
	let code = req.body.code;

	let ret = {
		'code': -1,
		'message': '',
		'data': {
			'userInfo': {}
		}
	};
	if(!code) {
		ret.code = -1;
		ret.message = '邀请码为空';
		res.json(ret);
		return;
	}
	// 判断邀请码有效性
	models.code.findAll({
		where: {
			code: code
		}}).then((codeDate)=>{
		if(!!codeDate && codeDate.length > 0 && !!codeDate[0].status && codeDate[0].status === '1') {
			let codeModel = codeDate[0];
			let code_id = codeModel.id;

			// 注册, 让邀请码失效
			Promise.all([
				models.user.upsert({
					role: '1', //裁判
					openid: openid,
					nick: nick,
					idCard: idCard,
					name: name,
					code_id: code_id,

					gender: gender,
					phone: phone,
					avatar_url: avatar_url,
					id_card: id_card
				}),
				codeModel.update({
					status: 0
				})
			]).then(data=>{
				res.json({
					'code': 0,
					'message': 'ok',
					'data': {
						'userInfo': data,
					},
				});
			});

		} else {
			ret.code = -2;
			ret.message = '无效的邀请码';
			res.json(ret);
		}


	});



};

module.exports = {
	get: get,
	curr: curr, // 获得当前用户信息
	checkRegister: checkRegister,
	register: register,
	registerJudgment: registerJudgment
}