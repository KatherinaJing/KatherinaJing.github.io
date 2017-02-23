
//封装的查找的方法
var methods = {
	//获取指定id下所有子元素的数据....!!!当前元素的id就是子元素的pid
	getChilds : function(datas,id){
		var arr = [];
		for(var i=0;i<datas.length;i++){
			if(datas[i].pid == id){
				arr.push(datas[i]);
			}
		};
		return arr;
	},
	//获取指定id下所有文件夹数据....!!!当前元素的id就是子元素的pid
	getFolderChilds : function(datas,id){
		var arr = [];
		for(var i=0;i<datas.length;i++){
			if(datas[i].pid == id && datas[i].type == 'folder'){
				arr.push(datas[i]);
			}
		};
		return arr;
	},
	//获取指定id下所有父级元素,把当前元素以及父元素存入数组..!!当前元素的pid是父元素的id
	getParents : function(datas,id){
		var arr = [];
		for(var i=0; i<datas.length;i++){
			if(datas[i].id == id){//找到当前元素
				arr.push(datas[i]);
				arr = arr.concat(methods.getParents(datas,datas[i].pid));
			}
		}
		return arr;
	},
	//通过id找到自己的数据
	getSelf : function(datas,eleId){
		for(var i=0;i<datas.length;i++){
			if(datas[i].id == eleId){
				return datas[i];
			}
		};
	},
	//判断新建是否名字重复
	isSameName : function(value,type,datas){
		for(var i=0;i<datas.length;i++){
			if( value == datas[i].name && type == datas[i].type){
				return true;
			}
		}
		return false;
	},
	//判断重命名时是否名字重复
	isNewSameName : function(newName,datas){
		for(var i=0;i<datas.length;i++){
			if( newName == datas[i].name){
				return true;
			}
		}
		return false;
	},
	//检测obj1是否碰撞obj2,如果碰撞返回true，否则false
	collisionTest : function(obj1,obj2){
		var pos1 = methods.getPos(obj1);
		var pos2 = methods.getPos(obj2);
		//排除掉所有不能碰撞的结果，剩下的就是碰撞。
		if(pos1.bottom<pos2.top||pos1.left>pos2.right||pos1.top>pos2.bottom||pos1.right<pos2.left){
			return false;
		}else{
			return true;
		}
	},
	getPos : function(obj){
		return obj.getBoundingClientRect();
	},
	//操作直接数据
	handleData : function(outData,InData,eleId){
		for(var i=0;i<outData.length;i++){
			if( outData[i].id== eleId){
				//找到对应数据删除
				var arr = outData.splice(i,1);
				arr[0].pid = 0;
				//把数据存入InData
				InData.push(arr[0]);
			}
		}	
	},
	//操作直接数据的子元素
	handleChildData : function(outData,InData,eleId){
		for(var i=0;i<outData.length;i++){
			if(outData[i].pid == eleId){
				//找到对应数据删除
				var arr = outData.splice(i,1);
				//把数据存入InData
				InData.push(arr[0]);
				i--;
			}
		};
	},
	//数组去重
	arrayToWeight :	function(arr){
		var newArr = [].concat(arr);
		for(var i=0;i<newArr.length-1;i++){
			for(var j=i+1;j<newArr.length;j++){
				if(newArr[i] === newArr[j]){
					newArr.splice(j,1);
					j--;
				}
			}
		}
		return newArr;
	},
	//找到文档,类型的数据
	getTxtData : function(datas){
		var arr = [];
		for(var i=0;i<datas.length;i++){
			if(datas[i].type == 'plain' || datas[i].type == 'word' || datas[i].type == 'pdf'){
				arr.push(datas[i]);
			}
		};
		return arr;
	},
	//找到图片类型的数据
	getPicData : function(datas){
		var arr = [];
		for(var i=0;i<datas.length;i++){
			if(datas[i].type == 'image'){
				arr.push(datas[i]);
			}
		};
		return arr;
	},
	//找到音乐类型的数据
	getAudioData : function(datas){
		var arr = [];
		for(var i=0;i<datas.length;i++){
			if(datas[i].type == 'audio'){
				arr.push(datas[i]);
			}
		};
		return arr;
	},
	//找到视频类型的数据
	getVideoData : function(datas){
		var arr = [];
		for(var i=0;i<datas.length;i++){
			if(datas[i].type == 'video'){
				arr.push(datas[i]);
			}
		};
		return arr;
	}
	
	
};
