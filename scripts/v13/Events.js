var flareColor = new THREE.Color(0xffaacc);

var darkFog = new THREE.Fog(0x222222, 0.1, 300);
//main loop
let eventTime=0;
function eventLoop(frameTime, update_action_, aframeTime) {
	
	//ぷレイヤー
	if(player.chara._isLoaded>1){
		if(eventTime> 2.0){
		if(eventTime< 9.0){
			let sin2_ = Math.sin(eventTime*5)*Math.sin(eventTime*50);
			scene.fog = darkFog;
			let intensity_ = 0.9+0.2*sin2_;
			light.intensity = intensity_;
			setEventCamera(eventTime, 5.0, 9.0,  new THREE.Vector3(-10, 50, 150), new THREE.Vector3(-40, 50, 150), new THREE.Vector3(10, 0, -100));
			setEventAgent(player.chara.mesh, eventTime, 5.0, 9.0,  new THREE.Vector3( 0, 3, -16), new THREE.Vector3( 0, 3, -80), new THREE.Vector3(10, 0, -100));
			player.selectMotion = 0;
		}
		}
		timeOfUserAnimationProc	= updateAction(aframeTime, player);
		eventTime+=frameTime;
		
	}else if(player.chara._isLoaded==1 && player.chara.animations[0]){
		initAction(player.chara);
		scene.add( player.chara.mesh );
		console.log(player);
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