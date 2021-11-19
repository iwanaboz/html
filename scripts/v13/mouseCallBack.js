var canvas2d_ = document.getElementById('canvas2d');
var cW = canvas2d_.offsetWidth;
var cH = canvas2d_.offsetHeight;
let r_control = cH*0.1;

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
  	//console.log( player );
});
// マウスが離されたとき
canvas2d_.addEventListener('mouseup', e => {
  	mouseDrag = 0;
});

//------------------------------------------------------------------------------

				
Bcontrol = new MyButton(canvas2d_, 0, cH*0.7, cH*0.2, cH*0.2, 0 );
Bspace = new MyButton(canvas2d_, cW*0.4, cH*0.75, cH*0.14, cH*0.14, 32 );
BF= new MyButton(canvas2d_, cW*0.65, cH*0.78, cH*0.09, cH*0.09, 70 );
BG= new MyButton(canvas2d_, cW*0.85, cH*0.78, cH*0.09, cH*0.09, 71 );


// タッチでドラッグされたとき
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
	    	Bcontrol.resetControl();
	    	let tx_control = touchInfo[i].pageX - Bcontrol.centerX;
		    let ty_control = touchInfo[i].pageY - Bcontrol.centerY;
		    let tr_control = Math.sqrt(tx_control**2 + ty_control**2);
	    	if(tr_control>r_control*0.2){
	    		if(Math.abs(tx_control) > Math.abs(ty_control)){
	    			if( tx_control>0) {key_on[68]=1;}else{key_on[65]=1;}
	    		}else{
	    			if( ty_control>0) {key_on[83]=1;}else{key_on[87]=1;}
	    		}
	    	}
	    }else if(touchInfo[i].pageY-canvas2d_.offsetTop < cH*0.75){
	    	mouseDrag = 1;
			mousex = touchInfo[i].pageX - cW/2 - canvas2d_.offsetLeft;
			mousey = touchInfo[i].pageY - cH/2 - canvas2d_.offsetTop;
	    }
	}
	
});

// (新たに)タッチされたとき
canvas2d_.addEventListener("touchstart", function(e) {
    e.preventDefault();     // 
	// max 3 touches
	let touch_Num = Math.min(e.touches.length, 3);
	touchInfo =[];
	for (let i = 0; i <touch_Num; i++) {
	    touchInfo[i] = e.touches[i];   
	    let tx_control = touchInfo[i].pageX - Bcontrol.centerX;
	    let ty_control = touchInfo[i].pageY - Bcontrol.centerY;
	    let tr_control = Math.sqrt(tx_control**2 + ty_control**2);
	    //console.log(touchInfo);
	    //
	    if(touchControl ==0 && tr_control <= r_control ) {
	    	touchControl = 1;
	    	touchControlId = touchInfo[i].identifier;
	    }else{
	    	Bspace.onButtonThenPush(touchInfo[i].identifier, touchInfo[i].pageX, touchInfo[i].pageY);
	    	BF.onButtonThenPush(touchInfo[i].identifier, touchInfo[i].pageX, touchInfo[i].pageY);
	    	BG.onButtonThenPush(touchInfo[i].identifier, touchInfo[i].pageX, touchInfo[i].pageY);
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
	// 移動ドラッグ
	let touchControl_exist = 0;
	
	// 全てリセット
	mouseDrag = 0;
	key_on[Bspace.key] = 0;
	key_on[BF.key] = 0;
	key_on[BG.key] = 0;
			
	for (let i = 0; i <touch_Num; i++) {
		// 離れたときに残ったものしか格納されない
	    touchInfo[i] = e.touches[i];   
	    //
	    if(touchControl ==1 && touchControlId == touchInfo[i].identifier ) {
	    	touchControl_exist = 1;
	    }else{
	    	//基本的にmouseDragは維持
	    	mouseDrag = 1;
	   	    		
	    }
	}

	//
	if(	touchControl_exist ==0 ){touchControl=0;Bcontrol.resetControl();}
	//console.log(touchControl);
	
}, false);

			