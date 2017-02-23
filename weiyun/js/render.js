//单个文件的html结构..传入的是元素
function oneFile(ele){
	var str = `
        <div class="ele" data-ele-id="${ele.id}">
			<i class="checkbox"></i>
			<div class="fileimg">
				<i class="filetype ${ele.type}">
					${isImage(ele)}
				</i>
			</div>
			<p class="filename">
				<input type="text" vlaue="${ele.name}">
				<span>${ele.name}</span>
			</p>
		</div>
        `;
    return str;
}
//判断是不是图片
function isImage(ele){
	if( ele.type == 'image' ){
		return '<img src='+ele.src+'>'
	}
	return '';
}


//根据指定的id,得到子元素的数据,按照模板渲染数据
function renderFileArea(datas,id){
	var childs = methods.getChilds(datas,id);
	var str = "";
	childs.forEach(function(ele){
		//外层增加一层wrap
		str += `
			<div class="ele-wrap">
	            ${oneFile(ele)}
	        </div>
		`  ;
	});
	return str;
}
//点击新建按钮时,需要渲染的单独结构
function createEle(ele){
	var div = document.createElement("div");
	div.className = "ele-wrap";
	div.innerHTML = oneFile(ele);
	return div;
}


//通过元素的id找到他所有的父级元素,然后渲染到pathnav中...
function renderPathNav(datas,eleId){
	var parents = methods.getParents(datas,eleId).reverse();//找到指定id所有的父数据,级别降序
	var str = '';
	var rank = parents.length;//用来设置层级
	
	//父级元素的路径
	parents.forEach(function(ele,index){
		if(index==parents.length-1)return;
		str += `
			<a href="javascript:;" style="z-index:${rank--}" data-ele-id="${ele.id}">
				${ele.name}
			</a>
		`;
	});
	//当前选中元素的路径
	str += `
		<span class="current-path" style="z-index:${rank--}">
			${parents[parents.length-1].name}
		</span>
	`;
	return str;
}

//准备树形菜单的html结构
function renderTreeMenu(datas,treeId,num){
	num = num||0;
	var childs = methods.getFolderChilds(datas,treeId);
	var str = '<ul>';
	if(num > 1){
		str = '<ul style="display:none">';
	}
	childs.forEach(function(ele){
		var level = methods.getParents(datas,ele.id).length;//获取当前元素所在层级
		var childsLen = methods.getFolderChilds(datas,ele.id).length;
		var className = childsLen !==0 ? "tree-on" : "tree-none";
		str += `
			<li>
                <h4 class="tree-node ${className}" data-ele-id="${ele.id}" style="padding-left:${level*14}px">
                	<div>
                		${className=="tree-on" ? '<i class="icon"></i>' : ''}
                		<span>${ele.name}</span>
                	</div>
                </h4>
                ${renderTreeMenu(datas,ele.id,++num)}
   			</li>
		`;
	});
	str  += '</ul>';
	return str;
}

//树形菜单的li的结构
function createTreeLi(options){
	var li = document.createElement("li");
	li.innerHTML = `
		<h4 class="tree-node tree-none" data-ele-id="${options.id}" style="padding-left:${options.rank*14}px">
        	<div>
        		<span>${options.name}</span>
        	</div>
        </h4>
        <ul></ul>
	`;
	return li;
}


//其他版块文件区域的渲染
function renderOtherHtml(arr){
	var str = "";
	arr.forEach(function(ele){
		//外层增加一层wrap
		str += `
			<div class="ele-wrap">
	            ${oneFile(ele)}
	        </div>
		`  ;
	});
	return str;
}