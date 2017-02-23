var $ = function(selector,context){
	var type = typeof selector,
		context = context||document;
	if(typeof context === 'string'){
		var ele = $(context);
		var eles = [];
		if(ele.length!==undefined){
			ele = Array.from(ele);
			ele.forEach(function(value){
				// [span].concat([span])
				// [span,span]
				eles = eles.concat( Array.from( $(selector,value) ) );
			})
			return [...(new Set(eles))];
		}
		return $(selector,ele);
		
	}	
	if(type === 'string'){
		var s = selector.charAt(); 
		switch(s){
			case '#'://id
				return document.getElementById(selector.substring(1))
			break;
			case '.'://class
				return context.getElementsByClassName(selector.substring(1))
			break;
			default://tagname
				return context.getElementsByTagName(selector);
		}
	}
	if(type === 'function'){//实现window.onload的封装。
		return window.onload = selector;
	}
};