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
					displayedItemId =-1;
					drawGuide('');
			}
		} // displayed holditem	
	}else{
		// 拾う
		if(item.type < 10){
			//設置されている
			if(item.state==0){
				let distance = player.position.clone().sub(item.position).length();
				if(distance < 7 ){
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
					item.ySpeed -= 300*frameTime*scaleOfWorld;
					item.position.y += item.ySpeed*frameTime;
					item.position.z += item.speed *frameTime * item.thrownVect.z;
					item.position.x += item.speed *frameTime * item.thrownVect.x;
					//item.updateRotation(armVect);
					//drawGuide(item.position.x);
					item.updatePosition(new THREE.Vector3(0,0,0));
					// 最下点着地
					if ( item.position.y <= 0){
						item.position.y =0;
						item.isOnGround =1;
						item.state = 0;
						item.updateRotation(new THREE.Vector3(0,1,0));
					}
				}else{
					item.ySpeed = 0;
				}
			} //state
		} //type
	} //hold
} 