// timer callback funcs
// animate()
// mainLoop(frameTime, update_action_)
// SmoothMove(frameTime, agent, count)
// timeAct(frameTime, agent, mapArray)

var timerID, waitID;
var count=0;

clock = new THREE.Clock();
let time =0;
let last_frameTime=0;


function animate() {
	window.requestAnimationFrame( animate );
	// 現在の1フレームの長さを取得(20fps以下は遅延として扱う)
	var frameTime = Math.min(clock.getDelta(), 0.05);
	//
	timeOfUserActionProc		=0;
	timeOfUserAnimationProc		=0;
	timeOfFriendActionProc		=0;
	timeOfFriendAnimationProc	=0;
	//MainLoop.js
	let t0 = 0;
	let t1 = 0;
	
	t0 = performance.now(); 
	mainLoop(frameTime, true);
	t1 = performance.now(); 
	//stats.update();

	//
	timeOfRendering = t1-t0;
	if(time%30==0){
	}
	time +=1;
	if(time>10000){time=0;}
}
animate();

//main loop
function mainLoop(frameTime, update_action_) {
	
	if(pause > 0){ return 0;}
	if(Init ==0){return 0;}
	var frameRate_ = Math.round((10/frameTime)/10);
	
	
	if(event_on > 0){ 
         eventStart(frameTime, event_id);
         return 0;
    }
    
	var is=1;
	// actions (& moving action)-----------------------------------
	UserMove(  frameTime, player[is], MapTmp);	// move
	SmoothMove(frameTime, player[is], 0);	// 
	SmoothMove(frameTime, player[2], 0);	// 
	UserAction( frameTime, player[is], MapTmp);
	
	for (var it=1; it<5; it++ ){
		npcDecision(frameTime, enemy[it], enemy[1], MapTmp, GraphTmp, iMapTmp);
		SmoothMove(frameTime, enemy[it], 0);	//
		UserAction( frameTime, enemy[it], MapTmp);
	}
	// wepon
	for (var it=1; it<5; it++ ){
		// player
		if(player[is].weapon[it].actT>0){
			SmoothMove(frameTime, player[is].weapon[it], 1);	// 
		}
		// ene
		for (var iu=1; iu<5; iu++ ){  
			if(enemy[iu].weapon[it].actT>0){
				SmoothMove(frameTime, enemy[iu].weapon[it], 1);	// 
			}
		}
	}
	//map
	MapRender();
		
		
	// check agent conditions-----------------------------------
	timeAct(frameTime, player[is], MapTmp);
	agentCollision( player[is],  player[2], MapTmp, iMapTmp);
	for (var it=1; it<5; it++ ){
		timeAct(frameTime, enemy[it], MapTmp);
		//
        agentCollision( player[is],  enemy[it], MapTmp, iMapTmp);

		for (var iu=1; iu<5; iu++ ){    
			if(iu>it){agentCollision( enemy[iu],  enemy[it], MapTmp, iMapTmp);}    
			hitAct( player[is], enemy[it].weapon[iu], MapTmp, iMapTmp);
	        
	        hitAct( enemy[it], player[is].weapon[iu], MapTmp, iMapTmp);
	    }
	}
    // cursor
    if(player[is].target){

	    let tgt_imgx = player[is].target.imgx - player[is].target.img_offset;
	    let tgt_imgy = player[is].target.imgy - player[is].target.img_offset;
	    // size of chg : 40, offset :(40-25)/2
	    LyrSetx("csor", tgt_imgx -8);
	    LyrSety("csor", tgt_imgy -8);
	    
	}
	// Item
	ItemAction(player[is], MapTmp, iMapTmp, oMapTmp);
	       
	//TxtSet("message", 3, 'fps '+frameRate_+'f '+player[is].stpT);
	return 0;
	
}




//

function SmoothMove(frameTime, agent, count){
	//if(agent.hp >0){}else{return 0;}
	if(agent.join >0 || count>0){}else{return 0;}
    //移動の補間 
    var destination_imgx = (agent.x-camx)*block_size +agent.img_offset+250 ;
    var destination_imgy = (agent.y-camy)*block_size +agent.img_offset+250 ;
     // X
    agent.imgx = destination_imgx;
    agent.imgy = destination_imgy;

	//console.log(agent.hp);
    LyrSetx(agent.img, agent.imgx);
    LyrSety(agent.img, agent.imgy);
    if(count<=0){
    	LyrSetx("txtbox"+agent.id, agent.imgx+30);
    	LyrSety("txtbox"+agent.id, agent.imgy-20);		       
	}
}

function MapRender(){
	let destination_imgx = (-camx)*block_size +250 ;
    let destination_imgy = (-camy)*block_size +250 ;
	LyrSetx("map_bloc", destination_imgx);
    LyrSety("map_bloc", destination_imgy);
}


 
 
 // relative action
function agentCollision( my, ene, mapArray, imapArray){
	//push
    //let myix  = Math.floor(my.x);
    //let myiy  = Math.floor(my.y);
    //let eneix = Math.floor(ene.x);
    //let eneiy = Math.floor(ene.y);
    if( my.hp >0 && ene.hp>0){}else{return false;}
    
    let distance = Math.sqrt((my.x-ene.x)*(my.x-ene.x) + (my.y-ene.y)*(my.y-ene.y));
    //TxtSet("header", 3, 'd '+distance+'hp '+ene.hp);
    if( distance < 0.8){
        my.x -= 0.25*Math.cos(my.rotationRight);
        my.y -= 0.25*Math.sin(my.rotationRight);
        MapCollision( my, mapArray);
        if(my.id==1 && ene.type>0 && ene.btlstyle==3 && event_on<=0){
        	TxtSet("txtbox"+ene.id, 2, enemyFTxt[event_id][ene.id-5] );
        	
        }
    }
	return true;

}	 


// wep == weapon[i]
 function hitAct( my, wep, mapArray, imapArray){

    //hit
    if(my.hp >0){}else{ return false;}
    if( wep.actT>0 && wep.hit_n >0){}else{return false;}
    // decide by imgx,y

    let wlength_x = Math.abs((my.imgx-my.img_offset) - (wep.imgx-wep.img_offset));
    let wlength_y = Math.abs((my.imgy-my.img_offset) - (wep.imgy-wep.img_offset));
    
    if(wlength_x<=wep.motion.wide && wlength_y<=wep.motion.wide){
    	
        // hit
        // avoid jumping over the wall
        for (var it=0; it <= wep.motion.knock*10; it++){
            if(it==wep.motion.knock*10){break;}
            //
            dest_from = getTatgetDirection( my, wep);
            my.x -= (Math.cos(dest_from)-Math.cos(wep.rotationRight))*0.5*0.1;
            my.y -= (Math.sin(dest_from)-Math.sin(wep.rotationRight))*0.5*0.1;
            MapCollision( my, mapArray);1
            //console.log(my.x+','+my.y);
            
            my.imgx = my.x*block_size +my.img_offset;
            my.imgy = my.y*block_size +my.img_offset;

            
        } //for
        //my.actT=0;
        //my.action=0;
        wep.hit_n -=1;
        // explode
        if(wep.motion.type>0){
        	if(wep.motion.type==2 || wep.motion.type==3){
				if(wep.actT >= 0.5){
					wep.actT = 0.49;
				}
			}else{
				wep.actT = 0;
			}
        }
        
        if(my.type!=wep.type){
        	if(my.dfen >0){my.hp -=0.25;}else{my.hp -=0.5;}
            
            if(my.hp<=0 && my.respT<=0){
 
                // ending
                if (my.type==1 && event_id==6){
                    event_id = event_id+1;
                    event_on=1;
                }
                if (my.type==1){
                	ChangeTarget();
                }
                if (my.id==1){
                	//gameover
                	gameOver();
                }
                
                if(enemy[1].hp+enemy[2].hp+enemy[3].hp+enemy[4].hp<=0){
                	oMapTmp[12][1] = 4; 
                	CreateMap( "map_bloc", oMapTmp, headURL2, 26);
            	}

            }//
            //console.log(wep.motion.stun);
            // time of stun
            if(my.stpT < wep.motion.stun && my.dfen<=0){
            	if(my.id == 1){
            		my.stpT = wep.motion.stun*0.2;
            	}else{
            		my.stpT = wep.motion.stun*0.4;
            	}
            }
            Update_footer();
            if(my.type==1 && my.boss==1){
                updateBossHP(my);
            }
        }//type
        
    } //length

 return true;
 }
 
 
 
 

 
 //item
function ItemAction(agent, mapArray, imapArray, omapArray){
    // 1:Gate, 2:Keyhole, 3:Goal 4:
    // 100~:keys
    let ix = Math.floor(agent.x);
    let iy = Math.floor(agent.y);
    var foot_item = imapArray[ix][iy];
    var foot_obj  = omapArray[ix][iy];
    var gate_x, gate_y;
    if( agent.hp > 0){
        //
        // object
        if(foot_obj==4 && agent.type==0){
            //pause=1;
            player[1].item = 0
            player[2].item = 0
            event_id = Math.floor(event_id)+1;
            //TxtSet("message", 3, event_id);
            stageClear();
            
         //
        }else if(foot_obj==2){
        	event_id = event_id+0.5;
        	omapArray[ix][iy]=1;
        	stageEvent();
        	
        	/*
            if(agent.item>=100){
                // key open
                gate_y = Math.floor(agent.item/100);
                gate_x = Math.floor(agent.item-gate_y*100);
                 mapArray[gate_x][gate_y]=1;
                omapArray[gate_x][gate_y]=1;
                LyrFal("kyho<"+(gate_x)+"_"+(gate_y)+">");
            }*/
            
        }

        // get item
        if(foot_item > 0){
            if(foot_item >=100){
                //y,x
                agent.item = foot_item;
                imapArray[agent.x][agent.y]=0;
            }else if(agent.type==0){
                TxtSet("txtbox"+agent.id, 2, ItemData[foot_item]+', '+ItemMaxSize[foot_item]);
                imapArray[agent.x][agent.y]=0;
            }
            Update_footer()
            UpdateMapItem( "map_item", iMapTmp, headURL2, 25);
        }
    }

}




//--------------------------------------------------------------- 
// act function 
// check agent conditions (common)
//--------------------------------------------------------------- 
function timeAct(frameTime, agent, mapArray){
    
    //TxtSet("txtbox"+agent.id, 3, agent.hp+","+agent.stpT);
    // waiting respawn ( 1 unit: 20ms)
    if(agent.respT > 0){
        agent.respT -= frameTime;
        if(agent.respT%20==0){
            TxtSet("txtbox"+agent.id, 3, agent.respT/20);
        }
        if(agent.respT <= 0){
            TxtSet("txtbox"+agent.id, 3, "");
            agent.hp = Math.floor(agent.maxhp);
        }
    }
    
    if(agent.hp <= 0){
        agent.actT  = 0;
        agent.action  = 0;
        agent.act_key  = 0;
        agent.chgT  = 0;
        for (var it=1; it <5; it++ ){
        	agent.weapon[it].actT  = 0;
        	LyrFal(agent.weapon[it].img);
   		}
        LyrFal("chg"+agent.id);
        TxtSet("txtbox"+agent.id, 3, "");
        return 0;
    }else{
    	agent.mp += frameTime;
    	if(agent.mp > agent.maxmp){agent.mp=agent.maxmp;}
    }
    // charge motion--------------------------------------------------
    if(agent.chgT >0){
    	TxtSet("txtbox"+agent.id, 3, 'chg');
        agent.chgT=agent.chgT-frameTime;
        destinate_x = agent.imgx - agent.img_offset;
        destinate_y = agent.imgy - agent.img_offset;
        // size of chg : 40, offset :(40-25)/2
        LyrSetx("chg"+agent.id, destinate_x -8);
        LyrSety("chg"+agent.id, destinate_y -8);
        input_skl = skldata[agent.sklset[agent.action-Katk1]];
        TxtSet("txtbox"+agent.id, 2, input_skl.chgtxt);
        
        if(agent.chgT<=0){// time end
            LyrFal("chg"+agent.id);
            TxtSet("txtbox"+agent.id, 2, input_skl.acttxt);
            agent.chgT=0;
        }
        
    // action-----------------------------------------------------------
    }else if(agent.actT >0){
    	//TxtSet("txtbox"+agent.id, 3, 'action');
        var input_skl, input_motion;
        let directionX =  Math.cos(agent.rotationRight);
        let directionY =  Math.sin(agent.rotationRight);
        let deltaX = frameTime * directionX;
        let deltaY = frameTime * directionY;
        // some action is set
        if(agent.action == Kdash){
        	
        	agent.speed = agent.agi*0.6;
			// update destination
	        agent.x = agent.x + agent.speed * deltaX;
            agent.y = agent.y + agent.speed * deltaY;
            
            // destination is not a "Wall"
	        MapCollision( agent, mapArray);
	        destinate_x = agent.imgx - agent.img_offset;
	        destinate_y = agent.imgy - agent.img_offset;
	        // size of chg : 40, offset :(40-25)/2
	        LyrSetx("bst"+agent.id, destinate_x -8);
	        LyrSety("bst"+agent.id, destinate_y -8);
        
        }
        if(agent.action >= Katk1 && agent.action <= Katk3){
        	
        	input_skl = skldata[agent.sklset[agent.action-Katk1]];
        	// len, wide, angle
        	for (var it=1; it<5; it++ ){
	        	if(agent.weapon[it].actT>0){
	        		
	        		iactT = Math.floor(agent.weapon[it].actT*10);
	        		input_motion = motionset[input_skl.wep_array[it]][iactT];
	        		agent.weapon[it].motion = input_motion;
	        		agent.weapon[it].SetSize(input_motion.wide*2);
	        		LyrResize( agent.weapon[it].img,  input_motion.wide*2, input_motion.wide*2);
	        		//
	        		if(input_motion.type==0){
		        		//操作型(近接)	
		        		agent.weapon[it].rotationRight = agent.rotationRight;
		        		let shiftedX =  Math.cos(agent.rotationRight+THREE.Math.degToRad(input_motion.shift));
	        			let shiftedY =  Math.sin(agent.rotationRight+THREE.Math.degToRad(input_motion.shift));
	        			agent.x = agent.x + frameTime * shiftedX *input_motion.spd;
            			agent.y = agent.y + frameTime * shiftedY *input_motion.spd;
			        	agent.weapon[it].x = agent.x + input_motion.lng * shiftedX ;
			        	agent.weapon[it].y = agent.y + input_motion.lng * shiftedY ;
			        	agent.dfen =input_motion.dfen;
			        	//TxtSet("txtbox"+agent.id, 3, agent.dfen);
		        	}
		        	//射出型
		        	if(input_motion.type==1 || input_motion.type==2){
		        		// init
		        		if(agent.weapon[it].actT == input_skl.actT){
							// 偏差撃ちしない
		        			agent.weapon[it].rotationRight = getTatgetDirection( agent, agent.target);
		        			let shiftedX =  Math.cos(agent.weapon[it].rotationRight+THREE.Math.degToRad(input_motion.shift));
	        				let shiftedY =  Math.sin(agent.weapon[it].rotationRight+THREE.Math.degToRad(input_motion.shift));
		        			agent.weapon[it].x = agent.x + frameTime*input_motion.lng * shiftedX ;
			        		agent.weapon[it].y = agent.y + frameTime*input_motion.lng * shiftedY ;
			        		Update_footer();
			        		
		        		}else{
		        			//console.log(input_motion.lng);
		        			let shiftedX =  Math.cos(agent.weapon[it].rotationRight+THREE.Math.degToRad(input_motion.shift));
	        				let shiftedY =  Math.sin(agent.weapon[it].rotationRight+THREE.Math.degToRad(input_motion.shift));
		        			agent.weapon[it].x += frameTime*input_motion.lng * shiftedX ;
			        		agent.weapon[it].y += frameTime*input_motion.lng * shiftedY ;
			        		wep_x = Math.floor(agent.weapon[it].x);
			        		wep_y = Math.floor(agent.weapon[it].y);
			        		if(mapArray[wep_x][wep_y] < 1 ){
								if(input_motion.type==2){
									if(agent.weapon[it].actT >= 0.5){
										LyrReset( agent.weapon[it].img , headURL2+"fire_c50.gif" , 25, 25);
										agent.weapon[it].actT = 0.49;
									}
								}else{
									agent.weapon[it].actT = 0;
								}
				            }
				            if(input_motion.type==2){
					            if(agent.weapon[it].actT < 0.5 && agent.weapon[it].exploded==false){
					            	LyrReset( agent.weapon[it].img , headURL2+"fire_c50.gif" , 25, 25);
					            	agent.weapon[it].exploded=true;
					            }
					        }
				            
			        	}
		        	}//
		        	
		        	if(input_motion.type==3){
		        		//missile	
						if(agent.weapon[it].actT == input_skl.actT){
							// 偏差撃ちしない
		        			agent.weapon[it].rotationRight = getTatgetDirection( agent, agent.target);
		        			let shiftedX =  Math.cos(agent.weapon[it].rotationRight+THREE.Math.degToRad(input_motion.shift));
	        				let shiftedY =  Math.sin(agent.weapon[it].rotationRight+THREE.Math.degToRad(input_motion.shift));
		        			agent.weapon[it].x = agent.x + frameTime*input_motion.lng * shiftedX ;
			        		agent.weapon[it].y = agent.y + frameTime*input_motion.lng * shiftedY ;
			        		Update_footer();
			        		
		        		}else{
		        			//console.log("fire_c50.gif");
		        			if(agent.weapon[it].actT < 1.2 && agent.weapon[it].guide>=2){
								agent.weapon[it].rotationRight = getTatgetDirection( agent.weapon[it], agent.target);
								agent.weapon[it].guide=1;
				            }else if(agent.weapon[it].actT < 0.8 && agent.weapon[it].guide>=1){
				            	agent.weapon[it].rotationRight = getTatgetDirection( agent.weapon[it], agent.target);
								agent.weapon[it].guide=0;
				            }
				            	
		        			let shiftedX =  Math.cos(agent.weapon[it].rotationRight+THREE.Math.degToRad(input_motion.shift));
	        				let shiftedY =  Math.sin(agent.weapon[it].rotationRight+THREE.Math.degToRad(input_motion.shift));
	        				
		        			agent.weapon[it].x += frameTime*input_motion.lng * shiftedX ;
			        		agent.weapon[it].y += frameTime*input_motion.lng * shiftedY ;
			        		wep_x = Math.floor(agent.weapon[it].x);
			        		wep_y = Math.floor(agent.weapon[it].y);
			        		//exp
			        		if(mapArray[wep_x][wep_y] < 1 ){
								if(agent.weapon[it].actT >= 0.5){
									agent.weapon[it].actT = 0.49;
								}
				            }
				            
				            
				            
				            if(agent.weapon[it].actT < 0.5 && agent.weapon[it].exploded==false){
				            	LyrReset( agent.weapon[it].img , headURL2+"fire_c50.gif" , 25, 25);
				            	agent.weapon[it].exploded=true;
				            }
			        	}
		        	}
		        	agent.weapon[it].actT -= frameTime;
	        	}
				

				//


	            // if end
	        	if(agent.weapon[it].actT<=0){		// time end
		            LyrFal(agent.weapon[it].img);
	            	agent.weapon[it].actT=0;
	            	agent.dfen=0;
	            }
        	}// end for it
            //console.log('kusoo');
        }
 

        agent.actT=agent.actT-frameTime;
        if(agent.actT<=0){		// time end
            //LyrFal(agent.weapon[1].img);
            LyrFal("bst"+agent.id);
            agent.action =0;
            agent.actT=0;
            agent.dfen=0;
            
        }else if(agent.action >= Katk1 && agent.action <= Katk3){

        }
    }else{//actT<=0
        //TxtSet("txtbox"+agent.id, 3, 'others ');
        agent.action =0;
        
        if(agent.astpT >0){
            agent.astpT=agent.astpT-frameTime;
            if(agent.astpT <=0){
                //agent.weapon[1].motion = skldata[0].motion[0];
                TxtSet("txtbox"+agent.id, 2, "");
                agent.astpT=0;
                
            }
        }
        if(agent.stpT >0){
        	
            agent.stpT=agent.stpT-frameTime;
            if(agent.stpT <=0){
                //agent.weapon[1].motion = skldata[0].motion[0];
                TxtSet("txtbox"+agent.id, 2, "");
                agent.stpT=0;
            }
        }
        
    } 

}