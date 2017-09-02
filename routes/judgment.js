'use strict';
let models  = require('../models');
const LoginService = require('qcloud-weapp-server-sdk').LoginService;

let startGame = (req, res) => {
	let loginService = LoginService.create(req, res);
	loginService.check()
		.then(data => {
			//1、 验证发起请求的是不是裁判
			let user_id = req.body.user_id;//选手id

			let area_id = req.body.area_id;//
			let ground_id = req.body.ground_id;//
			let line_id = req.body.line_id;//

			let status = -1; //状态，-1正在进行中，0 失败，1成功
			let start_time = (new Date()); // 开始时间
			if(!!user_id && !!line_id ) {
				models.user.findOne({
					where: {
						openid: data.userInfo.openId
					}
				}).then((u)=>{
					//用户类型 0 管理员，1裁判，2参赛选手，3普通用户
					if(u.role == '1') {
						let judgment_id = u.id;//裁判id

						models.result.upsert({
							user_id: user_id,
							judge_id: judge_id,
							area_id: area_id,
							ground_id: ground_id,
							line_id: line_id,
							start_time: start_time,
							status: status,
						}).then(data2=>{
							res.json({
								'code': 0,
								'message': 'ok',
								'data': data2,
							});
						});
					} else {
						res.json({
							'code': 1,
							'message': '不是裁判在操作'
						});
					}

				});


			} else {
				res.json({
					'code': 1,
					'message': '参数不齐'
				});
			}
		});

};

let endGame = (req, res) => {
	let loginService = LoginService.create(req, res);
	loginService.check()
		.then(data => {
			//1、 验证发起请求的是不是裁判
			let id = req.body.id;//攀岩结果id

			let status = req.body.status; //状态，-1正在进行中，0 失败，1成功

			let start_time = (new Date()); // 开始时间
			if(!!judgment_id && !!judgment_id && !!judgment_id ) {
				Promise.all([
					models.user.findOne({where: {openid: data.userInfo.openId}}),
					models.result.findOne({where: {id: id}})
				]).then((list)=>{
					let u = list[0];
					let result = list[1]; // 一次攀岩
					//用户类型 0 管理员，1裁判，2参赛选手，3普通用户
					if(!!u&&u.role == '1'&&!!result) {
						let endtime = (new Date());
						let starttime = (new Date(result.start_time));
						let time = endtime-starttime; // 比赛耗时
						// 更新数据库
						result.update({
							status: status,
							end_time: endtime,
							time: time,
						}).then((data2)=>{
							// 如果是完成的，更新line线路的完成人数信息，奖金等
							if(status == '1') {
								Promise.all([
									models.result.findAll({where: {line_id: result.line_id}}),
									models.line.findOne({where: {id: result.line_id}})
								]).then((list2)=>{
									let resultList = list2[1]; // 所有关于这条线的结果
									let line = list2[2]; // 线信息

									let finishNum = 0; //完成这条线路总数量
									let resMap = {};
									for(let resu of resultList) {
										if(resu.status == '1'){
											resMap[resu.user_id] = 1; // 使用map来过滤同一个用户完成了两次该线路问题
										}
									}
									finishNum = resMap.keys().length;
									line.update({
										finish_num: finishNum
									}).then((lineData)=>{
										res.json({
											'code': 0,
											'message': 'ok',
											'data': {
												time: time // 比赛耗时
											},
										});
									});

								});
							} else {
								res.json({
									'code': 0,
									'message': 'ok',
									'data': {
										time: time // 比赛耗时
									},
								});
							}
						});
					} else {
						res.json({
							'code': 1,
							'message': '不是裁判在操作'
						});
					}
				});


			} else {
				res.json({
					'code': 1,
					'message': '参数不齐'
				});
			}
		});

};

let getGame = (req, res) => {
	let loginService = LoginService.create(req, res);
	loginService.check()
		.then(data => {
			//1、 验证发起请求的是不是裁判
			let id = req.body.id;//

			if(!!id) {
				models.result.findOne({
					where: {
						id: id
					}
				}).then((result)=>{
					res.json({
						'code': 0,
						'message': 'ok',
						'data': result
					});
				});
			} else {
				res.json({
					'code': 1,
					'message': '参数不齐'
				});
			}
		});
};
let getAllOnGameByCurr = (req, res) => {
	let loginService = LoginService.create(req, res);
	loginService.check()
		.then(data => {

			models.user.findOne({
				where: {
					openid: data.userInfo.openId
				}
			}).then((u) => {
				//用户类型 0 管理员，1裁判，2参赛选手，3普通用户
				if (u.role == '1') {
					let judgment_id = u.id;//裁判id
					// 查询正在进行中的比赛
					models.result.findAll({
						where: {
							judge_id: judgment_id,
							status: '-1'
						}
					}).then((result) => {
						if(result.length > 0) {

							// 拿到用户信息
							let uidMap = {};
							for(let resu of result) {
								uidMap[resu.user_id] = 1;
							}
							models.user.findAll({
								where: {
									id: uidMap.keys()
								}
							}).then((userList) => {
								res.json({
									'code': 0,
									'message': 'ok',
									'data': {
										userList:userList,
										resultList: result
									}
								});
							});

						} else {
							res.json({
								'code': 0,
								'message': 'ok',
								'data': {
									userList:[],
									resultList:[]
								}
							});
						}

					});
				} else {
					res.json({
						'code': 1,
						'message': '不是裁判在操作'
					});
				}

			});

		});

};

module.exports = {
	startGame: startGame, // 开始一次攀岩
	endGame: endGame, //结束一次攀岩
	getGame: getGame, //获取一次攀岩
	getAllOnGameByCurr: getAllOnGameByCurr, //根据当前用户，活动正在进行中的攀岩

};
