//プレーヤーの移動
function userMove(frameTime, mesh, agent) {
	
	//　マウス位置で方向転換
	canvasWidth = renderer.domElement.offsetWidth;
	canvasHeight = renderer.domElement.offsetHeight;
	dest_angleRight = Math.atan2(mousex, canvasWidth);
	dest_angleUp 	= Math.atan2(mousey, canvasHeight);
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
	var isWalk_ = 0;
	//w (前進)
	if(key_on[87]>0){
		agent.position.z += frameTime * 5 * agent.viewVect.z;
		agent.position.x += frameTime * 5 * agent.viewVect.x;
		isWalk_ = 1;
	}
	//a
	if(key_on[65]>0){
		agent.position.z -= frameTime * 5 * agent.viewVect.x;
		agent.position.x += frameTime * 5 * agent.viewVect.z;
		isWalk_ = 1;
	}
	//s (後退)
	if(key_on[83]>0){
		agent.position.z -= frameTime * 5 * agent.viewVect.z;
		agent.position.x -= frameTime * 5 * agent.viewVect.x;
		isWalk_ = 1;
	}
	//d (右)
	if(key_on[68]>0){
		agent.position.z += frameTime * 5 * agent.viewVect.x;
		agent.position.x -= frameTime * 5 * agent.viewVect.z;
		isWalk_ = 1;
	}
	if(player.isStop==1 && isWalk_ > 0){
		ApplyAnimation( 0, mesh);
		player.isStop=0;
	}else if(player.isStop==0 && isWalk_ == 0){
		player.isStop=1;
	}
	
	// 反映する
	mesh.rotation.y = -agent.rotationRight;
	mesh.position.x = agent.position.x;
	mesh.position.y = agent.position.y;
	mesh.position.z = agent.position.z;
}