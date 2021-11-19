//プレーヤーの移動
function userMove(frameTime, mesh, agent) {
	
	//　マウス位置で方向転換
	var canvasWidth = renderer.domElement.offsetWidth;
	var canvasHeight = renderer.domElement.offsetHeight;
	var dest_angleRight = Math.atan2(mousex, canvasWidth);
	var dest_angleUp 	= Math.atan2(mousey, canvasHeight);
	// 水平方向（マウスを押しているとき）
	if( dest_angleRight && mouseDrag>0){
		player.rotationRight += frameTime * dest_angleRight *8;
	}
	// 上下（マウスを押しているとき）
	if( Math.abs(dest_angleUp) > THREE.Math.degToRad( 5 ) && 
		Math.abs(dest_angleRight) < Math.abs(dest_angleUp) && mouseDrag>0){
		player.rotationUp 	-= frameTime * dest_angleUp *4;
		if(agent.rotationUp >= THREE.Math.degToRad( 45 )){agent.rotationUp= THREE.Math.degToRad( 45 );}
		if(agent.rotationUp <= THREE.Math.degToRad( -60 )){agent.rotationUp= THREE.Math.degToRad( -60 );}
	}
	//　向きを更新
	agent.updateView();
	var isMove_ = 0;
	var speed = 48;
	
	// Dash
	if(key_on[16]>0){
		speed = 16;
	}
	
	// Jump
	if(key_on[32]>0){
		if(agent.isOnGround==1){
			agent.ySpeed=120;
			agent.isOnGround =0;
		}
	}
	
	// 落下 or jump
	if(agent.isOnGround==0){
		agent.ySpeed -= 300*frameTime;
		agent.position.y += agent.ySpeed*frameTime;
	}else{
		agent.ySpeed = 0;
	}
	
	// 最下点着地
	if ( agent.position.y <= 0){
		agent.position.y =0;
		agent.isOnGround =1;
	}
	
	
	
	var dest_lookRight;
	//w (前進)
	if(key_on[87]>0){
		agent.position.z += frameTime * speed * agent.viewVect.z;
		agent.position.x += frameTime * speed * agent.viewVect.x;
		dest_lookRight = agent.rotationRight;
		
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
		
	}else
	//a
	if(key_on[65]>0){
		agent.position.z -= frameTime * speed * agent.viewVect.x;
		agent.position.x += frameTime * speed * agent.viewVect.z;
		dest_lookRight = agent.rotationRight+THREE.Math.degToRad( -90 );
		
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
	}else
	//s (後退)
	if(key_on[83]>0){
		agent.position.z -= frameTime * speed * agent.viewVect.z;
		agent.position.x -= frameTime * speed * agent.viewVect.x;
		dest_lookRight = agent.rotationRight+THREE.Math.degToRad( -180 );
		
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
	}else
	//d (右)
	if(key_on[68]>0){
		agent.position.z += frameTime * speed * agent.viewVect.x;
		agent.position.x -= frameTime * speed * agent.viewVect.z;
		dest_lookRight = agent.rotationRight+THREE.Math.degToRad( +90 );
		
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
	}
	
	// muki
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
			agent.lookingRight += diff_angle*frameTime*8;

	}
	//
	if (script_version >= 10){
		fieldCollision(agent);
	}
	
	if(player.isStop==1 && isMove_ > 0){
		player.isStop=0;
	}else if(player.isStop==0 && isMove_ == 0){
		player.isStop=1;
	}
	if(agent.isOnGround==0){
		player.isStop=0;
		if ( agent.ySpeed >0){
			isMove_=3;
		}else if(agent.ySpeed < -300 * 0.2){
			isMove_=4;
		}
	}
		
	// walk
	if(agent.isStop==1 && script_version >= 10){selectmotion = 4;}
	if(isMove_==2){selectmotion = 0;}
	if(isMove_==1){selectmotion = 1;}
	if(isMove_==3){selectmotion = 2;}
	if(isMove_==4){selectmotion = 2;}
	// 反映する
	mesh.rotation.y = -agent.lookingRight;
	mesh.position.x = agent.position.x;
	mesh.position.y = agent.position.y;
	mesh.position.z = agent.position.z;
}






//
function fieldCollision(agent){
	// 下準備--------------------------------------------------------------
	// boundingSphere から頭と足もとの位置を決める
	const bSphere = agent.mesh.geometry.boundingSphere;
	const bsCenterLocal = new THREE.Vector3(bSphere.center.x, bSphere.center.y, bSphere.center.z);
	const bsCenter = bsCenterLocal.clone().add(agent.position);
	let bsHead = bsCenter.clone().add(new THREE.Vector3(0,  bSphere.radius, 0));
	let bsFoot = bsCenter.clone().add(new THREE.Vector3(0, -bSphere.radius, 0));

	// Rayの向き
	let ZRayVect = new THREE.Vector3( agent.viewVect.x, 0, agent.viewVect.z).normalize();
	let XRayVect = new THREE.Vector3( agent.viewVect.z, 0, agent.viewVect.x).normalize();
	let YRayVect = new THREE.Vector3( 0, -1, 0); //上から下
	
	// Rayの始点（後方、左、上）
	const ZRayOrigin = bsCenter.clone().addScaledVector(ZRayVect, -200);
	const XRayOrigin = bsCenter.clone().addScaledVector(XRayVect, -200);
	const YRayOrigin = bsCenter.clone().addScaledVector(YRayVect, -200);
	// 水平2軸は頭と足も用意する
	let ZRayOriginHead = ZRayOrigin.clone().add(new THREE.Vector3(0,  bSphere.radius*0.9, 0));
	let ZRayOriginFoot = ZRayOrigin.clone().add(new THREE.Vector3(0, -bSphere.radius*0.7, 0));
	let XRayOriginHead = XRayOrigin.clone().add(new THREE.Vector3(0,  bSphere.radius*0.9, 0));
	let XRayOriginFoot = XRayOrigin.clone().add(new THREE.Vector3(0, -bSphere.radius*0.7, 0));
	
	// Ray
	let ZrayHead = new THREE.Raycaster(ZRayOriginHead, ZRayVect);
	let XrayHead = new THREE.Raycaster(XRayOriginHead, XRayVect);
	let ZrayFoot = new THREE.Raycaster(ZRayOriginFoot, ZRayVect);
	let XrayFoot = new THREE.Raycaster(XRayOriginFoot, XRayVect);
	let Yray	 = new THREE.Raycaster(YRayOrigin, YRayVect);
	//-------------------------------------------------------------------
	// (1)衝突検出Y-----------------------
	var intersects = Yray.intersectObjects(fieldObjs.children, true); 
	
	// 足Y: 足側で最も高いものを探す
	// 頭Y: 頭側で最も低いものを探す
	var footHighestYLocal = -200;
	var headLowestYLocal  =  200;
	//
	for (let i = 0; i < intersects.length; i++) {
		// 相対位置
		let footYLocal = 200-intersects[i].distance + bSphere.radius;
	    if( footYLocal > footHighestYLocal && footYLocal <= bSphere.radius){
	    	footHighestYLocal = footYLocal;
	    }
	    // 相対位置
	    let headYLocal = 200-intersects[i].distance - bSphere.radius;
	    if( headYLocal < headLowestYLocal && headYLocal > -bSphere.radius){
	    	headLowestYLocal = headYLocal;
	    }
	}
	

	// (2)衝突検出Z-----------------------
	intersects = ZrayFoot.intersectObjects(fieldObjs.children, true);
	// z: 最も距離が近いもの
	var footNearestZLocal =200;
	//
	for (let i = 0; i < intersects.length; i++) {
		// 相対位置
		let footZLocal = intersects[i].distance - 200;
	    if( Math.abs(footZLocal) < Math.abs(footNearestZLocal) ){
	    	footNearestZLocal = footZLocal;
	    }
	}
	// 頭
	intersects = ZrayHead.intersectObjects(fieldObjs.children, true);
	// z: 最も距離が近いもの
	var headNearestZLocal =200;
	//
	for (let i = 0; i < intersects.length; i++) {
		// 相対位置
		let headZLocal = intersects[i].distance - 200;
	    if( Math.abs(headZLocal) < Math.abs(headNearestZLocal) ){
	    	headNearestZLocal = headZLocal;
	    }
	}
	
	// (3)衝突検出X-----------------------
	intersects = XrayFoot.intersectObjects(fieldObjs.children, true);
	var intersectsFX = intersects;
	// x: 最も距離が近いもの
	var footNearestXLocal =200;
	//
	for (let i = 0; i < intersects.length; i++) {
		// 相対位置
		let footXLocal = intersects[i].distance - 200;
	    if( Math.abs(footXLocal) < Math.abs(footNearestXLocal) ){
	    	footNearestXLocal = footXLocal;
	    }
	}
	
	// 頭
	intersects = XrayHead.intersectObjects(fieldObjs.children, true);
	// x: 最も距離が近いもの
	var headNearestXLocal =200;
	//
	for (let i = 0; i < intersects.length; i++) {
		// 相対位置
		let headXLocal = intersects[i].distance - 200;
	    if( Math.abs(headXLocal) < Math.abs(headNearestXLocal) ){
	    	headNearestXLocal = headXLocal;
	    }
	}
	
	
	// 処理をかく
	// 足もとに踏み越えられない壁がある場合、近ければ押し戻す------------------------------------
	//  radius*30%の高さにZ衝突面がある場合、近ければ押し出す
	
	if ( Math.abs(footNearestZLocal) < bSphere.radius*0.2){
		if(footNearestZLocal>0){
			agent.position.x -= bSphere.radius*0.2 * ZRayVect.x;
			agent.position.z -= bSphere.radius*0.2 * ZRayVect.z;
		}else{
			agent.position.x += bSphere.radius*0.2 * ZRayVect.x;
			agent.position.z += bSphere.radius*0.2 * ZRayVect.z;
		}
	}
	
	// radius*30%の高さにX衝突面がある場合、近ければ押し出す
	if ( Math.abs(footNearestXLocal) < bSphere.radius*0.2){
		if(footNearestXLocal>0){
			agent.position.z -= bSphere.radius*0.2 * ZRayVect.x;
			agent.position.x -= bSphere.radius*0.2 * ZRayVect.z;
		}else{
			agent.position.z += bSphere.radius*0.2 * ZRayVect.x;
			agent.position.x += bSphere.radius*0.2 * ZRayVect.z;
		}
	}
	
	// 頭付近に壁がある場合、近ければ押し戻す------------------------------------
	
	//  radius*170%の高さにZ衝突面がある場合、近ければ押し出す
	if ( Math.abs(headNearestZLocal) < bSphere.radius*0.2){
		if(headNearestZLocal>0){
			agent.position.x -= bSphere.radius*0.2 * ZRayVect.x;
			agent.position.z -= bSphere.radius*0.2 * ZRayVect.z;
		}else{
			agent.position.x += bSphere.radius*0.2 * ZRayVect.x;
			agent.position.z += bSphere.radius*0.2 * ZRayVect.z;
		}
	}
	// radius*170%の高さにX衝突面がある場合、近ければ押し出す
	if ( Math.abs(headNearestXLocal) < bSphere.radius*0.2){
		if(headNearestXLocal>0){
			agent.position.z -= bSphere.radius*0.2 * ZRayVect.x;
			agent.position.x -= bSphere.radius*0.2 * ZRayVect.z;
		}else{
			agent.position.z += bSphere.radius*0.2 * ZRayVect.x;
			agent.position.x += bSphere.radius*0.2 * ZRayVect.z;
		}
	}
	
	// 天井が頭より下の場合押し戻す
	if (headLowestYLocal <= 0){
		// 頭をぶつける
		agent.position.y += headLowestYLocal;

	}
	
	// 床が足より上の場合押し戻す
	if (footHighestYLocal >= -bSphere.radius*0.01){
		// ここまで弾かれていないなら乗り越える
		agent.position.y += footHighestYLocal;
		agent.isOnGround =1; 
	}else{
		agent.isOnGround =0;
	}
	
	if(mouseDrag>0){
		console.log(intersectsFX);
		//console.log(footNearestZLocal);
		console.log(footNearestXLocal);
	}
}