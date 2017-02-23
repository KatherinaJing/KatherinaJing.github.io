
//存储删除的数据
var deleteData = [];
//存储删除的子数据
var childDatas = [];
//存最近的数据
var recentData = [];

//数据.....以对象的形式存入数组
var fileDatas = [
		{
			id:0,
			pid:-1,
			name:"微云",
			type:"folder"
		},
		{
			id:1,
			pid:0,
			name:"我的文档",
			type:"folder"
		},
		{
			id:2,
			pid:0,
			name:"我的音乐",
			type:"folder"
		},
		{
			id:3,
			pid:0,
			name:"我的图片",
			type:"folder"
		},
		{
			id:4,
			pid:1,
			name:"重要",
			type:"folder"
		},
		{
			id:5,
			pid:1,
			name:"我的笔记",
			type:"plain"
		},
		{
			id:6,
			pid:1,
			name:"CSS参考手册",
			type:"pdf"
		},
		{
			id:7,
			pid:1,
			name:"配置文档",
			type:"word"
		},
		{
			id:8,
			pid:2,
			name:"TiK ToK",
			src:"audio/TiK ToK.mp3",
			type:"audio"
		},
		{
			id:9,
			pid:2,
			name:"小幸运",
			src:"audio/小幸运.mp3",
			type:"audio"
		},
		{
			id:10,
			pid:2,
			name:"演员",
			src:"audio/演员.mp3",
			type:"audio"
		},
		{
			id:11,
			pid:3,
			name:"高圆圆",
			src:"image/1.jpg",
			type:"image"
		},
		{
			id:12,
			pid:3,
			name:"陈意涵",
			src:"image/2.jpg",
			type:"image"
		},
		{
			id:13,
			pid:3,
			name:"蝴蝶结",
			src:"image/3.jpg",
			type:"image"
		},
		{
			id:14,
			pid:0,
			name:"测试",
			src:"video/1.mp4",
			type:"video"
		},
		{
			id:15,
			pid:4,
			name:"资料",
			type:"folder"
		}
	];





