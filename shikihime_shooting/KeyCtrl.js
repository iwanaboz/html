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


//おす
function keyCallBack_on_backup(e) {
    if ( e && e.keyCode ) { keycode = e.keyCode;
      } else if ( event && event.keyCode ) {
        keycode = event.keyCode; }
    // 	TxtSet("message", 2, keycode);
    if ( keycode == 38 ){player[1].dir_key=N; key_on[0]=1;}	//↑
    if ( keycode == 39 ){player[1].dir_key=E; key_on[1]=1;}	//→
    if ( keycode == 40 ){player[1].dir_key=S; key_on[2]=1;}	//←
    if ( keycode == 37 ){player[1].dir_key=W; key_on[3]=1;}	//↓
    if ( keycode == 90 ){player[1].act_key=Katk1; key_on[4]=1;} //z
    if ( keycode == 88 ){player[1].act_key=Katk2; key_on[5]=1;} //x
    if ( keycode == 67 ){player[1].act_key=Katk3; key_on[6]=1;} //c
    if ( keycode == 83 ){player[1].act_key=Kdash; key_on[7]=1;} //s
    if ( keycode == 68 ){player[1].act_key=Kdfen; key_on[8]=1;} //d
    if ( keycode == 32 ){
        if(pause<=0){pause=1;TxtSet("message", 2, "pause");
        }else{pause=0;TxtSet("message", 2, pause);timeCallBack();}
    }
    //キーを離しているとき
    if(key_on[0]+key_on[1]+key_on[2]+key_on[3] <=0){player[1].dir_key=4;}
    if(key_on[4]+key_on[5]+key_on[6]+key_on[7]+key_on[8] <=0){player[1].act_key=0;}


    event.preventDefault();
}

//はなす
function keyCallBack_off_backup(e) {
	if ( e && e.keyCode ) { keycode = e.keyCode;
	  } else if ( event && event.keyCode ) {
	    keycode = event.keyCode; }

	if ( keycode == 38){key_on[0]=0;}	
	if ( keycode == 39){key_on[1]=0;}
	if ( keycode == 40){key_on[2]=0;}
	if ( keycode == 37){key_on[3]=0;}
	if ( keycode == 90){key_on[4]=0;} //z
	if ( keycode == 88){key_on[5]=0;} //x
	if ( keycode == 67){key_on[6]=0;} //c
	if ( keycode == 83){key_on[7]=0;} //s
	if ( keycode == 68){key_on[8]=0;} //d
	//キーを離しているとき
	if(key_on[0]+key_on[1]+key_on[2]+key_on[3] <=0){player[1].dir_key=4;}
	if(key_on[4]+key_on[5]+key_on[6]+key_on[7]+key_on[8] <=0){player[1].act_key=0;}
}

//-----------------------------------------------------------

//キーボード
document.onkeydown = keyCallBack_on; // 
document.onkeyup = keyCallBack_off; //   
