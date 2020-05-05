
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
		//friend[0].chara = player.chara.clone();
	}
	
	
	
	// 他キャラ
	if(friend[0].chara._isLoaded>1){
		// playerAction.js
		npcMove(frameTime, friend[0]);
		updateAction(frameTime, friend[0]);
		
	}else if(friend[0].chara._isLoaded==1 && friend[0].chara.animations[0]){
		initAction(friend[0].chara);
		console.log(friend[0]);
	}
	
}