//プレーヤーの移動
function userMove(frameTime, agent) {
	let t0 = performance.now();  
	if(!agent.mesh){agent.mesh=	agent.chara.mesh;}
	//　マウス位置で方向転換

	var dest_angleRight = Math.atan2(mousex, cW);
	var dest_angleUp 	= Math.atan2(mousey, cH);
	
	// 視点変更-------------------------------------------------
	// 水平方向（マウスを押しているとき）
	if( dest_angleRight && mouseDrag>0){
		agent.rotationRight += frameTime * dest_angleRight *8;
	}
	// 上下（マウスを押しているとき）
	if( Math.abs(dest_angleUp) > THREE.Math.degToRad( 5 ) && 
		Math.abs(dest_angleRight) < Math.abs(dest_angleUp) && mouseDrag>0){
		agent.rotationUp 	-= frameTime * dest_angleUp *4;
		if(agent.rotationUp >= THREE.Math.degToRad( 45 )){agent.rotationUp= THREE.Math.degToRad( 45 );}
		if(agent.rotationUp <= THREE.Math.degToRad( -60 )){agent.rotationUp= THREE.Math.degToRad( -60 );}
	}
	// 向きを更新
	agent.updateView();
	//--------------------------------------------------------------
	var isMove_ = 0;
	var speed = 48*scaleOfWorld;
	
	// 歩く
	if(key_on[16]>0){
		speed = 16*scaleOfWorld;
	}
	
	// Jump
	if(key_on[32]>0){
		if(agent.isOnGround==1){
			agent.ySpeed=120*scaleOfWorld;
			agent.isOnGround =0;
		}
	}
	
	// 落下 or jump（高さの計算）
	if(agent.isOnGround==0){
		agent.ySpeed -= 300*frameTime*scaleOfWorld;
		agent.position.y += agent.ySpeed*frameTime;
	}else{
		agent.ySpeed = 0;
	}
	
	
	// WASD----------------------------------------------------------
	var dest_lookRight;
	let direction = 0; //stop
	//w (前進)
	if(key_on[87]>0){
		agent.position.z += frameTime * speed * agent.viewVect.z;
		agent.position.x += frameTime * speed * agent.viewVect.x;
		dest_lookRight = agent.rotationRight;
		direction = 1;
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
		
	}else
	//a
	if(key_on[65]>0){
		agent.position.z -= frameTime * speed * agent.viewVect.x;
		agent.position.x += frameTime * speed * agent.viewVect.z;
		dest_lookRight = agent.rotationRight+THREE.Math.degToRad( -90 );
		direction = 3;
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
	}else
	//s (後退)
	if(key_on[83]>0){
		agent.position.z -= frameTime * speed * agent.viewVect.z;
		agent.position.x -= frameTime * speed * agent.viewVect.x;
		dest_lookRight = agent.rotationRight+THREE.Math.degToRad( -180 );
		direction = 2;
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
	}else
	//d (右)
	if(key_on[68]>0){
		agent.position.z += frameTime * speed * agent.viewVect.x;
		agent.position.x -= frameTime * speed * agent.viewVect.z;
		dest_lookRight = agent.rotationRight+THREE.Math.degToRad( +90 );
		direction = 3;
		if(key_on[16]>0){ isMove_ = 2;}else{isMove_ = 1;}
	}
	//--------------------------------------------------------------
	
	// 向きの計算
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
	
	// 衝突判定(defined below)
	if (script_version >= 10 ){
		fieldCollision(agent, direction);
	}
	
	// 最下点着地
	if ( agent.position.y <= 0){
		agent.position.y =0;
		agent.isOnGround =1;
	}
	
	// 状態確定---------------------------------
	if(agent.isStop==1 && isMove_ > 0){
		agent.isStop=0;
	}else if(agent.isStop==0 && isMove_ == 0){
		agent.isStop=1;
	}

	//
	if(agent.isOnGround==0){
		agent.isStop=0;
		if ( agent.ySpeed >0 ){
			isMove_=3;
		}else{
			
		}
	}
		
	// walk
	if(agent.isStop==1 && script_version >= 10){agent.selectMotion = 4;}
	if(agent.isStop==0){
		if(isMove_==2){agent.selectMotion = 0;}
		if(isMove_==1){agent.selectMotion = 1;}
		if(isMove_==3){agent.selectMotion = 2;}
		if(isMove_==4){agent.selectMotion = 3;}
		
	}	

	// 反映する
	agent.chara.mesh.rotation.y = -agent.lookingRight;
	agent.chara.mesh.position.x = agent.position.x;
	agent.chara.mesh.position.y = agent.position.y;
	agent.chara.mesh.position.z = agent.position.z;
	let t1 = performance.now();  
	return t1-t0;
}





//NPCの移動
function npcMove(frameTime, agent) {
	
	let t0 = performance.now();  
	if(!agent.mesh){agent.mesh=	agent.chara.mesh;}

	// ターゲット決定
	let target = player;
		
	// 目標地点設定------------------------------
	
	searchLength = 200*scaleOfWorld;
	// boundingSphere
	const bSphere = agent.mesh.geometry.boundingSphere;
	const bsCenterLocal = new THREE.Vector3(bSphere.center.x, bSphere.center.y, bSphere.center.z);
	const bsCenter = bsCenterLocal.clone().add(agent.position);

	if(!target.chara.mesh){return 0;}
	// ローカル
	if(script_version>12){
		let fLocalx = Math.floor( (agent.position.x+500)/250);
		let fLocalz = Math.floor( (agent.position.z+500)/250);
		if(fLocalx <0){fLocalx=0;}
		if(fLocalx >3){fLocalx=3;}
		if(fLocalz <0){fLocalz=0;}
		if(fLocalz >3){fLocalz=3;}
		fLocalGridId = fLocalx + fLocalz*4;
	}
	// Rayの向き
	const bSphere_t = target.chara.mesh.geometry.boundingSphere;
	let destPosition = target.position;
	let destVect_ = destPosition.clone().sub(agent.position);
	let destlength = destVect_.length();
	let destVect = destVect_.clone().normalize();
	Vray = new THREE.Raycaster(bsCenter, destVect);
	
	// agent から target への衝突判定
	let intersects=[];
	let bSphere_o;
	// 至近距離なら無視
	if( destlength > bSphere.radius/2 + bSphere_t.radius/2){
		if(script_version>12){
			intersects = Vray.intersectObjects(fieldLocalGrid.children[fLocalGridId], true); 
		}else{
			intersects = Vray.intersectObjects(fieldObjs.children, true); 
		}	
	}
	
	// 処理
	let bsCenter_o=null;	//衝突オブジェクトの中心
	let hitPoint=null;
	if (intersects.length>0){
		// 障害物があるとき
		if( intersects[0].distance < destlength){
			hitPoint = intersects[0].point;
			// 障害物のboundingSphere を取得
			bSphere_o = intersects[0].object.geometry.boundingSphere;
			bsCenter_o = intersects[0].object.localToWorld(bSphere_o.center.clone());
			let bsVectLocal_ = bsCenter_o.clone().sub(agent.position);
			let bsVectLocalZX_ = new THREE.Vector3(bsVectLocal_.x, 0, bsVectLocal_.z).normalize();
			
			// 目標地点を修正(boundingSphereの接線に沿って動く mergin:2)
			let reset_angle = Math.asin( (bSphere_o.radius+2) / bsVectLocal_.length() );
			let bs_angle = Math.atan2(bsVectLocalZX_.z, bsVectLocalZX_.x);
			agent.rotationRight = bs_angle+reset_angle;
			agent.updateView();
			destVect = agent.viewVect;
		
		}
	}
	//-----------------------------------------------------------------

	if(mouseDrag>0){
	//	console.log(hitPoint);
	//	console.log(destPosition);
	}
	//-----------------------------------------------------------------
	var isMove_ = 0;
	var speed = 40*scaleOfWorld;

	
	
	//　向きを更新
	agent.viewVect = destVect;
	let vVectZX = new THREE.Vector3(destVect.x, 0, destVect.z).normalize();
	agent.rotationRight = Math.atan2(vVectZX.z, vVectZX.x) - agent.offsetRotationRight;
	agent.lookingRight = agent.rotationRight;
	
	// 移動
	let lengthNear = 4*scaleOfWorld + bSphere.radius + bSphere_t.radius/2;
	if( destlength > lengthNear ){
		if( destlength < lengthNear){
			speed = 16*scaleOfWorld;
			isMove_ = 2;
		}else{
			isMove_ = 1;
		}
		agent.position.z += frameTime * speed * agent.viewVect.z;
		agent.position.x += frameTime * speed * agent.viewVect.x;
		direction = 1;
	}
	
	
	
	// 落下 or jump(高さの計算)
	if(agent.isOnGround==0){
		agent.ySpeed -= 300*frameTime;
		agent.position.y += agent.ySpeed*frameTime;
	}else{
		agent.ySpeed = 0;
	}
	
	
	// 衝突判定(defined below)
	if (script_version >= 10){
		fieldCollision(agent,0);
	}
	
	// 最下点着地
	if ( agent.position.y <= 0){
		agent.position.y =0;
		agent.isOnGround =1;
	}
	
	// 状態確定---------------------------------
	if(agent.isStop==1 && isMove_ > 0){
		agent.isStop=0;
	}else if(agent.isStop==0 && isMove_ == 0){
		agent.isStop=1;
	}

	//
	if(agent.isOnGround==0){
		agent.isStop=0;
		if ( agent.ySpeed >0 ){
			isMove_=3;
		}else{
			
		}
	}
		
	// walk
	if(agent.isStop==1 && script_version >= 10){agent.selectMotion = 4;}
	if(agent.isStop==0){
		if(isMove_==2){agent.selectMotion = 0;}
		if(isMove_==1){agent.selectMotion = 1;}
		if(isMove_==3){agent.selectMotion = 2;}
		if(isMove_==4){agent.selectMotion = 3;}
		
	}	

	// 反映する
	agent.chara.mesh.rotation.y = -agent.lookingRight;
	agent.chara.mesh.position.x = agent.position.x;
	agent.chara.mesh.position.y = agent.position.y;
	agent.chara.mesh.position.z = agent.position.z;
	let t1 = performance.now();  
	return t1-t0;
}





















// モーションを更新
function updateAction(frameTime, agent){
	let t0 = performance.now();  
	let actions = agent.chara.actions;
	// motionが切り替わった時
	if(agent.lastMotion != agent.selectMotion){
		 //
		 actions[agent.lastMotion].weight =0.3;
		 agent.chara.helper.update( frameTime );
		 actions[agent.lastMotion].fadeOut(agent.chara.motionFiles[agent.lastMotion].fadeOut);
		 //
		 actions[agent.selectMotion].reset();
		 actions[agent.selectMotion].play();
		 actions[agent.selectMotion].fadeIn(agent.chara.motionFiles[agent.selectMotion].fadeIn);
		 actions[agent.selectMotion].weight =0.3;
	}else{
		 actions[agent.selectMotion].weight =1;
	}
	
	agent.chara.helper.update( frameTime );
	agent.lastMotion = agent.selectMotion;
	let t1 = performance.now();  
	return t1-t0;
	
}


// 衝突判定
function fieldCollision(agent, direction){
	// 下準備--------------------------------------------------------------
	let fLocalGridId;

	if(script_version>12){
		let fLocalx = Math.floor( (agent.position.x+500)/250);
		let fLocalz = Math.floor( (agent.position.z+500)/250);
		if(fLocalx <0){fLocalx=0;}
		if(fLocalx >3){fLocalx=3;}
		if(fLocalz <0){fLocalz=0;}
		if(fLocalz >3){fLocalz=3;}
		if(mouseDrag>0){
			//console.log(fLocalx+','+fLocalz);
		}
		fLocalGridId = fLocalx + fLocalz*4;
	}
		
	
	searchLength = 200*scaleOfWorld;
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
	const ZRayOrigin = bsCenter.clone().addScaledVector(ZRayVect, -searchLength);
	const XRayOrigin = bsCenter.clone().addScaledVector(XRayVect, -searchLength);
	const YRayOrigin = bsCenter.clone().addScaledVector(YRayVect, -searchLength);
	// 水平2軸は足
	//let ZRayOriginHead = ZRayOrigin.clone().add(new THREE.Vector3(0,  bSphere.radius*0.9, 0));
	let ZRayOriginFoot = ZRayOrigin.clone().add(new THREE.Vector3(0, -bSphere.radius*0.7, 0));
	//let XRayOriginHead = XRayOrigin.clone().add(new THREE.Vector3(0,  bSphere.radius*0.9, 0));
	let XRayOriginFoot = XRayOrigin.clone().add(new THREE.Vector3(0, -bSphere.radius*0.7, 0));
	
	// Ray
	//let ZrayHead = new THREE.Raycaster(ZRayOriginHead, ZRayVect);
	//let XrayHead = new THREE.Raycaster(XRayOriginHead, XRayVect);
	let ZrayFoot = new THREE.Raycaster(ZRayOriginFoot, ZRayVect);
	let XrayFoot = new THREE.Raycaster(XRayOriginFoot, XRayVect);
	let Yray	 = new THREE.Raycaster(YRayOrigin, YRayVect);
	//-------------------------------------------------------------------
	
	// (1)衝突検出Y-----------------------
	if(script_version<13){
		var intersects = Yray.intersectObjects( fieldObjs.children, true); 
	}else{
		//var intersects = Yray.intersectObjects( fieldObjs.children, true);
		var intersects = Yray.intersectObjects( fieldLocalGrid.children[fLocalGridId], true); 
	}
	// 足Y: 足側で最も高いものを探す
	// 頭Y: 頭側で最も低いものを探す
	var footHighestYLocal = -searchLength;
	var headLowestYLocal  =  searchLength;
	//
	for (let i = 0; i < intersects.length; i++) {
		// 相対位置
		let footYLocal = searchLength-intersects[i].distance + bSphere.radius;
	    if( footYLocal > footHighestYLocal && footYLocal <= bSphere.radius){
	    	footHighestYLocal = footYLocal;
	    }
	    // 相対位置
	    let headYLocal = searchLength-intersects[i].distance - bSphere.radius;
	    if( headYLocal < headLowestYLocal && headYLocal > -bSphere.radius){
	    	headLowestYLocal = headYLocal;
	    }
	}
	

	// (2)衝突検出Z-----------------------
	var footNearestZLocal =searchLength;
	if (direction ==1 || direction ==2){
		intersects = ZrayFoot.intersectObjects(fieldObjs.children, true);
		if(script_version<13){
			intersects = ZrayFoot.intersectObjects(fieldObjs.children, true);
		}else{
			//intersects = ZrayFoot.intersectObjects(fieldObjs.children, true);
			intersects = ZrayFoot.intersectObjects(fieldLocalGrid.children[fLocalGridId], true);
		}
		// z: 最も距離が近いもの
		//
		for (let i = 0; i < intersects.length; i++) {
			// 相対位置
			let footZLocal = intersects[i].distance - searchLength;
		    if( Math.abs(footZLocal) < Math.abs(footNearestZLocal) ){
		    	footNearestZLocal = footZLocal;
		    }
		}
	}
	// 頭
	/*
	intersects = ZrayHead.intersectObjects(fieldObjs.children, true);
	// z: 最も距離が近いもの
	var headNearestZLocal =searchLength;
	//
	for (let i = 0; i < intersects.length; i++) {
		// 相対位置
		let headZLocal = intersects[i].distance - searchLength;
	    if( Math.abs(headZLocal) < Math.abs(headNearestZLocal) ){
	    	headNearestZLocal = headZLocal;
	    }
	}
	*/
	// (3)衝突検出X-----------------------
	var footNearestXLocal =searchLength;
	if (direction ==3){
		
		if(script_version<13){
			intersects = XrayFoot.intersectObjects(fieldObjs.children, true);
		}else{
			intersects = XrayFoot.intersectObjects(fieldLocalGrid.children[fLocalGridId], true);
		}
		
		var intersectsFX = intersects;
		// x: 最も距離が近いもの
		//
		for (let i = 0; i < intersects.length; i++) {
			// 相対位置
			let footXLocal = intersects[i].distance - searchLength;
		    if( Math.abs(footXLocal) < Math.abs(footNearestXLocal) ){
		    	footNearestXLocal = footXLocal;
		    }
		}
	}
	/*
	// 頭
	intersects = XrayHead.intersectObjects(fieldObjs.children, true);
	// x: 最も距離が近いもの
	var headNearestXLocal =searchLength;
	//
	for (let i = 0; i < intersects.length; i++) {
		// 相対位置
		let headXLocal = intersects[i].distance - searchLength;
	    if( Math.abs(headXLocal) < Math.abs(headNearestXLocal) ){
	    	headNearestXLocal = headXLocal;
	    }
	}
	*/
	
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
	/*
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
	*/
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
		//console.log(footNearestZLocal);
		//console.log(footNearestXLocal);
	}
}