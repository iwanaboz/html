
//main loop
function mainLoop(frameTime, update_action_, aframeTime) {
	
	if(player.chara._isLoaded>1){
		// playerAction.js
		timeOfUserActionProc = userMove(frameTime, player);
		if(update_action_){
			timeOfUserAnimationProc	= updateAction(aframeTime, player);
		}
		cameraUpDate(player);
		
	}else if(player.chara._isLoaded==1 && player.chara.animations[0]){
		initAction(player.chara);
		console.log(player);
	}
	
	if(script_version>11){
		for (let i=0;i<1;i++){
			// 他キャラ
			if(friend[i].chara._isLoaded>1){
				// playerAction.js
					timeOfFriendActionProc += npcMove(frameTime, friend[i]);
					if(update_action_){
						timeOfFriendAnimationProc += updateAction(aframeTime, friend[i]);
					}
			}else if(friend[i].chara._isLoaded==1 && friend[i].chara.animations[i]){
				initAction(friend[i].chara);
				console.log(friend[i]);
			}
		}
	}
	
	
}