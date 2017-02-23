window.onload = function(){
	var focus = document.getElementById('focus');
	var focusLis = focus.getElementsByTagName('li');
	var sec = document.getElementsByClassName('section');
	var superContainer = document.getElementById('superContainer');
	var lis = focus.getElementsByTagName('li');
	var winHeight = window.innerHeight;
	var str = '';
	var num = 0;
	var onOff = true;
	var prev = sec[0];
	for(var i=0;i<sec.length;i++){
		str += '<li></li>';
	}
	focus.innerHTML = str;
	lis[0].className = 'active';

	//设置焦点的top值
	focus.style.top = (winHeight - focus.offsetHeight)/2 + 'px';

	window.onresize = function(){
		var winHeight = window.innerHeight;
		focus.style.top = (winHeight - focus.offsetHeight)/2 + 'px';
		superContainer.style.top = -winHeight*num + 'px';
	};
	//焦点li添加事件 
	for(var i=0;i<focusLis.length;i++){
		focusLis[i].index = i;
		focusLis[i].onclick = function(){
			var winHeight = window.innerHeight;
			for(var i=0;i<focusLis.length;i++){
				focusLis[i].className = '';
			}
			this.className = 'active';
			mTween(superContainer,'top',-winHeight*this.index,400,'linear');
			sec[this.index].className = `section section${this.index+1} active`;
			//prev.className
			prev.className = prev.className.split('active').join('');
			num = this.index;
			prev = sec[this.index];
			
		};
	}

	/*  鼠标滚动事件  */
	mScroll(document,function(){
		if( !onOff ) return;
		onOff = false;
		num--;
		if( num < 0 ){
			num = 0;
			onOff = true;
			return;
		}
		//获取可视区
		var winHeight = window.innerHeight;
		//superContainer.style.top = -window.innerHeight*num + 'px';
		setTimeout(function(){
			mTween(superContainer,'top',-winHeight*num,400,'linear',function(){
				setTimeout(function(){
					onOff = true;
				},1000);
			});
		},300);
		for(var i=0;i<lis.length;i++){
			lis[i].className = '';
		}
		lis[num].className = 'active';
		sec[num+1].className = 'section section'+(num+2);
		sec[num].className = 'section section'+(num+1)+' active';
		prev = sec[num];
		console.log('向上滚动');
	},function(){
		if( !onOff ) return;
		onOff = false;
		num++;
		if( num > lis.length-1 ){
			num = lis.length -1;
			onOff = true;
			return;
		}
		var winHeight = window.innerHeight;
		//superContainer.style.top = -window.innerHeight*num + 'px';
		setTimeout(function(){
			mTween(superContainer,'top',-winHeight*num,400,'linear',function(){
				setTimeout(function(){
					onOff = true;
				},1000);
			});
		},300);
		
		for(var i=0;i<lis.length;i++){
			lis[i].className = '';
		}
		lis[num].className = 'active';
		sec[num-1].className = 'section section'+(num);
		sec[num].className = 'section section'+(num+1)+' active';
		prev = sec[num];
		console.log('向下滚动');
	});
	function mScroll(obj,upper,down){
		obj.addEventListener('DOMMouseScroll', fn, false);
		obj.onmousewheel  = fn;

		function fn(ev){
			var n;
			/*
				负数代表向下
				正数是向上
				n就是这个数字
			*/
			if(ev.detail){
				//firefox
				n = -ev.detail;
			}else{
				//ie和chrome
				n = ev.wheelDelta;
			}
			//n小于0向下滚动，否则向上。
			if(n<0){
				down();
			}else{
				upper();
			}
		}
	}

};





