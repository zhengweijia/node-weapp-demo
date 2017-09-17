select l.id as '线路id', g.name as '岩场', l.name as '线路名称', l.bonus as '总奖金', l.finish_num as '完成人数' from line as l left join ground as g on g.id = l.ground_id

---------------------

SELECT
	r.id AS '结果id',

	u.id AS '运动员编号',
    u.NAME AS '运动员姓名',

CASE
	WHEN r.STATUS = 1 THEN
	'成功'
	WHEN r.STATUS = 0 THEN
	'失败' ELSE '正在进行'
	END AS '攀爬状态',

	g.NAME AS '攀地名称',
	l.NAME AS '线路名称',
	l.id AS '线路id',

	r.time AS '攀爬时间（毫秒）',

	jud.NAME AS '裁判姓名',
	jud.id AS '裁判id',

	r.start_time AS '攀岩开始时间',
	r.end_time AS '结束时间'
from result AS r
	LEFT JOIN user AS u ON u.id = r.user_id
	LEFT JOIN user AS jud ON jud.id = r.judge_id
	LEFT JOIN line AS l ON l.id = r.line_id
	LEFT JOIN ground AS g ON g.id = r.ground_id

where r.status =1

ORDER BY
r.line_id,r.user_id

-------------------------
SELECT
	r.id AS '结果id',

	u.id AS '运动员编号',
    u.NAME AS '运动员姓名',

CASE
	WHEN r.STATUS = 1 THEN
	'成功'
	WHEN r.STATUS = 0 THEN
	'失败' ELSE '正在进行'
	END AS '攀爬状态',

	g.NAME AS '攀地名称',
	l.NAME AS '线路名称',
	u.id AS '线路id',

	r.time AS '攀爬时间（毫秒）',

	jud.NAME AS '裁判姓名',
	jud.id AS '裁判id',

	r.start_time AS '攀岩开始时间',
	r.end_time AS '结束时间',
	count(distinct r.user_id)
from result AS r
	LEFT JOIN user AS u ON u.id = r.user_id
	LEFT JOIN user AS jud ON jud.id = r.judge_id
	LEFT JOIN line AS l ON l.id = r.line_id
	LEFT JOIN ground AS g ON g.id = r.ground_id

where r.status =1

ORDER BY
r.line_id

group by r.user_id, r.line_id

---------------------
SELECT id as '编号',

    nick as '昵称',
    name as '姓名',
    money as '获得奖金',
    phone as '手机号',
	case when type = 1 then '150'
        when type = 2 then '350'
        else '其他' end as '类型' ,
    email,
    id_card as '身份证/护照',
    height as '身高cm',

    weight as '体重kg',
    case
    	when gender=1 then '男'
    	when gender=2 then '女' end as '性别',
    clothes_size as '衣服尺寸',
    climbing_ability as '攀爬能力',
    climbing_time as '攀爬年龄',
    game_list as '参加比赛类别'

FROM user WHERE  role='2'

order by money desc