'use strict';

let models  = require('../models/index');
let activeName = 'yandian';
let getDatabaseConfig = () => {
	return models.config.findOne({
		where: {
			back1: activeName
		}
	}).then(config=>{
		if(!!config) {
			return config;
		} else {
			return null;
		}
	});

};


let getConfig = (req, res) => {
	this.getDatabaseConfig().then(config=>{
		res.json({
			'code': 0,
			'message': 'ok',
			'data': config,
		});
	})

};

module.exports = {
	getDatabaseConfig: getDatabaseConfig, // 获得当前配置
	getConfig: getConfig, // 获得当前配置
}