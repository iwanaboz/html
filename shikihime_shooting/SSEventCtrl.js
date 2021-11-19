var event_cnt=0;
var charge_cnt=1;
let vol=0.1;

function stageClear(){
    pause=1;

	LyrTru("clear");
    if(sound.isPlaying){sound.stop();}
    sound.setBuffer( bgmBuffer[3] );
    sound.setVolume( 0.1 );
	sound.play();
	
	//ending
	//if(event_id==4){event_id=4;}
		
    waitID = setTimeout( SSInit , 2000 );
	
    return true;
}    

function stageEvent(){
	event_on=1;
	pause=0;
	if(sound.isPlaying){sound.stop();}
    return true;
}    

function gameOver(){
    event_on=1;
	pause=0;
	event_id=99;
	if(sound.isPlaying){sound.stop();}
	ModeReset(player[1]);
	for (var it=1; it<5; it++ ){
	   ModeReset(enemy[it]);
    }
	
    return true;
}  

    
function hideBossHP(){
    for (var it=1; it<=20; it++ ){
            LyrFal("bosshp" + it  );
    }
}
function updateBossHP(agent){
    for (var it=1; it<=20; it++ ){
        if(agent.hp < it){
            LyrFal("bosshp" + it  );
        }else{
            LyrTru("bosshp" + it  );
        }
    }
}

function hpCharge(frameTime, agent){
    if (agent.maxhp > charge_cnt){
        charge_cnt = charge_cnt+10*frameTime;//  n/sec
        var id2 = Math.floor(charge_cnt);
        LyrTru("bosshp" + id2  );
    }
}

function eventStart( frameTime, _id){
    //TxtSet("message", 2, event_cnt);
    
    if(_id==99){
    	if( event_cnt > 0 ){
           if( Math.floor(event_cnt*20)%2 ==0){LyrTru("player1");}else{LyrFal("player1");} 
        }
    	if( event_cnt <=0 ){
    		TxtSet("txtbox"+player[1].id, 2, "……ひぎり……");	 
    		if(sound.isPlaying){sound.stop();} 
		}else if(event_cnt <= 3.0){
			event_id=0;
	    	if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[4] );//stage1
	    		sound.setVolume( 0.1 );
	    		sound.setLoop(false);
	    		sound.play();
    		}
    	}else{
    			LyrTru("defeated");
    	}
    }
    
    // ending
    if(_id==4){
    	UserMove(frameTime, player[1], MapTmp)
    	SmoothMove(frameTime, player[1], 0);	// 
		//SmoothMove(frameTime, player[2], 0);	// 
		SmoothMove(frameTime, enemy[1], 0);	// 
		SmoothMove(frameTime, enemy[2], 0);	// 
		SmoothMove(frameTime, enemy[3], 0);	// 
		SmoothMove(frameTime, enemy[4], 0);	// 
		MapRender();
        if( event_cnt <=0 ){
        	//TxtSet("message", 2, "aaa");
			LyrFal("csor");
			LyrTru("enemy1");
            LyrTru("enemy2");
            LyrTru("enemy3");
            LyrTru("enemy4");
            LyrTru("player1");
            LyrFal("player2");
        }else if (event_cnt <= 1.5){
        	//wait  
        	if(sound.isPlaying){sound.stop();}
        	//LyrTru("stage2");
		}else if (event_cnt <= 2.5){
			if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[12] );//
	    		sound.play();
	    		//console.log(sound);
    		}
    	}else if (event_cnt <= 4.5){
    		TxtSet("txtbox"+player[1].id, 2, "……たーちばなくーん…");
    		player[1].y = player[1].y -0.8*frameTime;	  
       	}else if (event_cnt <= 7.5){
       		TxtSet("txtbox"+player[1].id, 2, "……たーちばなくーん…</br>　…あーそーぼー…");
       		player[1].y = player[1].y -0.8*frameTime;
       	}else if (event_cnt <= 13.7){
			player[1].y = player[1].y -0.4*frameTime;
       	}else if (event_cnt <= 17.0){
       		TxtSet("txtbox"+player[1].id, 2, "");
       		TxtSet("txtbox"+enemy[1].id, 2, "ｻｰｧｸﾞﾒｪｪｪｰ");
       	}else if (event_cnt <= 20.0){
       		TxtSet("txtbox"+enemy[1].id, 2, "ｻｰｧｸﾞﾒｪｪｪｰ ｻｰｸﾞｰﾒｰ");
       	}else if (event_cnt <= 22.5){
       		TxtSet("txtbox"+enemy[1].id, 2, "ｻｰｧｸﾞﾒｪｪｪｰ ｻｰｸﾞｰﾒｰ</br>ｻｰｸﾞｰﾒｯ!");	
       	}else if (event_cnt <= 23.5){
       		TxtSet("txtbox"+enemy[1].id, 2, "ｻｰｧｸﾞﾒｪｪｪｰ ｻｰｸﾞｰﾒｰ</br>ｻｰｸﾞｰﾒｯ! って");	
       	}else if (event_cnt <= 24.0){
       		TxtSet("txtbox"+enemy[1].id, 2, "ｻｰｧｸﾞﾒｪｪｪｰ ｻｰｸﾞｰﾒｰ</br>ｻｰｸﾞｰﾒｯ! って</br>いいｨｨｨｰなｧｧｧｰ");	
       		TxtSet("txtbox"+enemy[2].id, 3, "♪");
       		TxtSet("txtbox"+enemy[3].id, 3, "♪");
       		TxtSet("txtbox"+enemy[4].id, 3, "♪");
       		TxtSet("txtbox"+player[1].id, 2, "♪");
       	}else if (event_cnt <= 30.0){
       	}else if (event_cnt <= 32.0){
       		
			if(sound.isPlaying){sound.stop();}
			if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[13] );//ending
	    		sound.setLoop(false);
	    		sound.play();
	    		
    		}
       	}else if (event_cnt <= 33.0){
       		LyrTru("end");	
		}else if (event_cnt >= 1){  

            //event_on=0;
            //event_cnt=0;
            return 0;
        }
    }
    // 雪の国　入口
    if(_id==0){
    	UserMove(frameTime, player[1], MapTmp)
    	SmoothMove(frameTime, player[1], 0);	// 
		SmoothMove(frameTime, player[2], 0);	// 
		SmoothMove(frameTime, enemy[1], 0);	// 
		SmoothMove(frameTime, enemy[2], 0);	// 
		MapRender();
        if( event_cnt <=0 ){
        	//TxtSet("message", 2, "aaa");

			LyrFal("csor");
            LyrFal("enemy1");
            LyrFal("enemy2");
            LyrTru("player1");
            LyrTru("player2");
			
        }else if (event_cnt <= 0.5){
        	//wait  
        	LyrTru("stage1");
        	if(sound.isPlaying){sound.stop();}
	    }else if(event_cnt <= 5.2){
	    	//wait 
	    	//isPlaying, stop
	    	if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[0] );
	    		sound.play();
    		}
        }else if (event_cnt <= 5.5){
        	LyrFal("stage1");
        	if(sound.isPlaying){sound.stop();}
		}else if (event_cnt <= 6.5){
			if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[2] );//stage1
	    		sound.play();
    		}
    	}else if (event_cnt <= 7.5){
    		TxtSet("txtbox"+player[2].id, 2, "みおさん　10しゅうねんは");	  
       	}else if (event_cnt <= 9.0){
       		TxtSet("txtbox"+player[2].id, 2, "みおさん　10しゅうねんは</br>わかさぎ　ぱーてぃに　しましょう！");
       	}else if (event_cnt <= 10.0){
       		TxtSet("txtbox"+player[1].id, 2, "……まかせて！");
       	}else if (event_cnt <= 11.0){
       		//TxtSet("txtbox"+player[1].id, 2, "</br>……まかせて！");
       		player[1].y = player[1].y -1.5*frameTime;
       	}else if (event_cnt <= 12.0){
       		TxtSet("txtbox"+player[1].id, 2, "……まかせて！</br>…かっとばして…いく");
       		player[1].y = player[1].y -3*frameTime;
       		let destinate_x = player[1].imgx - player[1].img_offset;
	        let destinate_y = player[1].imgy - player[1].img_offset;
	        LyrSetx("bst1", destinate_x -8);
	        LyrSety("bst1", destinate_y -8);
	        LyrTru("bst1");
	    }else if (event_cnt <= 13.0){
	       LyrTru("enemy1");
	       TxtSet("txtbox"+player[1].id, 2, "……あっ");
		}else if (event_cnt >= 1){  
            TxtSet("txtbox1", 2, "");
            TxtSet("txtbox2", 2, "");
            LyrTru("enemy1");
            LyrTru("enemy2");
            LyrFal("bst1");
            LyrTru("csor");
            LyrTru("txtbossname");
            TxtSet("txtbossname", 3, enemy[targetID].name);
            event_on=0;
            event_cnt=0;
            return 0;
        }
    }//
    
    //立花　入口
    if(_id==1){
    	UserMove(frameTime, player[1], MapTmp)
    	SmoothMove(frameTime, player[1], 0);	// 
		//SmoothMove(frameTime, player[2], 0);	// 
		SmoothMove(frameTime, enemy[1], 0);	// 
		SmoothMove(frameTime, enemy[2], 0);	// 
		SmoothMove(frameTime, enemy[3], 0);	// 
		SmoothMove(frameTime, enemy[4], 0);	// 
		MapRender();
        if( event_cnt <=0 ){
        	//TxtSet("message", 2, "aaa");
			LyrFal("csor");
			LyrFal("enemy1");
            LyrFal("enemy2");
            LyrFal("enemy3");
            LyrFal("enemy4");
            LyrTru("player1");
            LyrFal("player2");
        }else if (event_cnt <= 0.5){
        	//wait  
        	if(sound.isPlaying){sound.stop();}
        	LyrTru("stage2");
	    }else if(event_cnt <= 5.2){
	    	//wait 
	    	//isPlaying, stop
	    	if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[0] );
	    		sound.play();
    		}
        }else if (event_cnt <= 5.5){
        	LyrFal("stage2");
        	if(sound.isPlaying){sound.stop();}
		}else if (event_cnt <= 6.5){
			if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[2] );//stage2
	    		sound.play();
	    		console.log(sound);
    		}
    	}else if (event_cnt <= 7.5){
    		TxtSet("txtbox"+player[1].id, 2, "……ここが");	  
       	}else if (event_cnt <= 8.0){
       		TxtSet("txtbox"+player[1].id, 2, "……ここが　たちばなくんの");
       	}else if (event_cnt <= 10.0){
       		TxtSet("txtbox"+player[1].id, 2, "……ここが　たちばなくんの</br>　　はうすね");
       	}else if (event_cnt <= 11.0){
       		//TxtSet("txtbox"+player[1].id, 2, "</br>……まかせて！");
       		player[1].y = player[1].y -1.5*frameTime;
       	}else if (event_cnt <= 13.0){
       		TxtSet("txtbox"+player[1].id, 2, "");	  
       		LyrTru("enemy1");
            LyrTru("enemy2");
            LyrTru("enemy3");
            LyrTru("enemy4");
       		sound.setVolume( Math.max(0.1*0.5*(13-event_cnt),0) );
       		player[1].y = player[1].y -1.0*frameTime;
       	}else if (event_cnt <= 16.0){
       		if(sound.isPlaying){sound.stop();}
       		LyrTru("msgwin");
       		TxtSet("message", 4, "　　　???: おまえたちは　なぜ　あらわれる");
       		player[1].y = player[1].y -1.0*frameTime;
       	}else if (event_cnt <= 18.0){
       		TxtSet("message", 4, "　　　???: なぜ　10しゅうねんの　じゃまを　する");
       		player[1].y = player[1].y -1.0*frameTime;
		}else if (event_cnt >= 1){  
			LyrFal("msgwin");
			TxtSet("message", 4, "");
            TxtSet("txtbox1", 2, "");
            TxtSet("txtbox2", 2, "");
            
            LyrFal("bst1");
            LyrTru("csor");
            LyrTru("txtbossname");
            TxtSet("txtbossname", 3, enemy[targetID].name);
            event_on=0;
            event_cnt=0;
            return 0;
        }
    }//
    
    
    
    //立花　入口
    if(_id==1.5){
    	UserMove(frameTime, player[1], MapTmp)
    	SmoothMove(frameTime, player[1], 0);	// 
		//SmoothMove(frameTime, player[2], 0);	// 
		SmoothMove(frameTime, enemy[1], 0);	// 
		SmoothMove(frameTime, enemy[2], 0);	// 
		SmoothMove(frameTime, enemy[3], 0);	// 
		SmoothMove(frameTime, enemy[4], 0);	// 
		MapRender();
        if( event_cnt <=0 ){
	    }else if(event_cnt <= 0.5){
	    	//wait 
	    	//isPlaying, stop
	    	if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[5] );
	    		sound.setVolume( 0.01 );
	    		sound.play();
    		}
    		LyrTru("msgwin");
    		TxtSet("message", 4, "　　　???: わたしは　まもるために　うみだされた");
    	}else if (event_cnt <= 3.5){
    		sound.setVolume( 0.1 );
    		player[1].y = player[1].y -1.0*frameTime;
        }else if (event_cnt <= 6.0){
        	TxtSet("message", 4, "　　　???: わたしの　しめいを　まもり");
        }else if (event_cnt <= 7.5){
        	TxtSet("message", 4, "　　　???: わたしの　しめいを　まもり</br>　　　　　　このせかいを　まもる");
        }else if (event_cnt <= 7.8){
        	if(sound.isPlaying){sound.stop();}
		}else if (event_cnt >= 1){ 
			LyrFal("msgwin");
			TxtSet("message", 4, ""); 
			event_on=0;
            event_cnt=-1;
            return 0;
        }
    }//
    
    
    
    //てのりさぐめx2
    if(_id==2){
    	UserMove(frameTime, player[1], MapTmp)
    	SmoothMove(frameTime, player[1], 0);	// 
		//SmoothMove(frameTime, player[2], 0);	// 
		SmoothMove(frameTime, enemy[1], 0);	// 
		SmoothMove(frameTime, enemy[2], 0);	// 
		SmoothMove(frameTime, enemy[3], 0);	// 
		SmoothMove(frameTime, enemy[4], 0);	// 
		MapRender();
        if( event_cnt <=0 ){
			LyrFal("csor");
			LyrFal("enemy1");
            LyrFal("enemy2");
            LyrFal("player1");
            LyrFal("player2");
            LyrTru("hyde");
            LyrSetx("hyde", enemy[1].imgx);
            LyrSety("hyde", enemy[1].imgy);
        }else if (event_cnt <= 1.5){
        	//wait  
        	if(sound.isPlaying){sound.stop();}
        	player[1].x = enemy[1].x+1;
        	player[1].y = enemy[1].y+1;
        	
	    }else if(event_cnt <= 7.0){
	    	//wait 
	    	//isPlaying, stop
	    	if(sound.isPlaying==false){
	    		LyrTru("msgwin");
	    		TxtSet("message", 4, "　　　???: ちからを　もちすぎた　もの");
	    		LyrTru("enemy1");
	    		sound.setBuffer( bgmBuffer[6] );
	    		sound.play();
    		}
    		if(event_cnt <= 4.5){
	    		player[1].x -=0.1*frameTime;
		    	player[1].y -=0.5*frameTime;
		    	LyrSetx("hyde", enemy[1].imgx);
            	LyrSety("hyde", enemy[1].imgy+10*(event_cnt-1.5));
		    }
    	}else if (event_cnt <= 7.3){
    		player[1].x = enemy[2].x-1;
        	player[1].y = enemy[2].y+1;	
        	LyrSetx("hyde", enemy[2].imgx);
            LyrSety("hyde", enemy[2].imgy);
			LyrTru("enemy2");
		}else if (event_cnt <= 8.3){
			TxtSet("message", 4, "　　　???: ちつじょを　はかいする　もの");
		}else if (event_cnt <= 12.5){
			if(event_cnt <= 10.3){
				player[1].x +=0.1*frameTime;
		    	player[1].y -=0.5*frameTime;
		    	LyrSetx("hyde", enemy[2].imgx);
		    	LyrSety("hyde", enemy[2].imgy+10*(event_cnt-7.3));
		    }
	    }else if (event_cnt <= 12.8){
	    	
    		player[1].x  = 12;
	    	player[1].y  = 10;
		}else if (event_cnt <= 14.5){
			TxtSet("message", 4, "　　　???: ぷろぐらむには　ふようだ");
			player[1].y += 3*frameTime;
    	}else if (event_cnt <= 17.4){
    		//player[1].y += 1.5*frameTime;
    		player[1].y = 18;
    		LyrTru("player1");
    	}else if (event_cnt <= 17.7){
        	if(sound.isPlaying){sound.stop();}
        	
       	}else if (event_cnt <= 18.2){
       		if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[11] );
	    		sound.play();
    		}
       		//player[1].y = player[1].y -1*frameTime;
		}else if (event_cnt >= 1){ 
			LyrFal("msgwin");
			TxtSet("message", 4, ""); 
            TxtSet("txtbox1", 2, "");
            TxtSet("txtbox2", 2, "");
            LyrFal("hyde");
            LyrFal("bst1");
            LyrTru("csor");
            LyrTru("txtbossname");
            TxtSet("txtbossname", 3, enemy[targetID].name);
            event_on=0;
            event_cnt=0;
            return 0;
        }
    }//
    
    //boss
    if(_id==3){
    	UserMove(frameTime, player[1], MapTmp)
    	SmoothMove(frameTime, player[1], 0);	// 
		//SmoothMove(frameTime, player[2], 0);	// 
		SmoothMove(frameTime, enemy[1], 0);	// 
		SmoothMove(frameTime, enemy[2], 0);	// 
		SmoothMove(frameTime, enemy[3], 0);	// 
		SmoothMove(frameTime, enemy[4], 0);	// 
		MapRender();
        enemy[1].boss  =1;
        
        if( event_cnt <= 0 ){
             LyrFal("enemy1");
             LyrFal("enemy2");
             LyrFal("player1");
             LyrFal("player2");
             LyrFal("csor");
             
        }else if (event_cnt <= 0.5){
        	//wait  
        	if(sound.isPlaying){sound.stop();}
        	LyrTru("stage3");
	    }else if(event_cnt <= 5.2){
	    	//wait 
	    	//isPlaying, stop
	    	if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[0] );
	    		sound.play();
    		}
        }else if (event_cnt <= 5.5){
        	LyrFal("stage3");
        	if(sound.isPlaying){sound.stop();}
        	player[1].x = enemy[1].x;
        	player[1].y = enemy[1].y+1;	
        }else if (event_cnt < 6.5){ 
			//wait
            LyrTru("enemy1");
        }else if(event_cnt <= 10.0){
	    	//wait 
	    	//isPlaying, stop
	    	LyrTru("msgwin");
    		TxtSet("message", 4, "　　　ｻｸﾞﾒﾛﾎﾞ: しゅうせい　ぷろぐらむ　さいしゅうれべる");
    		LyrTru("enemy1");
	    	if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[7] );
	    		sound.play();
    		}
	    	player[1].y -=0.5*frameTime;
		}else if (event_cnt <= 12.0){//10-12
        	if(sound.isPlaying){sound.stop();}
		}else if (event_cnt < 15.0){            
            TxtSet("message", 4, "　　　ｻｸﾞﾒﾛﾎﾞ: ぜんしすてむ　ちぇっく　しゅうりょう");
            if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[8] );
	    		sound.play();
    		}
        }else if (event_cnt <= 17.0){//15-17
        	if(sound.isPlaying){sound.stop();}   
        	player[1].y = 18;	
        	LyrTru("player1");
        }else if (event_cnt < 19.1){            
            TxtSet("message", 4, "　　　ｻｸﾞﾒﾛﾎﾞ: せんとうもーど　きどう");
            if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[9] );
	    		sound.play();
    		}
    		player[1].y -=2*frameTime;
    	
    	}else if (event_cnt <= 21.1){
        	if(sound.isPlaying){sound.stop();}   
        	player[1].y -=2*frameTime;
        }else if (event_cnt < 22.1){ 
        	player[1].y -=1*frameTime;          
            if(sound.isPlaying==false){
	    		sound.setBuffer( bgmBuffer[10] );
	    		sound.play();
    		}
        }else if (event_cnt < 23.6){ 
        	LyrFal("msgwin");
			TxtSet("message", 4, "");           
            TxtSet("txtbox"+enemy[1].id, 2, "たーげっと　かくにん");
        }else if (event_cnt < 25.0){
            TxtSet("txtbox"+enemy[1].id, 2, "たーげっと　かくにん</br>はいじょ　かいし");
            
        }else if (event_cnt <= 25.3){
        	if(sound.isPlaying){sound.stop();}  
            sound.setBuffer( bgmBuffer[1] );
            sound.setVolume( 0.2 );
            sound.play();
        //}else if (event_cnt < 25.3){         	
        }else if (event_cnt < 27.0){

            hpCharge(frameTime, enemy[1]);
            TxtSet("txtbossname", 3, "ｻｸﾞﾒﾛﾎﾞ");

            
        }else{
            TxtSet("txtbox"+enemy[1].id, 2, "");
            //pause=0;
            event_on=0;
            event_cnt=-1;
            charge_cnt=1;
        }
    }//

    

    
    
    event_cnt = event_cnt+frameTime; //second
}