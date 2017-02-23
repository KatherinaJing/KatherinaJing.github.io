;(function(){
	//页面初始化，创建音频分析对象。
	var context = new AudioContext();
	//初始化时显示目录,其他都隐藏
	$('.main-list').hide();
	$("#main").show();
	/*点击目录*/
	$('#nav-box .all').click(function(){
		$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
		$('.main-list').hide();
		$("#main").show();
		//默认渲染id=0的子级
		var defaultId = 0;
		renderPage(defaultId);
	});
	//点击左侧导航后，让gitPid的值为0
	$('#nav-box .nav-list').click(function(){
		$('#getPid').val(0);
		renderPage(0);
	});
	//初始化显示项目介绍
	setTimeout(function(){
		$('#about-project').animate({
			top: 80,
			right: 5
		},2000);
	},1000);
	
	//控制内容区域的高度
	setConHeight();
	window.onresize = setConHeight;
	function setConHeight(){
		var headerH = $("#header").outerHeight();
		var leftBarW = $("#left-bar").outerWidth();
		var viewHeight = document.documentElement.clientHeight;
		var viewWidth = document.documentElement.clientWidth;
		$("#content").height(viewHeight - headerH);
		$("#main").width(viewWidth - leftBarW);
	}
	
	//控制显示或者隐藏树形菜单
	$('.tree-form').click(function(){
		$("#tree-menu").toggle();
		$(this).toggleClass('tree-form-bg');
		$('#file-show').toggleClass('file-show-margin');
	});
	//换肤
	$('#upload-skin').click(function(){
		$(this).change(function(){
			var f = this.files[0];
			//格式化文件 
			var fr = new FileReader();
			//图片
			if(f.type.indexOf('image')!=-1){
				//监控格式化是否完成
				fr.onload = function(){
					//保存src。
					var address = fr.result;
					$('.file-list').css('background-image','url('+ address+')');
				};
				//添加需要格式化的文件。
				fr.readAsDataURL(f);
				return;
			}else{
				alert('请选择图片上传~~');
			}
		});
	});

	//关于项目描述的显示隐藏
	$('.about-project').click(function(ev){
		$('#about-project').animate({
			top: 80,
			right: 5
		},2000);
		ev.stopPropagation();
	});
	$('#about-project .pendant').click(function(ev){
		$('#about-project').animate({
			top: 80,
			right: 5
		},2000);
		ev.stopPropagation();//阻止冒泡
	});
	$('#about-project .close').click(function(ev){
		$('#about-project').animate({
			top: 80,
			right: -500
		},1000);
		ev.stopPropagation();
	});
	
	//默认渲染id=0的子级
	var defaultId = 0;
	/*****页面初始化******/		
	renderPage(defaultId);
	
	/****事件委托控制各个区域层级操作***/			
	//树形菜单事件
	$("#tree-menu").click(function(ev){
		var target = $(ev.target);
		var eleId = null;
		if(target.hasClass('tree-node')){
			eleId = target.attr('data-ele-id');
		}else{
			eleId = target.parents('.tree-node').attr('data-ele-id');
		}
		if(!eleId)return;
		renderPage(eleId);
	});
	//路径条事件
	$(".path-nav").click(function(ev){
		var target = $(ev.target);
		if(target.attr('data-ele-id')){
			var eleId = target.attr('data-ele-id');
			renderPage(eleId);
		}
	});
	//文件区域事件
	fileAreaEntrust();
	//右键菜单
	$('.file-list').contextmenu(function(ev){
		$('.file-list .ele-wrap').removeClass('ele-checked').find('.checkbox').removeClass('checkbox-checked');
		var parent = $(ev.target).parents('.ele-wrap');
		parent.addClass('ele-checked').find('.checkbox').addClass('checkbox-checked');
		$('#right-menu').show().css({
			left:ev.pageX,
			top:ev.pageY
		});
		//阻止默认行为
		ev.preventDefault();
	});
	
	$('#right-menu a').click(function(){
		$('#right-menu').hide();
	});
	
	$(document).bind('click',function(){
		$('#right-menu').hide();
		$('#about-project').animate({
			top: 80,
			right: -500
		},1000);
	});
	
	//文件区域事件委托封装成函数
	//改为ele-cont是为了所有版块的文件区域都能使用
	function fileAreaEntrust(){
		$(".ele-cont").click(function(ev){
			var parent = $(ev.target).parents('.ele-wrap');
			if( parent.hasClass('ele-wrap') ){
				var eleId =  parent.find('.ele').attr('data-ele-id');
				var eleData = methods.getSelf(fileDatas,eleId);
				//找到是文件夹类型的文件
				if( parent.find('.filetype').hasClass('folder') ){
					renderPage(eleId);
				}
				//找到图片类型的文件
				if( parent.find('.filetype').hasClass('image') ){
					var imgSrc = eleData.src;
					$('#photo-bg').show();
					$('#photo-bg img').attr("src",imgSrc).css({
						width:300
					});
					//给关闭按钮绑定事件
					$('#photo-bg .close').click(function(){
						$('#photo-bg').hide();
					});
					//给放大按钮绑定事件
					$('#photo-bg a').eq(0).click(function(){
						$('#photo-bg img').css({
							width : $('#photo-bg img').width()+20
						});
					});
					//给缩小按钮绑定事件
					$('#photo-bg a').eq(1).click(function(){
						$('#photo-bg img').css({
							width : $('#photo-bg img').width()-20
						});
					});
					//把数据渲染到最近中
					recentData.push(eleData);
				}
				//找到音乐文件
				if( parent.find('.filetype').hasClass('audio') ){
					//把点击的数据存入最近的数组中
					recentData.push(eleData);
					var audioSrc = eleData.src;
					$('#song-bg').show();
					$('#song-bg #loading').show();
					if(eleData.upAudio){
						//创建音频节点。	
						var source = context.createBufferSource();
						drawUpPic(audioSrc,source,context);
						//给关闭按钮绑定事件
						$('#song-bg .close').click(function(){
							$('#song-bg').hide();
							source.stop(0);
						});
					}else{
						var audio = new Audio(audioSrc);
						drawPic(audio,context);
						//给关闭按钮绑定事件
						$('#song-bg .close').click(function(){
							$('#song-bg').hide();
							audio.pause();
						});
					}
					//把数据渲染到最近中
					recentData.push(eleData);
				}
				//找到视频文件
				if( parent.find('.filetype').hasClass('video') ){
					//把点击的数据存入最近的数组中
					recentData.push(eleData);
					var videoSrc = eleData.src;
					$('#vid').attr('src',videoSrc);
					$('#vid')[0].addEventListener('canplay',function(){
						$('#video-bg #loading').hide();
					});	
					$('#video-bg').show();
					$('#video-bg #loading').show();
					//给关闭按钮绑定事件
					$('#video-bg .close').click(function(){
						$('#video-bg').hide();
						$('#vid')[0].pause();
					});
					//把数据渲染到最近中
					recentData.push(eleData);
				}
			}
		});
	}
	
	//点击全选按钮
	$('.check-all').click(function(ev){
		ev.stopPropagation();
		var self = $(this);
		self.toggleClass('is-check-all');	
		if( self.hasClass('is-check-all') ) {
			$('.ele-wrap').addClass('ele-checked');
			$('.checkbox').addClass('checkbox-checked');		
		}else{
			$('.ele-wrap').removeClass('ele-checked');
			$('.checkbox').removeClass('checkbox-checked');
		}
	});
	
	/*****每次改变要渲染的东西*****/
	function renderPage(eleId){
		//渲染数据
		renderData(eleId);
		
		//有无子级
		isHaveFile(eleId);
		
		//清除checkAll
		$('.check-all').removeClass('is-check-all');
		//记录当前操作的id
		$('#getPid').val(eleId);
		
		//给file-list中文件绑定事件
		$.each($('.file-list .ele-wrap'),function(index, item){
			renderEvent(item);
		});
		
		//点击树型区域的小三角,展开或者关闭
		$('#tree-menu i').click(function(ev){
		    var parent = $(this).parents('.tree-node');
			//控制小三角切换,及展开闭合
		    parent.toggleClass('tree-off').next().toggle();
		    ev.stopPropagation();//阻止冒泡
		});
	}
	
	//根据id渲染它的子元素
	function renderData(eleId){
		//树形菜单
		$("#tree-menu").html(  renderTreeMenu(fileDatas,-1) );
		//控制高亮和展开
		$('.tree-current').removeClass('tree-current');
		$('h4[data-ele-id='+eleId+']').parents('ul').show().prev().addClass('tree-off');
		$('h4[data-ele-id='+eleId+']').addClass('tree-current tree-off').next().show();
		//导航条
		$(".path-nav").html( renderPathNav(fileDatas,eleId) );
		//文件区域
		$(".file-list").html( renderFileArea(fileDatas,eleId) );
	}
	
	//判断子级是否有
	function isHaveFile(eleId){
	    var len = methods.getChilds(fileDatas,eleId).length;
	    //文件区域
	   	if(len>0){   
			$('.file-empty').hide();
		}else{
			$('.file-empty').show();
			$('.file-list').html('');
		}
	}
	
	//判断树形菜单区域是否有小三角
	function isHaveTriangle(eleId){
		var h4 = $('h4[data-ele-id='+eleId+']');
		var ul = h4.next();
		var len = ul.children().length;
		if(len==0){
			h4.find('i').remove();
		}	
	}
	
	/*******给一个文件绑定事件...移入移出和是否选中*******/
	function renderEvent(item){
		var item = $(item);
		var checkbox = item.find('.checkbox');
		//移入
		item.mouseover(function(){
			$(this).addClass('ele-checked');
		});
		//移出
		item.mouseout(function(){
			if( !checkbox.hasClass('checkbox-checked') ){
				$(this).removeClass('ele-checked');
			}
		});
		//其中的checkbox
		checkbox.click(function(ev){
			checkboxEvent($( this ));
			ev.stopPropagation();//阻止冒泡
		});
	}
	
	//每个文件中的checkbox的点击事件
	function checkboxEvent(check){
		check.toggleClass('checkbox-checked');
		if(check.hasClass('checkbox-checked')){
			isTriggerAll();
		}else{
			//只要当前这个没有被勾选,全选就不会选中
			$('.check-all').removeClass('is-check-all');
		}
	}
	//判断是否触发全选
	function isTriggerAll(){
		if( checkNum() == $('.checkbox').length ){
			$('.check-all').addClass('is-check-all');
		}
	}
	
	//找到选中的数量
	function checkNum(){
		var arr = [];
		//如果是选中状态就放入数组
		$('.file-list .checkbox').each(function(index,item){
			//找到有checkbox-checked的
			if($(item).hasClass('checkbox-checked')){
				arr.push($('.file-list .ele')[index]);	
			}
		})
		return arr.length;
	}
	


	/*阻止右键的默认行为*/
	$(document).contextmenu(function(ev){
		//阻止默认行为
		ev.preventDefault();
	});
	
	/********新建*********/	
	var _create = $('.create');
	_create.mouseup(function(){
		//隐藏右键菜单
		$('#right-menu').hide();
		$('.check-all').removeClass('is-check-all');
		//添加一个状态，表示正在创建文件
		if( _create.attr('onOff') == "true" )return;
		_create.attr('onOff','true'); 
		//隐藏没有文件提示
		$('.file-empty').hide();
		var newEle = createEle({
			name : "",
			id : new Date().getTime(),
			type : 'folder'
		});
		$(".file-list").prepend(newEle);
		var _input = $(newEle).find('input');
		var _span = $(newEle).find('span');
		_span.hide();
		_input.show().select();
		
	});
	
	//给document绑定一个mousedown，实现创建文件夹
	$(document).mousedown(function(){
		//如果为true，说明正在创建文件
		if(_create.attr('onOff')==='true'){
			var newEle = $(".file-list").find('.ele-wrap').eq(0);
			var _input = newEle .find('input');
			var _span =  newEle .find('span');
			var value = _input.val().trim();
			
			//判断一下新建的ele-wrap中的input有没有内容,如果有就创建,没有就删除
			if( value === "" ){
				newEle.remove();
				//如果filelist没有内容,就让empty显示
				if($(".file-list").html() === ""){
					$('.file-empty').show();
				}
			}else{
				//判断是否重命名,如果重名,提示重新创建
				if(methods.isSameName(value,'folder',fileDatas)){
					tipsShow('sameName','命名重复请重新创建');
					//同时删除命名重复的这个
					newEle.remove();
					//如果filelist没有内容,就让empty显示
					if($(".file-list").html() === ""){
						$('.file-empty').show();
					}
				}else{
					//显示span、隐藏input、内容给span
					_input.hide();
					_span.show();
					_span.html(_input.val());
					
					//给新创建的文件添加事件处理
					renderEvent(newEle);
					
					//给树型菜单追加对应项.这里需要需要name/pid/当前这个元素的id就是ele的data-ele-id
					var eleId = newEle.find('.ele').attr('data-ele-id');
					//通过隐藏域拿到pid
					var pid = $('#getPid').val();
					//把新创建的元素的数据,存入filedatas
					var newData = {
						id : eleId,
						pid : pid,
						name : value,
						type : "folder"
					};
					//把新增的放入数据中
					fileDatas.unshift(newData);
					
					//通过pid，找到属性树形菜单中的div元素
					var element = $('#tree-menu').find('[data-ele-id="'+pid+'"]');
					//获得div的兄弟节点ul
					var ul = element.next();
					
					//ul添加一个li元素就可以
					var rank = methods.getParents(fileDatas,eleId).length;
					ul.append(
						createTreeLi({
							name : value,
							id : eleId,
							rank : rank
						})
					);
					//如果ul不是空,就找到他相邻的h4,给没有i的添加i及点击事件
					if( ul.html() !== "" ){
						if(ul.prev().find('div i').length == 0){
							ul.prev().find('div').prepend('<i class="icon"></i>').find('i').click(function(ev){
							    ev.stopPropagation();//阻止冒泡
							    var _parent = $(this).parents('.tree-node');
							    //让点击小三角的父级h4相邻的ul展开或者关闭
							    _parent.next().toggle().end().toggleClass('tree-off');
							   	   	
							});		
						}
						ul.prev().addClass('tree-on');
						ul.prev().removeClass('tree-none');
					}	
					//创建成功提醒
					tipsShow('newCreate','新建文件夹成功');	
				}
			}
			//无论是否创建,把状态改为false
			_create.attr('onOff','false');	
		}	
	});
	
	//封装小提醒
	var _TipBox = $('.tips-box');
	function tipsShow(className,text){
		_TipBox.removeClass('sameName newCreate errorName');
		_TipBox.addClass(className);
		_TipBox.find('span').html(text);
		//每次调用的时候，都要从-34px开始向0的位置运动
		_TipBox.animate({
			top:0
		},600,'linear',function(){
			setTimeout(function(){
				_TipBox.animate({
					top:-34
				},600,'linear')
				
			},600)
		})
	}
	
	
	/*******框选******/		
	var disx = 0;
	var disy = 0;
	var _frameBox = $('#frame-box');
	$(document).mousedown(function(ev){
		//记录开始位置
		disx = ev.pageX;
		disy = ev.pageY;
		//记录初始位置
		_frameBox.css({
			left : disx,
			top : disy
		});
		$(this).mousemove(moveFn);
		$(this).mouseup(upFn);
		ev.stopPropagation();
		ev.preventDefault();
	});
	//鼠标移动中的函数
	function moveFn(ev){
		//差值是宽、高、
		var w = ev.pageX - disx;
		var h = ev.pageY - disy;
		if( Math.abs(w) < 10 && Math.abs(h) < 10 )return;
		//向前滑动时差值为负值，所以需要取反，left值是鼠标移动的值
		if(w<0){
			width=-w;
			_frameBox.css('left',ev.pageX);
		}else{
			width=w;
			_frameBox.css('left',disx);
		}
		//向后滑动时差值为负值，所以需要取反，top值是鼠标移动的值
		if(h<0){
			height=-h;
			_frameBox.css('top',ev.pageY);
		}else{
			height=h;
			_frameBox.css('top',disy);
		}
		_frameBox.css({
			width : width,
			height : height,
		}).show();
		
		
		//拖拽的div，如果碰上的话就给碰上的文件添加样式，没碰上取消掉样式
		//改为.ele-cont对所有版块的文件区域都起作用
		$('.ele-cont .ele-wrap').each(function(index,item){
			_item = $(item);
			if( methods.collisionTest(_frameBox[0],item) )	{
				_item.addClass('ele-checked');
				_item.find('.checkbox').addClass('checkbox-checked');
			}else{
				_item.removeClass('ele-checked');
				_item.find('.checkbox').removeClass('checkbox-checked');
			}
			
		})
		isTriggerAll();
	}
	//鼠标抬起时触发的函数
	function upFn(){
		/*鼠标抬起时,注销move和up事件*/
		$(this).off('mousemove',moveFn);
		$(this).off('mouseup',upFn);
		/*鼠标抬起时,把值还原*/
		_frameBox.css({
			width : 0,
			height : 0
		}).hide();
	}
	
	
	/*********删除功能********/
	$('.delete').click(function(ev){
		//隐藏右键菜单
		$('#right-menu').hide();
		//阻止冒泡
		ev.stopPropagation();
		var eleId = $('#getPid').val();
		var checks = $('.file-list .checkbox-checked');
		var len = checks.length;
		if(len == 0){
			tipsShow('errorName','请选择文件!');
			return;
		}
		for(var i=0;i<len;i++){
			var nowId =checks.eq(i).parents('.ele').attr('data-ele-id');
			//删除文件区域
			$('div[data-ele-id='+nowId+']').parent().remove();
			//删除树形菜单对应项
			$('h4[data-ele-id='+nowId+']').parent().remove();
			
			//从数据中删除数据
			methods.handleData(fileDatas,deleteData,nowId);
			//从数据中删除子数据
			methods.handleChildData(fileDatas,childDatas,nowId);
		}

		$('.check-all').removeClass('is-check-all');
		isHaveFile(eleId);
		isHaveTriangle(eleId);
	});
	
	
	/*******点击重名命按钮*******/
    var _rename = $('.rename'); 
	$('.rename').click(function(ev){
		ev.stopPropagation();//阻止冒泡
		var check = $('.file-list .checkbox-checked');
		var len = check.length;
		if(len==0){
			tipsShow('errorName','请选择文件!');
			return;
		}
		if(len>1){
			tipsShow('errorName','请输选择一个文件');
			return;
		}
		if(len==1){
			//找到他的父级
			var parent =check.parents('.ele');
			var nowId = parent.attr('data-ele-id');
			var type = methods.getSelf(fileDatas,nowId).type;
			var input = parent.find('input');
			var span = parent.find('span');
			var oldName = span.html();
			input.show().val(oldName).select();
			span.hide();
			//给document绑定一个mousedown，实现创建文件夹
			$(document).mousedown(function fn(){
				var newName = input.val().trim();
				oldName = span.html();
				//判断是否重命名,如果重名,提示重新创建
				if( newName == oldName || newName === ""){
					input.hide();
					span.show();
					return;
				}
				//判断是否重命名
				if(methods.isSameName(newName,type,fileDatas)){
					tipsShow('sameName','命名重复请重新修改');
					input.hide();
					input.val(oldName);
					span.show();
					return;
				}else{
					tipsShow('newCreate','更名成功');
					var value = input.val();
					input.hide();
					span.show();
					span.html(value);
					check.removeClass('checkbox-checked');
					parent.removeClass('ele-checked');
					//跟新数据
					methods.getSelf(fileDatas,nowId).name = value;
				}
			});		
		}
	});
	
	
	/*****刷新页面*****/
	//页面加载时绑定按钮点击事件
	$('.reload').click(function(){
		var text = $('.file-list').html();
		var eleId = $('#getPid').val();
		$('.file-list').html('');
		setTimeout(function(){
			$('.file-list').html( text );
			renderPage(eleId);
	
		},300);
	
	});

	//是否显示空提醒
	function iSShowEmpty( mainlist ){
		var cont =  mainlist.find('.ele-cont');
		var len = cont.children().length;
		var empty =  mainlist.find('.empty-box');
		if( len == 0 ){
			empty.show();
		}else{
			empty.hide();
		}
	}
	
	/******最近版块******/
	$('#nav-box .recent').click(function(){
		$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
		$('.main-list').hide();
		$('#recent').show();
	
		//找到最近操作的数据
		var arr = methods.arrayToWeight( recentData );
		//渲染页面
		$('#recent .ele-cont').html( renderOtherHtml(arr) );
		iSShowEmpty( $('#recent') );
	});
	//清空数据
	$('.recent-nav a').eq(0).click(function(){
		$('#recent .ele-cont').html('');
		iSShowEmpty( $('#recent') );
		recentData=[];
	});
	$('.recent-nav a').eq(1).click(function(){
		var str = $('#recent .ele-cont').html();
		$('#recent .ele-cont').html('');
		setTimeout(function(){
			$('#recent .ele-cont').html( str );
		},300);
	});
	
	
	/*******文档版块******/
	$('#nav-box .doc').click(function(){
		//找到文档类型的数据
		var docData = methods.getTxtData(fileDatas);
		//渲染页面数据
		$('#doc .ele-cont').html( renderOtherHtml(docData) );
		iSShowEmpty( $('#doc') );
	
		//给文档中文件绑定事件
		$.each($('#doc .ele-wrap'),function(index,item){
			renderEvent(item);
		});
		$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
		$('.main-list').hide();
		$('#doc').show();
	});
	
	//删除选中的
	$('.doc-nav a').eq(0).click(function(){
		var checks = $('.doc-cont .checkbox-checked');
		var len = checks.length;
		if(len == 0)return;
		for(var i=0;i<len;i++){
			var nowId =checks.eq(i).parents('.ele').attr('data-ele-id');
			//删除文件区域
			$('div[data-ele-id='+nowId+']').parent().remove();
			//从数据中删除数据
			methods.handleData(fileDatas,deleteData,nowId);

		}
		iSShowEmpty( $('#doc') );
	});
	//刷新页面
	$('.doc-nav a').eq(1).click(function(){
		var str = $('#doc .ele-cont').html();
		$('#doc .ele-cont').html('');
		setTimeout(function(){
			$('#doc .ele-cont').html( str );
			//给文档中文件绑定事件
			$.each($('#doc .ele-wrap'),function(index,item){
				renderEvent(item);
			});
			iSShowEmpty( $('#doc') );
		},300);
	});
	
	
	/******图片版块******/
	$('#nav-box .pic').click(function(){
		//找到文档类型的数据
		var picData = methods.getPicData(fileDatas);
	
		//渲染页面数据
		$('#pic .ele-cont').html( renderOtherHtml(picData) );
		iSShowEmpty( $('#pic') );
	
		//给文档中文件绑定事件
		$.each($('#pic .ele-wrap'),function(index,item){
			renderEvent(item);
		});
		$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
		$('.main-list').hide();
		$('#pic').show();
	});
	
	//删除选中的
	$('.pic-nav a').eq(0).click(function(){
		var checks = $('.pic-cont .checkbox-checked');
		var len = checks.length;
		if(len == 0)return;
		for(var i=0;i<len;i++){
			var nowId =checks.eq(i).parents('.ele').attr('data-ele-id');
			//删除文件区域
			$('div[data-ele-id='+nowId+']').parent().remove();
			//从数据中删除数据
			methods.handleData(fileDatas,deleteData,nowId);
		}
		iSShowEmpty( $('#pic') );
	});
	//刷新页面
	$('.pic-nav a').eq(1).click(function(){
		var str = $('#pic .ele-cont').html();
		$('#pic .ele-cont').html('');
		setTimeout(function(){
			$('#pic .ele-cont').html( str );
			//给文档中文件绑定事件
			$.each($('#pic .ele-wrap'),function(index,item){
				renderEvent(item);
			});
			iSShowEmpty( $('#pic') );
		},300);
	});
	
	/******音乐版块******/
	$('#nav-box .audio').click(function(){
		//找到文档类型的数据
		var audioData = methods.getAudioData(fileDatas);
	
		//渲染页面数据
		$('#audio .ele-cont').html( renderOtherHtml(audioData) );
		iSShowEmpty( $('#audio') );
	
		//给文档中文件绑定事件
		$.each($('#audio .ele-wrap'),function(index,item){
			renderEvent(item);
		});
		$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
		$('.main-list').hide();
		$('#audio').show();
	});
	
	//删除选中的
	$('.audio-nav a').eq(0).click(function(){
		var checks = $('.audio-cont .checkbox-checked');
		var len = checks.length;
		if(len == 0)return;
		for(var i=0;i<len;i++){
			var nowId =checks.eq(i).parents('.ele').attr('data-ele-id');
			//删除文件区域
			$('div[data-ele-id='+nowId+']').parent().remove();
			//从数据中删除数据
			methods.handleData(fileDatas,deleteData,nowId);
		}
		iSShowEmpty( $('#audio') );
	});
	//刷新页面
	$('.audio-nav a').eq(1).click(function(){
		var str = $('#audio .ele-cont').html();
		$('#audio .ele-cont').html('');
		setTimeout(function(){
			$('#audio .ele-cont').html( str );
			//给文档中文件绑定事件
			$.each($('#audio .ele-wrap'),function(index,item){
				renderEvent(item);
			});
			iSShowEmpty( $('#audio') );
		},300);
	});
	
	
	/*****视频版块*****/
	$('#nav-box .video').click(function(){
		//找到文档类型的数据
		var videoData = methods.getVideoData(fileDatas);
	
		//渲染页面数据
		$('#video .ele-cont').html( renderOtherHtml(videoData) );
		iSShowEmpty( $('#video') );
	
		//给文档中文件绑定事件
		$.each($('#video .ele-wrap'),function(index,item){
			renderEvent(item);
		});
		$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
		$('.main-list').hide();
		$('#video').show();
	});
	
	//删除选中的
	$('.video-nav a').eq(0).click(function(){
		var checks = $('.video-cont .checkbox-checked');
		var len = checks.length;
		if(len == 0)return;
		for(var i=0;i<len;i++){
			var nowId =checks.eq(i).parents('.ele').attr('data-ele-id');
			//删除文件区域
			$('div[data-ele-id='+nowId+']').parent().remove();
			//从数据中删除数据
			methods.handleData(fileDatas,deleteData,nowId);
		}
		iSShowEmpty( $('#video') );
	});
	//刷新页面
	$('.video-nav a').eq(1).click(function(){
		var str = $('#video .ele-cont').html();
		$('#video .ele-cont').html('');
		setTimeout(function(){
			$('#video .ele-cont').html( str );
			//给文档中文件绑定事件
			$.each($('#video .ele-wrap'),function(index,item){
				renderEvent(item);
			});
			iSShowEmpty( $('#video') );
		},300);
	});
	
	/*****笔记版块******/
	
	$('#nav-box .note').click(function(){
		iSShowEmpty( $('#note') );
		$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
		$('.main-list').hide();
		$('#note').show();
	});
	
	/*******剪切版块*******/
	
	$('#nav-box .clip').click(function(){
		iSShowEmpty( $('#clip') );
		$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
		$('.main-list').hide();
		$('#clip').show();
	});
	
	/*******分享版块*****/
	
	$('#nav-box .share').click(function(){
		iSShowEmpty( $('#share') );
		$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
		$('.main-list').hide();
		$('#share').show();
	});
	
	/*****回收站版块******/
	$('#nav-box .recycle').click(function(){
		//渲染页面数据
		$('#recycle .ele-cont').html( renderOtherHtml(deleteData) );
		iSShowEmpty( $('#recycle') );
	
		//给文档中文件绑定事件
		$.each($('#recycle .ele-wrap'),function(index,item){
			renderEvent(item);
		});
		$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
		$('.main-list').hide();
		$('#recycle').show();
	});
	
	//还原已删除的文件
	$('.recycle-nav a').eq(0).click(function(){
		var checks = $('.recycle-cont .checkbox-checked');
		var len = checks.length;
		if(len == 0)return;
		for(var i=0;i<len;i++){
			var nowId =checks.eq(i).parents('.ele').attr('data-ele-id');
			//删除文件区域
			$('div[data-ele-id='+nowId+']').parent().remove();
			//把数据还原
			methods.handleData(deleteData,fileDatas,nowId);
			//还原他的子数据
			methods.handleChildData(childDatas,fileDatas,nowId);
		}
		iSShowEmpty( $('#recycle') );
	});
	
	//清空所有
	$('.recycle-nav a').eq(1).click(function(){
		$('#recycle .ele-cont').html('');
		//清空存放删除数据的数组
		deleteData = [];
		iSShowEmpty( $('#recycle') );
	});
	//刷新页面
	$('.recycle-nav a').eq(2).click(function(){
		var str = $('#recycle .ele-cont').html();
		$('#recycle .ele-cont').html('');
		setTimeout(function(){
			$('#recycle .ele-cont').html( str );
			//给文档中文件绑定事件
			$.each($('#recycle .ele-wrap'),function(index,item){
				renderEvent(item);
			});
			iSShowEmpty( $('#recycle') );
		},300);
	});
	
	/******上传功能********/
	$('#upload-file').change(function(){
		var newEle = null;
		var file = this.files[0];
		//文件大小是否超出50M
		if(file.size > 52428800){
			alert('你要上传的文件超出了限制');
			return;
		}
		if(! /image|text|video|audio/.test(file.type) ){
			alert("上传的文件格式暂不支持")
			return;
		}
		//新建一个FileReader接口
		var fr = new FileReader();
		//检验是否为图像或者视频文件  .
		if(/image|video/.test(file.type)){
			//成功读取文件
			fr.onload = function(){
				//隐藏没有文件提示
				$('.file-empty').hide();
				newEle = createEle({
					name :  file.name.split('.')[0],
					id : new Date().getTime(),
					src : this.result,
					type : file.type.split('/')[0]
				});
				$(".file-list").append(newEle);
				//显示目录页
				$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
				$('.main-list').hide();
				$("#main").show();
				var ele = $(".file-list").find('.ele-wrap').last();
				//给新创建的文件添加事件处理
				renderEvent(ele);
				//给树型菜单追加对应项.这里需要需要name/pid/当前这个元素的id就是ele的data-ele-id
				var eleId =  ele.find('.ele').attr('data-ele-id');
				//通过隐藏域拿到pid
				var pid = $('#getPid').val();
				//把新创建的元素的数据,存入filedatas
				var newData = {
					id : eleId,
					pid : pid,
					name :  file.name.split('.')[0],
					src : this.result,
					type : file.type.split('/')[0]
				};
				//把新增的放入数据中
				fileDatas.push(newData);
				//把上传的数据放入最近中
				recentData.push(newData);
			}
			//将文件以Data URL形式读入页面
			fr.readAsDataURL(file);
		}
		//检验是否为文档文件
		if(/text/.test(file.type)){
			fr.onload = function(){
				//隐藏没有文件提示
				$('.file-empty').hide();
				newEle = createEle({
					name : file.name.split('.')[0],
					id : new Date().getTime(),
					src : this.result,
					type : file.type.split('/')[1]
				});
	
				$(".file-list").append(newEle);	
				//显示目录页
				$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
				$('.main-list').hide();
				$("#main").show();
				var ele = $(".file-list").find('.ele-wrap').last();
				//给新创建的文件添加事件处理
				renderEvent(ele);	
				//给树型菜单追加对应项.这里需要需要name/pid/当前这个元素的id就是ele的data-ele-id
				var eleId =  ele.find('.ele').attr('data-ele-id');
				//通过隐藏域拿到pid
				var pid = $('#getPid').val();
				//把新创建的元素的数据,存入filedatas
				var newData = {
					id : eleId,
					pid : pid,
					name : file.name.split('.')[0],
					src : this.result,
					type : file.type.split('/')[1]
				};
				//把新增的放入数据中
				fileDatas.push(newData);
				//把上传的数据放入最近中
				recentData.push(newData);
			};
			//将文件以文本形式读入页面  
			fr.readAsText(file,'utf-8');
		}
		
		//检验上传的是音乐文件
		if(/audio/.test(file.type)){
			fr.onload = function(ev){
				var result = ev.target.result;
				//隐藏没有文件提示
				$('.file-empty').hide();
				newEle = createEle({
					name : file.name.split('.')[0],
					id : new Date().getTime(),
					src : result,
					type : file.type.split('/')[0]
				});	
				$(".file-list").append(newEle);	
				//显示目录页
				$(this).parent().addClass('nav-actvie').siblings().removeClass('nav-actvie');
				$('.main-list').hide();
				$("#main").show();
				var ele = $(".file-list").find('.ele-wrap').last();
				//给新创建的文件添加事件处理
				renderEvent(ele);	
				//给树型菜单追加对应项.这里需要需要name/pid/当前这个元素的id就是ele的data-ele-id
				var eleId =  ele.find('.ele').attr('data-ele-id');
				//通过隐藏域拿到pid
				var pid = $('#getPid').val();
				//把新创建的元素的数据,存入filedatas
				var newData = {
					id : eleId,
					pid : pid,
					name : file.name.split('.')[0],
					src : this.result,
					type : file.type.split('/')[0],
					upAudio : true
				};
				//把新增的放入数据中
				fileDatas.push(newData);
				//把上传的数据放入最近中
				recentData.push(newData);
			};
			//解析为二进制的数组。
			fr.readAsArrayBuffer(file);
		}
		
	});

}())
