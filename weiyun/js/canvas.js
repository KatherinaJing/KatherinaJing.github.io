function drawPic(audio,context){
	var canvas = $('#cas')[0];
	var cgx= canvas.getContext("2d");
	/*音频准备就绪*/
	audio.addEventListener('canplay',function(){
		$('#song-bg #loading').hide();
		//创建音频节点。	
		var source = context.createMediaElementSource(audio);
		//创建获取频谱能量值的analyser节点。
		var analyser = context.createAnalyser();	
		//链接频谱
		source.connect(analyser);
		//链接系统扬声器节点。
		source.connect(context.destination)
		audio.play();	
		//频谱长度 analyser.frequencyBinCount
		//解析频谱为二进制数组。new Uint8Array()
		var array = new Uint8Array(analyser.frequencyBinCount);
		var len = 100;/*出现的条数*/
		var n = Math.floor(array.length/len);
		
		cgx.fillStyle = '#33d455';/*填充颜色*/
		
		(function(){
			//获取到音频频率值。
			analyser.getByteFrequencyData(array);
			/*清除画布*/
			cgx.clearRect(0, 0, 1024, 500);
			/*创建柱状图*/
			for(var i=0;i<len;i++){
				/*每个的宽度是10，间隔是5*/
				/*左上角x轴坐标。左上角y轴坐标。柱的宽度柱的高度 */
				cgx.fillRect(i*15, 500-array[i*n], 10, array[i*n]);
			}
			/*
			 * requestAnimationFrame() 请求动画帧
			 *根据浏览器当前帧数进行计时。
			 *requestAnimationFrame。window下的方法。
			 * 不是当前窗口，会立马停止。
			 * 根据浏览器当前帧数进行计时。(刷新的频率)
			 */
			requestAnimationFrame(arguments.callee);//arguments.callee 指向函数本身。
		})();
			
		
	});
}

//上传的音乐需要解码
function drawUpPic(eleSrc,source,context){
	var canvas = $('#cas')[0];
	var cgx= canvas.getContext("2d");
	/*decodeAudioData解码文件
		参数：1、需要解码的文件。2、回调函数，在解码成功之后调用。回调函数有一个参数，是一个二进制数组。
	*/
	//解码文件。
	context.decodeAudioData(
		eleSrc,
		function(buffer){//解码成功调用该函数。
				//buffer 以二进制数组表示的文件。
				
			$('#song-bg #loading').hide();
			//创建获取频谱能量值的analyser节点。
			var analyser = context.createAnalyser();	
			//系统扬声器的节点。
			// console.log(context.destination);
			//链接频谱
			source.connect(analyser);
			//链接系统扬声器节点。
			analyser.connect(context.destination)
			//添加播放数据。
			source.buffer = buffer;
			//开始播放
			source.start(0);
			//频谱长度analyser.frequencyBinCount
			//解析频谱为二进制数组。
			var array = new Uint8Array(analyser.frequencyBinCount);
			var len = 100;
			var n = Math.floor(array.length/len);
			cgx.fillStyle = '#33d455';
			(function(){
				//获取到音频频率值。
				analyser.getByteFrequencyData(array);
				cgx.clearRect(0, 0, 1024, 500);

				for(var i=0;i<len;i++){
					cgx.fillRect(i*15, 500-array[i*n], 10, array[i*n]);
				}
				requestAnimationFrame(arguments.callee);
			})();

		},
		function(error){//解码失败调用这个函数。
			console.log(error);
		}
	);
	
}
