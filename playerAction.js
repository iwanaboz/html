//プレーヤーの移動
function userMove(frameTime, mesh, agent) {
	
	//　マウス位置で方向転換
	var canvasWidth = renderer.domElement.offsetWidth;
	var canvasHeight = renderer.domElement.offsetHeight;
	var dest_angleRight = Math.atan2(mousex, canvasWidth);
	var dest_angleUp 	= Math.atan2(mousey, canvasHeight);
	// 水平方向（マウスを押しているとき）
	if( dest_angleRight && mouseDrag>0){
		player.rotationRight += frameTime * dest_angleRight *5;
	}
	// 上下（マウスを押しているとき）
	if( Math.abs(dest_angleUp) > THREE.Math.degToRad( 5 ) && 
		Math.abs(dest_angleRight) < Math.abs(dest_angleUp) && mouseDrag>0){
		player.rotationUp 	-= frameTime * dest_angleUp *4;
		if(player.rotationUp >= THREE.Math.degToRad( 45 )){player.rotationUp= THREE.Math.degToRad( 45 );}
		if(player.rotationUp <= THREE.Math.degToRad( -60 )){player.rotationUp= THREE.Math.degToRad( -60 );}
	}
	//　向きを更新
	agent.updateView();
	var isMove_ = 0;
	var speed = 8;
	if(key_on[16]>0){
		speed = 24;
	}
	
	var dest_lookRight;
	//w (前進)
	if(key_on[87]>0){
		agent.position.z += frameTime * speed * agent.viewVect.z;
		agent.position.x += frameTime * speed * agent.viewVect.x;
		dest_lookRight = agent.rotationRight;
		
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
		
	}
	//a
	if(key_on[65]>0){
		agent.position.z -= frameTime * speed * agent.viewVect.x;
		agent.position.x += frameTime * speed * agent.viewVect.z;
		dest_lookRight = agent.rotationRight+THREE.Math.degToRad( -90 );
		
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
	}
	//s (後退)
	if(key_on[83]>0){
		agent.position.z -= frameTime * speed * agent.viewVect.z;
		agent.position.x -= frameTime * speed * agent.viewVect.x;
		dest_lookRight = agent.rotationRight+THREE.Math.degToRad( -180 );
		
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
	}
	//d (右)
	if(key_on[68]>0){
		agent.position.z += frameTime * 5 * agent.viewVect.x;
		agent.position.x -= frameTime * 5 * agent.viewVect.z;
		dest_lookRight = agent.rotationRight+THREE.Math.degToRad( +90 );
		
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
	}
	
	if(isMove_ > 0){
		dest_lookRight = dest_lookRight%THREE.Math.degToRad(360);
		agent.lookingRight = agent.lookingRight%THREE.Math.degToRad(360);
		
		var diff_angle = dest_lookRight-agent.lookingRight;
		if(  Math.abs(diff_angle+THREE.Math.degToRad(360)) < Math.abs(diff_angle) ){
			diff_angle +=THREE.Math.degToRad(360);
		}
		if(  Math.abs(diff_angle-THREE.Math.degToRad(360)) < Math.abs(diff_angle) ){
			diff_angle -=THREE.Math.degToRad(360);
		}
		//if(Math.abs(diff_angle)<THREE.Math.degToRad( 180 )){
			agent.lookingRight += diff_angle*frameTime*4;

	}
	
	if(player.isStop==1 && isMove_ > 0){
		player.isStop=0;
	}else if(player.isStop==0 && isMove_ == 0){
		player.isStop=1;
	}
	
	// walk
	if(isMove_==1){selectmotion = 0;}
	if(isMove_==2){selectmotion = 1;}
	
	// 反映する
	mesh.rotation.y = -agent.lookingRight;
	mesh.position.x = agent.position.x;
	mesh.position.y = agent.position.y;
	mesh.position.z = agent.position.z;
}