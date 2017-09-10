'use strict';

const LoginService = require('qcloud-weapp-server-sdk').LoginService;
let models  = require('../models/index');

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
						if(!!regUser.phone) {
							res.json({
								'code': 0,
								'message': 'ok',
								'data': {
									'userInfo': regUser,
								},
							});
						} else {
							//	没有手机号，补充
							res.json({
								'code': -200,
								'message': '补充手机号',
								'data': {
									'userInfo': regUser,
								},
							});
						}

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
	let game_list = req.body.game_list;

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
		id_card: id_card,
		game_list: game_list

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

/**
 * 更新所有参赛选手的获得奖金信息
 */
let updateAllUserMoney = function () {
//	先取出来所有用户，所有line，所有result
	return Promise.all([
		models.user.findAll(),
		models.line.findAll(),
		models.result.findAll()
	]).then((list)=>{
		let userList = list[0];
		let lineList = list[1];
		let lineMap = {};
		let resultList = list[2];

		for(let line of lineList) {
			lineMap[line.id] = line;
		}
		lineList = null;

		for(let user of userList) {
			let hasLineMap = {}; // 用来标记，防止一个用户重复攀登，多次计算奖金
			let money = 0;
			for(let result of resultList) {
				//状态，-1正在进行中，0 失败，1成功
				if(result.user_id == user.id && result.status == '1'  && !hasLineMap[result.id]) {
					hasLineMap[result.id] = true;
					// parseFloat((line.bonus / line.finish_num).toFixed(2));
					let line = lineMap[result.line_id];
					if(!!line) {
						money = money + parseFloat((line.bonus / line.finish_num).toFixed(2));
					}
				}
			}
			if(money !== 0 && user.money != money) {
				user.update({
					money: money
				}).then((lineData)=>{
					res.json({
						'code': 0,
						'message': 'ok',
						'data': {
							time: time // 比赛耗时
						},
					});
				});
			}
		}

		return '';
	})

};

/**
 * 获得用户名次(根据奖金情况)
 */
let getRanking = function (req, res) {
	let loginService = LoginService.create(req, res);
	loginService.check()
		.then(data => {
			let id = req.params.id;
			if(!!id) {
				models.user.findAll().then(userList=>{
					// 排序
					userList.sort(function (u1, u2) {
						return u2.money - u1.money;
					});
					let num = parseInt(userList.length / 2);// 默认中间名次
					for (let i=0; i < userList.length; i++) {
						if(userList[i].id == id) {
							num = i+1;
							break;
						}
					}
					res.json({
						'code': 0,
						'message': 'ok',
						'data': {
							ranking: num // 比赛耗时
						},
					});

				});
			} else {
				res.json({
					'code': 1,
					'message': 'id 为空'
				});
			}
		}).catch(()=>{
		res.json({
			'code': 1,
			'message': '非法请求'
		});
	});
};


/**
 * 更新用户手机和参加攀岩信息
 */
let modifyPhone = function (req, res) {
	let phone = req.body.phone;
	let game_list = req.body.game_list;

	let loginService = LoginService.create(req, res);
	loginService.check()
		.then(data => {
			if(!!data &&  !!data.userInfo && !!data.userInfo.openId) {
				models.user.findOne({
					where: {
						openid: data.userInfo.openId
					}
				}).then(user=>{
					user.update({
						phone: phone,
						game_list: game_list
					}).then(()=>{
						res.json({
							'code': 0,
							'message': 'ok',
							'data': {
							},
						});
					});
				});
			} else {
				res.json({
					'code': 1,
					'message': '非法请求，没有openid'
				});
			}
		}).catch(()=>{
		res.json({
			'code': 1,
			'message': '非法请求'
		});
	});

};

// blockList:[
// 	{
// 		img: config.staticUrl+'/img/report/1.png',
// 		className: 'img1',
// 		title1:'你获得的总奖金',
// 		title2:'4321 元',
// 		title3:'',
// 	},
// 	{
// 		img: config.staticUrl+'/img/report/2.png',
// 		className: 'img2',
//
// 		title1:'完成的线路最高难度为',
// 		title2:'5.14',
// 		title3:'仅有 3 人完攀',
// 	},
// 	{
// 		img: config.staticUrl+'/img/report/3.png',
// 		className: 'img3',
//
// 		title1:'你一共完成了',
// 		title2:'15 条线路',
// 		title3:'',
// 	},
// 	{
// 		img: config.staticUrl+'/img/report/4.png',
// 		className: 'img4',
//
// 		title1:'最快完成线路用时',
// 		title2:'1小时45分56秒',
// 		title3:'超过 98% 的选手',
// 	}
// ],
/**
 * 获得用户成绩单所需信息
 */
let getReportInfo = function (req, res) {

	let loginService = LoginService.create(req, res);
	loginService.check()
		.then(data => {
			if(!!data &&  !!data.userInfo && !!data.userInfo.openId) {
				models.user.findOne({
					where: {
						openid: data.userInfo.openId
					}
				}).then(user=>{
					let ret = {
						'code': 0,
						message:'ok',
						data: {
							money: 0,//获得奖金
							maxLineDifficulty: {},// 最难路线难度对象
							maxDifficultyUserNum: 0, // 最难线路完成人数

							finishNum: 0, //完成线路数量

							fastTime: 0,//最快完成线路时间
							fastTimeRate: '', //最快完成时间超过80%
						}
					};
					Promise.all([
						models.line.findAll(),
						models.line_difficulty.findAll(),
						models.result.findAll({
							where: {
								user_id: user.id,
								status: '1'
							}
						}),
					]).then( (list)=>{
						let allLine = list[0];
						let allLineMap = {};

						let allLineDifficulty = list[1];
						let allLineDifficultyMap = {};
						let resultList = list[2];

						for(let d of allLineDifficulty) {
							allLineDifficultyMap[d.id] = d;
						}
						for(let l of allLine) {
							allLineMap[l.id] = l;
						}
						if(!!resultList && resultList.length > 0) {
							//------------------ maxDifficultyLine: 0,// 最难路线
							let maxLine = null;
							let maxLineDifficulty = null;
							let max = -100;
							for (let res of resultList) {
								let line = allLineMap[res.line_id];
								let lineDifficulty = allLineDifficultyMap[line.line_difficulty_id];
								if(max < lineDifficulty.difficulty) {
									maxLine = line;
									max = lineDifficulty.difficulty;
									maxLineDifficulty = lineDifficulty;
								}
							}
							ret.data.maxLineDifficulty = maxLineDifficulty;

							//------------------ fastTime: 0,//最快完成线路时间
							let fast = null;
							let fastLine = null;
							for (let res of resultList) {
								if( fast === null || fast > res.time) {
									fastLine = allLineMap[res.line_id];
									fast = res.time;
								}
							}

							Promise.all([
								// 难度最大的路线，查找所有完成该路线的
								models.result.findAll({
									where: {
										line_id: maxLine.id,
										status: '1'
									}
								}),
								// 用时最短，查找所有完成该路线的
								models.result.findAll({
									where: {
										line_id: fastLine.id,
										status: '1'
									}
								})
							]).then((rList)=>{

								//------------------ maxDifficultyUserNum: 0, // 最难线路完成人数
								let maxResultList = rList[0];
								let fastResultList = rList[1];

								let maxNum = 0;
								let onlyMap = {};//用来排除一个人攀成功了两次的情况
								for (let i of maxResultList) {
									if(!onlyMap[i.user_id]) {
										maxNum++;
										onlyMap[i.user_id] = true;
									}
								}
								ret.data.maxDifficultyUserNum = maxNum;

								//------------------ fastTimeRate: 0, //最快完成时间超过多少人超过 98% 的选手
								onlyMap = {};
								let onlyList = [];
								fastResultList.sort((a, b)=>{
									return a.time -b.time;
								});
								for (let i of fastResultList) {
									if(!onlyMap[i.user_id] && i.user_id !== user.id) {
										onlyList.push(i);
										onlyMap[i.user_id] = true;
									}
								}
								let moreNum = 0; // 比他攀爬时间多的人数
								for (let i of onlyList) {
									if(i.time > fastLine.time) {
										moreNum++;
									}
								}
								if(onlyList.length == 0) {
									ret.data.fastTimeRate = '100%';
								} else {
									ret.data.fastTimeRate = parseInt(moreNum*100/onlyList.length)+'%';
								}
								ret.data.money = user.money;

								console.log('------------------ maxDifficultyUserNum: 0, // 最快完成时间超过多少人超过',moreNum, fastResultList);

								res.json(ret);
							}).catch(()=>{
								res.json(ret);
							});
						} else {
							res.json(ret);
						}

					}).catch(() =>{
						res.json(ret);
					});
				});
			} else {
				res.json({
					'code': 1,
					'message': '非法请求，没有openid'
				});
			}
		}).catch(()=>{
		res.json({
			'code': 1,
			'message': '非法请求'
		});
	});

};
module.exports = {
	get: get,
	curr: curr, // 获得当前用户信息
	checkRegister: checkRegister,
	register: register,
	registerJudgment: registerJudgment,
	updateAllUserMoney: updateAllUserMoney,

	getRanking: getRanking,
	modifyPhone: modifyPhone,
	getReportinfo: getReportInfo,
}