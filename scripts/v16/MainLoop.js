
//main loop
function mainLoop(frameTime, update_action_, aframeTime) {
	
	//ぷレイヤー
	if(player.chara._isLoaded>1){
		// playerAction.js
		timeOfUserActionProc = userMove(frameTime, player);
		//if(update_action_){
		timeOfUserAnimationProc	= updateAction(aframeTime, player);
		//}
		cameraUpDate(player);
		
	}else if(player.chara._isLoaded==1 && player.chara.animations[0]){
		initAction(player.chara);
		scene.add( player.chara.mesh );
		console.log(player);
	}
	
	// 味方キャラ
	if(script_version>11){
		for (let i=0;i<1;i++){
			// 他キャラ
			if(friend[i].chara._isLoaded>1){
				// playerAction.js
					timeOfFriendActionProc += npcMove(frameTime, friend[i]);
					//if(update_action_){
					timeOfFriendAnimationProc += updateAction(aframeTime, friend[i]);
					//}
			}else if(friend[i].chara._isLoaded==1 && friend[i].chara.animations[i]){
				initAction(friend[i].chara);
				scene.add( friend[i].chara.mesh );
				console.log(friend[i]);
			}
		}
	}
	
	// 敵キャラ
	if(script_version>13){
		for (let i=0;i<1;i++){
			// 敵キャラ
			if(enemy[i].chara._isLoaded>1){
				// playerAction.js
					timeOfFriendActionProc += npcMove(frameTime, enemy[i]);
					//if(update_action_){
					timeOfFriendAnimationProc += updateAction(aframeTime, enemy[i]);
					//}
			}else if(enemy[i].chara._isLoaded==1 && enemy[i].chara.animations[i]){
				initAction(enemy[i].chara);
				scene.add( enemy[i].chara.mesh );
				console.log(enemy[i]);
			}
		}
	}
	
	// Item
	if(script_version>13){
		ItemListener(frameTime);
	}
	
}