'use strict';

const express = require('express');
const router = express.Router();

const LineService = require('../service/line');
const UserService = require('../service/user');
const PayService = require('../service/pay');
const JudgmentService = require('../service/judgment');
const ConfigService = require('../service/config');

router.get('/login', require('../service/login'));

//用户信息
router.get('/user/get/:id', UserService.get);
router.get('/user/get/ranking/:id', UserService.getRanking); // 获得用户名次
router.get('/user/getcurr', UserService.curr);
router.get('/user/checkRegister', UserService.checkRegister);

router.get('/user/modify/phone', UserService.modifyPhone); //补充手机号

router.post('/user/register', UserService.register);
router.post('/user/judgment/register', UserService.registerJudgment);

// 线路
router.get('/line/allInfo', LineService.getAll);
router.get('/line/get/:id', LineService.getOne);
router.get('/line/allDifficulty', LineService.getAllLineDifficulty);

// 支付相关
router.post('/pay/get/config', PayService.getPayConfig);
router.all('/pay/back', PayService.payCallback);

// 比赛相关
router.post('/judgment/start', JudgmentService.startGame); // 开始一条攀岩
router.post('/judgment/end', JudgmentService.endGame); //结束一条攀岩
router.post('/judgment/get', JudgmentService.getGame); // 获得某次攀岩数据
router.get('/judgment/all/on', JudgmentService.getAllOnGameByCurr); // 获得这个裁判下所有正在进行的比赛

// 配置
router.get('/get/config', ConfigService.getConfig); // 活动岩点的配置

module.exports = router;