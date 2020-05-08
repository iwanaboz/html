
var canvas2d_ = document.getElementById('canvas2d');
var cW = canvas2d_.offsetWidth;
var cH = canvas2d_.offsetHeight;
let r_control = Math.sqrt((cW*0.1)**2 + (cH*0.1)**2);

// マウスが動いたとき
//
canvas2d_.addEventListener('mousemove', e => {
	//描画画面中心からの差をマウスの x, y とする
    mousex = e.clientX - canvas2d_.offsetWidth/2 - canvas2d_.offsetLeft;
    mousey = e.clientY - canvas2d_.offsetHeight/2 - canvas2d_.offsetTop;
});
// マウスが押されたとき
canvas2d_.addEventListener('mousedown', e => {
  	mouseDrag = 1;
  	//console.log( mousex +','+mousey );
});
// マウスが離されたとき
canvas2d_.addEventListener('mouseup', e => {
  	mouseDrag = 0;
});



// タッチされたとき
canvas2d_.addEventListener("touchmove", function(e) {
    // スクロール無効化                                     
    e.preventDefault();
    // max 3 touches
	let touch_Num = Math.min(e.touches.length, 3);
	touchInfo =[];
	mouseDrag = 0;
	for (let i = 0; i <touch_Num; i++) {
	    touchInfo[i] = e.touches[i];   
		
	    //
	    if(touchControl ==1 && touchControlId == touchInfo[i].identifier ) {
	    	let tx_control = touchInfo[i].pageX - cW*0.2 ;
		    let ty_control = touchInfo[i].pageY - cH*0.8 -canvas2d_.offsetTop;
		    let tr_control = Math.sqrt(tx_control**2 + ty_control**2);
		    key_on[65]=0;
			key_on[68]=0;
			key_on[83]=0;
			key_on[87]=0;
	    	if(tr_control>r_control*0.3){
	    		if(Math.abs(tx_control) > Math.abs(ty_control)){
	    			if( tx_control>0) {key_on[68]=1;}else{key_on[65]=1;}
	    		}else{
	    			if( ty_control>0) {key_on[83]=1;}else{key_on[87]=1;}
	    		}
	    	}
	    }else{
	    	mouseDrag = 1;
			mousex = touchInfo[i].pageX - cW/2 - canvas2d_.offsetLeft;
			mousey = touchInfo[i].pageY - cH/2 - canvas2d_.offsetTop;
	    }
	}
	
});

// タッチされたとき
canvas2d_.addEventListener("touchstart", function(e) {
    e.preventDefault();     // 
	// max 3 touches
	let touch_Num = Math.min(e.touches.length, 3);
	touchInfo =[];
	for (let i = 0; i <touch_Num; i++) {
	    touchInfo[i] = e.touches[i];   
	    let tx_control = touchInfo[i].pageX - cW*0.2 ;
	    let ty_control = touchInfo[i].pageY - cH*0.8 -canvas2d_.offsetTop;
	    let tr_control = Math.sqrt(tx_control**2 + ty_control**2);
	    //console.log(touchInfo);
	    //
	    if(touchControl ==0 && tr_control <= r_control ) {
	    	touchControl = 1;
	    	touchControlId = touchInfo[i].identifier;
	    }else{
	    }
	}

}, false);


// 離れたとき
canvas2d_.addEventListener("touchend", function(e) {
    e.preventDefault();     // 
	// max 3 touches
	let touch_Num = Math.min(e.touches.length, 3);
	touchInfo =[];
	//console.log(touchInfo);
	
	touchControl = 0;
	key_on[65]=0;
	key_on[68]=0;
	key_on[83]=0;
	key_on[87]=0;
	mouseDrag = 0;
	for (let i = 0; i <touch_Num; i++) {
	    touchInfo[i] = e.touches[i];   
	    
	    //
	    if(touchControl ==1 && touchControlId == touchInfo[i].identifier ) {
	    	touchControl = 1;
	    }else{
	    	mouseDrag = 1;
	    }
	}
}, false);

			