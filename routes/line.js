'use strict';
let models  = require('../models');
let getAll = (req, res) => {
	// console.log(models.Line);
	Promise.all([models.area.findAll(), models.ground.findAll(), models.line.findAll(), models.line_difficulty.findAll()]).then(list=>{
		console.log('----------------start--------------');
		console.log(list);
		console.log('----------------end--------------');
		res.json({
			'code': 0,
			'message': 'ok',
			'data': {
				'areaList': list[0],
				'groundList': list[1],
				'lineList': list[2],
				'lineDifficultyList': list[3],
			},
		});
	});
};

let getOne = (req, res) => {
	// console.log(models.Line);
	Promise.all([models.area.findAll(), models.ground.findAll(), models.line.findAll()]).then(list=>{
		res.json({
			'code': 0,
			'message': 'ok',
			'data': {
				'line': list[2],
			},
		});
	});
	// models.line.findAll().then(data=>{
	//
	// });
};

let getAllLineDifficulty = (req, res) => {
	console.log('----------------end--------------');
	models.line_difficulty.findAll({
		// sort:[['difficulty','ASC']]
		sort: [['difficulty','DESC']]
	}).then(list=>{
		res.json({
			'code': 0,
			'message': 'ok',
			'data': {
				'list': list
			},
		});
	});
};


module.exports = {
	getAll: getAll,
	getOne: getOne,
	getAllLineDifficulty: getAllLineDifficulty,
};
