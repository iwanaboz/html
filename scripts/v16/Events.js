
const spotlight = new THREE.PointLight(0xff0000, 1, 50, 1.0);
const darkFog = new THREE.Fog(0x222222, 0.1, 300);
//main loop
eventTime=0;
let eventStep=0; 
function eventLoop(frameTime, update_action_, aframeTime) {
	
	//ぷレイヤー
	if(player.chara._isLoaded>1 && enemy[0].chara._isLoaded>1){
		
		if(stageSelect==0){
			pEffect[0].sprite.material.map.needsUpdate = true;
			player.selectMotion = 4;
			if(eventTime> 0.1){
				if(eventTime< 5.0){
					eventTime = 5.0;
					player.chara.actions[player.selectMotion].weight =0.5;
					timeOfUserAnimationProc	= updateAction(aframeTime, player);
				}else if(eventTime< 9.0){
					if(eventStep==0){
						scene.add(fogObject);
						fogLookAt( new THREE.Vector3(10, 0, -1000) );
						fogSetPosition( new THREE.Vector3( 0, 75, 0), new THREE.Vector3( 100, 75, 75));
						eventStep=1;
						scene.fog = darkFog;
						setEventAgent(enemy[0].chara.mesh, eventTime, 5.0, 9.0,  new THREE.Vector3( 50, 3, -350), new THREE.Vector3( 0, 3, -350), new THREE.Vector3(10, 3, 250));
					}
					let sin2_ = Math.sin(eventTime*5)*Math.sin(eventTime*50);
					
					let intensity_ = 0.9+0.05*sin2_;
					light.intensity = intensity_;
					setEventCamera(eventTime, 5.0, 9.0,  new THREE.Vector3(-10, 50, 150), new THREE.Vector3(-40, 50, 150), new THREE.Vector3(10, 0, -100));
					setEventAgent(player.chara.mesh, eventTime, 5.0, 9.0,  new THREE.Vector3( 0, 3, -16), new THREE.Vector3( 0, 3, -80), new THREE.Vector3(10, 3, -100));
					player.selectMotion = 0;
					fogAnimate(frameTime, 0, 0, 0.3);
					timeOfUserAnimationProc	= updateAction(aframeTime, player);
					
				}else if(eventTime< 14.0){
					player.selectMotion = 0;
					if(eventStep==1){
						fogLookAt( new THREE.Vector3(1000, -200, -120) );
						fogSetPosition( new THREE.Vector3( 0, 50, -120), new THREE.Vector3( 50, 50, 75));
						eventStep=2;
						darkFog.far = 100;
						player.selectMotion = 4;
					}
					let sin2_ = Math.sin(eventTime*5)*Math.sin(eventTime*50);
					let intensity_ = 0.3+0.01*sin2_;
					light.intensity = intensity_;
					setEventCamera(eventTime, 9.0, 14.0,  new THREE.Vector3( -35, 12, -80), new THREE.Vector3( -35, 12, -160), new THREE.Vector3(1000, -200, -120));
					setEventAgent(player.chara.mesh, eventTime, 9.0, 14.0,  new THREE.Vector3( 0, 3, -80), new THREE.Vector3( 0, 3, -160), new THREE.Vector3(10, 3, -250));
					
					fogAnimate(frameTime, 0, 0, 0.3);
					timeOfUserAnimationProc	= updateAction(aframeTime, player);
					
				}else if(eventTime< 18.0){
					if(eventStep==2){
						fogLookAt( new THREE.Vector3(10, 0, -1000) );
						fogSetPosition( new THREE.Vector3( 50, 40, -270), new THREE.Vector3( 50, 40, 75));
						eventStep=3;
						scene.add( spotlight );
						player.selectMotion = 4;
						enemy[0].selectMotion = 4;
					}
					let sin2_ = Math.sin(eventTime*5)*Math.sin(eventTime*50);
					darkFog.far = 0+(eventTime-14)*30;
					let intensity_ = (eventTime-14 + 2*sin2_)*0.1;
					light.intensity = 0;
					spotlight.intensity = intensity_;
					
					setEventCamera(eventTime, 14.0, 18.0,  new THREE.Vector3( 0, 20, -220), new THREE.Vector3( 30, 20, -250), new THREE.Vector3(50, 0, -400));
					setEventAgent(enemy[0].chara.mesh, eventTime, 14.0, 18.0,  new THREE.Vector3( 50, 3, -350), new THREE.Vector3( 50, 3, -350), new THREE.Vector3(10, 3, 250));
					//player.selectMotion = 0;
					fogAnimate(frameTime, 0, 0, 0.3);
					//
					let localReyePosition = new THREE.Vector3(0,0,0);
					let localLeyePosition = new THREE.Vector3(0,0,0);
					// 仮
					enemy[0].chara.mesh.skeleton.bones[18].localToWorld(localReyePosition);
					enemy[0].chara.mesh.skeleton.bones[20].localToWorld(localLeyePosition);
					spotlight.position.set( localReyePosition.x, localReyePosition.y, localReyePosition.z+2 );
					
					timeOfUserAnimationProc	= updateAction(aframeTime, enemy[0]);
					
					
				}else if(eventTime< 20.0){
					if(eventStep==3){
						eventStep=4;
						darkFog.far =150;
						enemy[0].selectMotion = 0;
					}
					let sin2_ = Math.sin(eventTime*5)*Math.sin(eventTime*50);
					
					let intensity_ = (eventTime-18)*0.1 + 0.2 + 0.2*sin2_;
					light.intensity = (eventTime-18)*0.05;
					spotlight.intensity = intensity_;
					
					setEventCamera(eventTime, 18.0, 21.0,  new THREE.Vector3( 30, 20, -250), new THREE.Vector3( 30, 20, -260), new THREE.Vector3(50, 0, -400));
					setEventAgent(enemy[0].chara.mesh, eventTime, 18.0, 21.0,  new THREE.Vector3( 50, 3, -350), new THREE.Vector3( 30, 3, -280), new THREE.Vector3(10, 3, 250));
					//player.selectMotion = 0;
					fogAnimate(frameTime, 0, 0, 0.3);
					//
					let localReyePosition = new THREE.Vector3(0,0,0);
					// 仮
					enemy[0].chara.mesh.skeleton.bones[18].localToWorld(localReyePosition);
					spotlight.position.set( localReyePosition.x, localReyePosition.y, localReyePosition.z+2 );
					eventStep=4;
						
					timeOfUserAnimationProc	= updateAction(aframeTime, enemy[0]);
				}
			}
			if(eventTime >= 20.0){
				// end
				player.chara.mesh.rotation.set(0,0,0);
				enemy[0].chara.mesh.rotation.set(0,0,0);
				scene.remove( spotlight);
				scene.remove( fogObject);
				scene.fog = null;
				light.intensity =1;
				
				dispButtons();
				eventOn=0;
			}else{
				eventTime+=frameTime;
			}
			
		} // stage0
	}else if(player.chara._isLoaded==1 && player.chara.animations[0]){
		initAction(player.chara);
		scene.add( player.chara.mesh );
		console.log(player);
	}
	

	if(enemy[0].chara._isLoaded>1){
	}else if(enemy[0].chara._isLoaded==1 && enemy[0].chara.animations[0]){
		initAction(enemy[0].chara);
		scene.add( enemy[0].chara.mesh );
		console.log(enemy[0]);
	}
}

//
function setEventAgent(agent, currentTime, startTime, endTime,  position_from_, position_to_, lookPos_){
	
	let ratio_ = (currentTime-startTime)/(endTime-startTime);
	agent.position.x = position_from_.x + (position_to_.x - position_from_.x)* ratio_;
	agent.position.y = position_from_.y + (position_to_.y - position_from_.y)* ratio_;
	agent.position.z = position_from_.z + (position_to_.z - position_from_.z)* ratio_;
	agent.lookAt( lookPos_ );

}
//
function setEventCamera(currentTime, startTime, endTime,  position_from_, position_to_, lookPos_){
	
	let ratio_ = (currentTime-startTime)/(endTime-startTime);
	camera.position.x = position_from_.x + (position_to_.x - position_from_.x)* ratio_;
	camera.position.y = position_from_.y + (position_to_.y - position_from_.y)* ratio_;
	camera.position.z = position_from_.z + (position_to_.z - position_from_.z)* ratio_;
	camera.lookAt( lookPos_ );

}

function fogAnimate(frameTime, x_, y_, z_){
	let rotationX, rotationY, rotationZ;  
	for(let i = 0 ; i < fogObject.children.length ; i++) {
		rotationX =  x_ *frameTime * (Math.random()+1)/2; 
		rotationY =  y_ *frameTime * (Math.random()+1)/2; 
		rotationZ =  z_ *frameTime * (Math.random()+1)/2;   
		fogObject.children[i].rotation.x += rotationX;
		fogObject.children[i].rotation.y += rotationY;
		fogObject.children[i].rotation.z += rotationZ;
	}
}
function fogLookAt( vector ){
	for(let i = 0 ; i < fogObject.children.length ; i++) {
		fogObject.children[i].lookAt( vector );
	}
}
function fogSetPosition( center, ranges){
	for(let i = 0 ; i < fogObject.children.length ; i++) {
		fogObject.children[i].position.set(
			Math.random() * ranges.x*2 - ranges.x + center.x,
		    Math.random() * ranges.y*2 - ranges.y + center.y,
		    Math.random() * ranges.z*2 - ranges.z + center.z);
	}
}