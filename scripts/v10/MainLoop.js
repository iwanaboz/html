
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
	
	/*
	for (let i=0;i<3;i++){
		// 他キャラ
		if(friend[i].chara._isLoaded>1){
			// playerAction.js
			npcMove(frameTime, friend[i]);
			updateAction(frameTime, friend[i]);
			
		}else if(friend[i].chara._isLoaded==1 && friend[i].chara.animations[i]){
			initAction(friend[i].chara);
			console.log(friend[i]);
		}
	}
	*/
	
}