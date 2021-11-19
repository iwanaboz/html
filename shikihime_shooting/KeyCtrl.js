// w:87, a:65, s:83, d:68
//押されている:1, 押されてない:0
//すべて　0で初期化
key_on = new Array(256);
key_on.fill(0);
function keyCallBack_on(e) {

	if ( e && e.keyCode ) { keycode = e.keyCode;
	} else if ( event && event.keyCode ) { keycode = event.keyCode; }
		key_on[keycode] = 1;
	if ( keycode == 90 ){player[1].act_key=Katk1; } //z
    if ( keycode == 88 ){player[1].act_key=Katk2; } //x
    if ( keycode == 67 ){player[1].act_key=Katk3; } //c
    if ( keycode == 83 ){player[1].act_key=Kdash; } //s
    if ( keycode == 68 ){player[1].act_key=Kdfen; } //d
    if ( keycode == 70 ){player[1].act_key=Ktgt;  } //change target
	console.log( keycode  );
}

function keyCallBack_off(e) {

	if ( e && e.keyCode ) { keycode = e.keyCode;
	} else if ( event && event.keyCode ) { keycode = event.keyCode; }
		key_on[keycode] = 0;

	//キーを離しているとき
	if(key_on[90]+key_on[88]+key_on[67]+key_on[83]+key_on[68] <=0){player[1].act_key=0;}
		
}


//-----------------------------------------------------------

//キーボード
document.onkeydown = keyCallBack_on; // 
document.onkeyup = keyCallBack_off; //   
