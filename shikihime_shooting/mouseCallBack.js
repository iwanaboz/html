//var canvas2d_ = document.getElementById('canvas2d');




var cW = canvas2d_.offsetWidth;
var cH = canvas2d_.offsetHeight;
let r_control = cH*0.1;

// マウスが動いたとき
//
canvas2d_.addEventListener('mousemove', e => {
    //mousex = e.clientX - canvas2d_.offsetWidth/2 - canvas2d_.offsetLeft;
    //mousey = e.clientY - canvas2d_.offsetHeight/2 - canvas2d_.offsetTop;
    mousex = e.clientX - Bcontrol.centerX;
    mousey = e.clientY - Bcontrol.centerY;
});
// マウスが押されたとき
canvas2d_.addEventListener('mousedown', e => {
  	//mouseDrag = 0;

});
// マウスが離されたとき
canvas2d_.addEventListener('mouseup', e => {
  	mouseDrag = 0;
});

//------------------------------------------------------------------------------

var touchInfo=[];
var touchControl=0;
var touchControlId;				
Bcontrol = new MyButton(canvas2d_, 0, 360, 100, 100, 0 );	     //csor

BZ= new MyButton(canvas2d_, 520,400,50,50, 90 );//
BX= new MyButton(canvas2d_, 590,400,50,50, 88 );//
BC= new MyButton(canvas2d_, 660,400,50,50, 67 );//
BS= new MyButton(canvas2d_, 590,330,50,50, 83 );//
BF= new MyButton(canvas2d_, 660,330,50,50, 70 );//


// タッチでドラッグされたとき
canvas2d_.addEventListener("touchmove", function(e) {
    // スクロール無効化                                     
    e.preventDefault();
    // max 3 touches
	let touch_Num = Math.min(e.touches.length, 3);
	touchInfo =[];
	// reset drag flag
	mouseDrag = 0;
	for (let i = 0; i <touch_Num; i++) {
	    touchInfo[i] = e.touches[i];   
	    
	    // WASD
	    if(touchControl ==1 && touchControlId == touchInfo[i].identifier ) {
			mouseDrag = 1;
			mousex = touchInfo[i].pageX - Bcontrol.centerX;
    		mousey = touchInfo[i].pageY - Bcontrol.centerY;
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
	    // get position in WASD butt
	    let tx_control = touchInfo[i].pageX - Bcontrol.centerX;
	    let ty_control = touchInfo[i].pageY - Bcontrol.centerY;
	    let tr_control = Math.sqrt(tx_control**2 + ty_control**2);
	    //console.log(touchInfo);
	    // in WASD butt
	    if(touchControl ==0 && tr_control <= r_control ) {
	    	touchControl = 1;
	    	touchControlId = touchInfo[i].identifier;
	    }else{
	    	BZ.onButtonThenPush(touchInfo[i].identifier, touchInfo[i].pageX, touchInfo[i].pageY);
	    	BX.onButtonThenPush(touchInfo[i].identifier, touchInfo[i].pageX, touchInfo[i].pageY);
	    	BC.onButtonThenPush(touchInfo[i].identifier, touchInfo[i].pageX, touchInfo[i].pageY);
	    	BS.onButtonThenPush(touchInfo[i].identifier, touchInfo[i].pageX, touchInfo[i].pageY);
	    	BF.onButtonThenPush(touchInfo[i].identifier, touchInfo[i].pageX, touchInfo[i].pageY);
	    }
	}
	//if(loading ==2){
	//	ctx.clearRect(0, 0, canvas2d_.width, canvas2d_.height);
  	//	loading=0;
  	//	eventOn=1;
	//}
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
	
	// 一度全てリセット
	mouseDrag = 0;
	key_on.fill(0);
			
	for (let i = 0; i <touch_Num; i++) {
		// 離れたときに残ったものしか格納されない
	    touchInfo[i] = e.touches[i];   
	    // WASD操作時
	    if(touchControl ==1 && touchControlId == touchInfo[i].identifier ) {
	    	touchControl_exist = 1;
	    }else{
	    	// WASD以外の場合ドラッグされているとみなす
	    	mouseDrag = 1;
	    }
	}

	// reset WASD
	if(	touchControl_exist ==0 ){touchControl=0;Bcontrol.resetControl();}
	//console.log(touchControl);
	
}, false);

			