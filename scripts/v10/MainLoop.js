
//main loop
function mainLoop(frameTime) {
	
	if(player.chara._isLoaded>1){
		// playerAction.js
		if(script_version<13){userMove(frameTime, player);}
		updateAction(frameTime, player);
		cameraUpDate(player);
		
	}else if(player.chara._isLoaded==1 && player.chara.animations[0]){
		initAction(player.chara);
		console.log(player);
		//friend[0].chara = player.chara.clone();
	}
	
	if(script_version>11 && script_version<13){
		for (let i=0;i<1;i++){
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
	}
	
	
}