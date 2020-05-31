//プレーヤーの移動
function ItemListener(frameTime) {
	// 
	for (let it=0; it<1; it++){
		if (staticItem[it].loadObj._isLoaded==1 && staticItem[it]._isAdded==1){
			ItemAction(frameTime, staticItem[it]);
		}
	}	

}


function ItemAction(frameTime, item){
	
	let check_all_ = 1;
	if(displayedItemId>=0){
		if(staticItem[displayedItemId].state==1 || staticItem[displayedItemId].state==2){
			check_all_ = 0;
		}
	}
	//
	if(item.coolDown>0){
		item.coolDown -=frameTime;
		if(item.coolDown<=0){
			item.state = 0;
			item.position = item.initPosition;
			item.updatePosition(new THREE.Vector3(0,0,0));
			scene.add(item.loadObj.object);
			item.effect.sprite.material.visible=false;
			item.effect.video.pause();
		}
	}
	
	
	//
	if(check_all_==0){
		if(item.id == displayedItemId){
			let localWristPosition = new THREE.Vector3(0,0,0);
			let localElbowPosition = new THREE.Vector3(0,0,0);
			// 仮
			player.chara.mesh.skeleton.bones[39].localToWorld(localWristPosition);
			player.chara.mesh.skeleton.bones[34].localToWorld(localElbowPosition);
			let armVect = localWristPosition.clone().sub(localElbowPosition).normalize();
			//
			item.position = localWristPosition;
			item.updateRotation(armVect);
			item.updatePosition(new THREE.Vector3(0,0,0));
			// Gキーが押されているとき
			if(key_on[BG.key] == 0){
				if(staticItem[displayedItemId].state==1){
					item.state = 2;
				}
			//
			}else if(staticItem[displayedItemId].state==2){
					item.state = 3;
					player.stopTime=0.6;
					player.actTime =0.3;
					//
					item.thrownVect = player.getLookingVect();
					item.ySpeed=120*scaleOfWorld;
					item.speed=100*scaleOfWorld;
					item.isOnGround =0;
					
					drawGuide('');
			}
		} // displayed holditem	
	}else{
		// 拾う
		if(item.type < 10){
			//設置されている
			if(item.state==0){
				let distance = player.position.clone().sub(item.position).length();
				if(distance < 9 ){
					displayedItemId = item.id;
					drawGuide(itemText[item.type]);
					// Gキーが押されているとき
					if(key_on[BG.key] > 0){
						item.state = 1;
						drawGuide(itemHoldText[item.type]);
					}
					//item.updatePosition();
				}else if( displayedItemId == item.id){
					drawGuide('');
				}
			}else if(item.state==3){
				// 投てき
				if(item.isOnGround==0){
					// position
					item.ySpeed -= 300*frameTime*scaleOfWorld;
					item.position.y += item.ySpeed*frameTime;
					item.position.z += item.speed *frameTime * item.thrownVect.z;
					item.position.x += item.speed *frameTime * item.thrownVect.x;
					// rotation
					item.angle += frameTime * Math.PI*2;
					let viewVect = new THREE.Vector3(Math.sin(item.angle) * item.thrownVect.x, Math.cos(item.angle), Math.sin(item.angle) * item.thrownVect.z);
					item.updateRotation(viewVect);
					//drawGuide(item.position.x);
					item.updatePosition(new THREE.Vector3(0,0,0));
					// 衝突判定
					fieldCollisionOfItem(item,  frameTime);
					// 最下点着地
					if ( item.position.y <= 0){
						item.position.y =0;
						item.isOnGround =1;
					}
					// 着弾
					if(item.isOnGround ==1){
						item.state = 4;displayedItemId =-1;
						item.updateRotation(new THREE.Vector3(0,1,0));
						item.coolDown = 5;
						item.effect.position = item.position;
						item.effect.video.load();
						item.effect.sprite.material.visible=true;
						item.effect.video.play(); 
						item.effect.updatePosition();
						scene.remove(item.loadObj.object);
					}
						
				}else{
					item.ySpeed = 0;
				}
			} //state
		} //type
	} //hold
} 








// 衝突判定
function fieldCollisionOfItem(item, frameTime){
	// 下準備--------------------------------------------------------------
	let fLocalGridId;

	if(script_version>12){
		let fLocalx = Math.floor( (item.position.x+500)/250);
		let fLocalz = Math.floor( (item.position.z+500)/250);
		if(fLocalx <0){fLocalx=0;}
		if(fLocalx >3){fLocalx=3;}
		if(fLocalz <0){fLocalz=0;}
		if(fLocalz >3){fLocalz=3;}

		fLocalGridId = fLocalx + fLocalz*4;
	}
		
	
	searchLength = 200*scaleOfWorld;
	// boundingSphere から頭と足もとの位置を決める
	let itemObjRepres = item.loadObj.object.children[0];
	
	const bSphere = itemObjRepres.geometry.boundingSphere;
	const bsCenterLocal = new THREE.Vector3(bSphere.center.x, bSphere.center.y, bSphere.center.z);
	const bsCenter = itemObjRepres.localToWorld(bsCenterLocal.clone());
	const bsRadius = bSphere.radius * item.loadObj.object.scale.x;
	let bsHead = bsCenter.clone().add(new THREE.Vector3(0,  bsRadius, 0));
	let bsFoot = bsCenter.clone().add(new THREE.Vector3(0, -bsRadius, 0));

	// Rayの向き
	let ZRayVect = new THREE.Vector3( item.thrownVect.x, 0, item.thrownVect.z).normalize();
	//let XRayVect = new THREE.Vector3( item.thrownVect.z, 0, item.thrownVect.x).normalize();
	let YRayVect = new THREE.Vector3( 0, -1, 0); //上から下
	
	// Rayの始点（後方、左、上）
	const ZRayOrigin = bsCenter.clone().addScaledVector(ZRayVect, -searchLength);
	//const XRayOrigin = bsCenter.clone().addScaledVector(XRayVect, -searchLength);
	const YRayOrigin = bsCenter.clone().addScaledVector(YRayVect, -searchLength);
	// 水平2軸は足
	let ZRayOriginFoot = ZRayOrigin.clone().add(new THREE.Vector3(0, -bsRadius*0.7, 0));
	//let XRayOriginFoot = XRayOrigin.clone().add(new THREE.Vector3(0, -bsRadius*0.7, 0));
	
	// Ray
	let ZrayFoot = new THREE.Raycaster(ZRayOriginFoot, ZRayVect);
	//let XrayFoot = new THREE.Raycaster(XRayOriginFoot, XRayVect);
	let Yray	 = new THREE.Raycaster(YRayOrigin, YRayVect);
	//-------------------------------------------------------------------
	
	// (1)衝突検出Y-----------------------
	var intersects = Yray.intersectObjects( fieldLocalGrid.children[fLocalGridId], true); 

	// 足Y: 足側で最も高いものを探す
	// 頭Y: 頭側で最も低いものを探す
	var footHighestYLocal = -searchLength;
	var headLowestYLocal  =  searchLength;
	//
	for (let i = 0; i < intersects.length; i++) {
		// 相対位置
		let footYLocal = searchLength-intersects[i].distance + bsRadius;
	    if( footYLocal > footHighestYLocal && footYLocal <= bsRadius){
	    	footHighestYLocal = footYLocal;
	    }
	    // 相対位置
	    let headYLocal = searchLength-intersects[i].distance - bsRadius;
	    if( headYLocal < headLowestYLocal && headYLocal > -bsRadius){
	    	headLowestYLocal = headYLocal;
	    }
	}
	

	// (2)衝突検出Z-----------------------
	var footNearestZLocal =searchLength;
	if (item.direction ==1 || item.direction ==2){
		intersects = ZrayFoot.intersectObjects(fieldLocalGrid.children[fLocalGridId], true);
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

	
	// 処理をかく
	// 足もとに踏み越えられない壁がある場合、近ければ押し戻す------------------------------------
	
	// 速度に合わせて範囲を変更する
	let collisionRadius = Math.max(bsRadius*0.25, item.speed*frameTime);
	//  radius*30%の高さにZ衝突面がある場合、近ければ押し出す
	if ( Math.abs(footNearestZLocal) < collisionRadius){
		if(item.direction==1){
			item.position.x -= collisionRadius * ZRayVect.x;
			item.position.z -= collisionRadius * ZRayVect.z;
		}else if(item.direction==2){
			item.position.x += collisionRadius * ZRayVect.x;
			item.position.z += collisionRadius * ZRayVect.z;
		}
	}
	

	// 天井が頭より下の場合押し戻す
	if (headLowestYLocal <= 0){
		// 頭をぶつける
		item.position.y += headLowestYLocal;

	}
	
	// 床が足より上の場合押し戻す
	if (footHighestYLocal >= -bsRadius*0.01){
		// ここまで弾かれていないなら乗り越える
		item.position.y += footHighestYLocal;
		item.isOnGround =1; 
	}else{
		item.isOnGround =0;
	}
	
	if(mouseDrag>0){
		//console.log(footNearestZLocal);
		//console.log(footNearestXLocal);
	}
}