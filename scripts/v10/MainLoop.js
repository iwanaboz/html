
//main loop
function mainLoop(frameTime) {
	
	if(player.chara._isLoaded>1){
		// playerAction.js
		userMove(frameTime, player);
		updateAction(frameTime, player);
		
		cameraUpDate(player);
		
	}else if(player.chara._isLoaded==1 && player.chara.animations[0]){
		initAction(player.chara);
		console.log(player);
	}
	
}