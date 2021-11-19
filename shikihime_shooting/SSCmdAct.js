
// decision making 
// UserMove(frameTime, agent, mapArray)
// MapCollision( agent, mapArray)
// UserAction( frameTime, agent, mapArray)

//
// reflect player's input to agent.x, agent.y (destination)
// decision making is in SSMainLoop.js
function UserMove(frameTime, agent, mapArray){
	var mouse_angleRight = 0;
	var mouse_r = 0;
	var diffx=0;
	var diffy=0;
	
	// -------------------------------------------------
	if( mouseDrag > 0 && event_on<=0){
		mouse_angleRight = Math.atan2(mousey, mousex);
		mouse_r = Math.sqrt(mousex*mousex+mousey*mousey);
	
		// カーソル動作を反映する
		if( mouse_r > 20 && agent.stpT <= 0){
			agent.rotationRight = mouse_angleRight;
			agent.speed = agent.agi * Math.min( mouse_r/60, 1.0);
			// update destination
	        agent.x = agent.x + frameTime * agent.speed * Math.cos(agent.rotationRight);
            agent.y = agent.y + frameTime * agent.speed * Math.sin(agent.rotationRight);

            // destination is not a "Wall"
	        MapCollision(agent, mapArray);
		}
		//hoken
        if(agent.x < 0){agent.x=0;}
        if(agent.x > 24){agent.x=24;}
        if(agent.y < 0){agent.y=0;}
        if(agent.y > 19){agent.y=19;}

	}
	// update camera
	camx = agent.x - 0.2 * Math.cos(agent.rotationRight);
	camy = agent.y - 0.2 * Math.sin(agent.rotationRight);
	
}


function MapCollision( agent, mapArray){
    // block
	ix = Math.max( Math.floor(agent.x),0 )
	iy = Math.max( Math.floor(agent.y),0 )
				
	// 左上
    if(mapArray[ix][iy] <= 0 ){
		//最もい方向へ押し返す
		diffx = Math.abs(ix+1-agent.x);
		diffy = Math.abs(iy+1-agent.y);
		// 
		if( diffx < diffy && Math.cos(agent.rotationRight)<0){agent.x =ix+1;}
		if( diffx > diffy && Math.sin(agent.rotationRight)<0){agent.y =iy+1;}
    }
    // 右上
    if(mapArray[ix+1][iy] <= 0 ){
		//最もい方向へ押し返す
		diffx = Math.abs(ix-agent.x);
		diffy = Math.abs(iy+1-agent.y);
		// 
		if( diffx < diffy && Math.cos(agent.rotationRight)>0){agent.x =ix;}
		if( diffx > diffy && Math.sin(agent.rotationRight)<0){agent.y =iy+1;}
    }
    // 左下
    if(mapArray[ix][iy+1] <= 0 ){
		//最もい方向へ押し返す
		diffx = Math.abs(ix+1-agent.x);
		diffy = Math.abs(iy-agent.y);
		// 
		if( diffx < diffy && Math.cos(agent.rotationRight)<0){agent.x =ix+1;}
		if( diffx > diffy && Math.sin(agent.rotationRight)>0){agent.y =iy;}
    }
    // 右下
    if(mapArray[ix+1][iy+1] <= 0 ){
		//最もい方向へ押し返す
		diffx = Math.abs(ix-agent.x);
		diffy = Math.abs(iy-agent.y);
		// 
		if( diffx < diffy && Math.cos(agent.rotationRight)>0){agent.x =ix;}
		if( diffx > diffy && Math.sin(agent.rotationRight)>0){agent.y =iy;}
    }
    return true;
}
	
	

function ChangeTarget(){
	let _changed = 0;
	let _cnt     = 0;
	while(_changed <=0 && _cnt<4){
    	if(targetID<4){
    		targetID+=1;
	    	if(enemy[targetID].hp>0){
	    		player[1].target = enemy[targetID];
	    		_changed = 1;
	    	}
	    }else{
	    	targetID=1;
	    	if(enemy[targetID].hp>0){
	    		player[1].target = enemy[targetID];
	    		_changed = 1;
	    	}
	    }
	    _cnt+=1;
	}
	// txt
	TxtSet("txtbossname", 3, enemy[targetID].name);
	return true;
}
 
//reflect player input to the agent condition,
// act function is in TimerCtrl.js
function UserAction( frameTime, agent, mapArray){
//if(agent.id ==1){TxtSet("txtbox1", 5, key_on+"</br>"+agent.action+","+agent.actT+","+agent.stpT+","+agent.x+","+agent.y);}

    if( agent.hp <= 0){return 0;} 
    	
    // change target (player)
    if ( agent.act_key == Ktgt ){
    	ChangeTarget();
		//console.log(targetID);
		agent.act_key=0;
    }
    
	if( agent.stpT > 0){return 0;}	
    	
    
    //dash
    if ( agent.act_key == Kdash ){
    	if( agent.astpT <= 0){
            agent.action =Kdash;
            agent.actT  =0.25;
            agent.astpT =0.1;
            LyrTru("bst"+agent.id);
        }
    } // endif Kdash
    
    // atk
    if ( agent.act_key >= Katk1 && agent.act_key <= Katk3 ){
    	
    	if( agent.astpT <= 0){
	    	input_skl = skldata[agent.sklset[agent.act_key-Katk1]];
	        if(agent.mp >= input_skl.mp){
		        agent.action = agent.act_key;            
		        agent.actT  = input_skl.actT;
		        agent.astpT = input_skl.stpT;
		        agent.chgT  = input_skl.chgT;
		        //agent.stpT  = input_skl.chgT*0.5;
		        agent.mp = agent.mp-input_skl.mp;
		        
		        for (var it=1; it <input_skl.wep_n+1; it++ ){
		        	agent.weapon[it].on   = true;
		        	agent.weapon[it].exploded   = false;
		        	agent.weapon[it].actT = input_skl.actT;
		        	agent.weapon[it].guide = 2;
		        	agent.weapon[it].hit_n = input_skl.hit_n;
		        	LyrReset( agent.weapon[it].img , headURL2+input_skl.img , 25, 25);
		        }
		        
		        for (var it=1; it <5; it++ ){
		        	if(agent.weapon[it].on ){
		        		TxtSet("txtbox"+agent.id, 2, input_skl.acttxt);
		        		LyrTru(agent.weapon[it].img);
		        	}
		    	}
	    	}else{TxtSet("message", 3, "mpが足りません");}
    	}//astp
    	
    }// end if atk
    
    


}
 
 
 // NPC
function npcDecision(frameTime, agent, leader, mapArray, graph,  imapArray){
	let t0 = performance.now(); 
    if(agent.hp > 0){}else{return 0;}
    if(agent.stpT > 0){return 0;}
	if(agent.btlstyle == 3){return 0;}
    // search enemy
    agent.target =1; //default 
    let target = player[1];
    let min_cost = agent.search_lng+10; // search range+10
    let tmp_cost;
    let tmp_id = 1;	
    //for(var it=1;it<3;it++){
        // search nearest enemy
    //    if(agent.type==0){
    //        if(enemy[it].hp >0){
    //            tmp_cost = getTatgetDistance( agent, enemy[it]);
    //            if(tmp_cost<min_cost){min_cost=tmp_cost;tmp_id=it;}
    //    }
    //    }else{
    //        if(player[it].hp >0){
    //            tmp_cost = getTatgetDistance( agent, player[it]);
    //            if(tmp_cost<min_cost){min_cost=tmp_cost;tmp_id=it;}
    //    }
//    }
//      }
    // decide target
    //TxtSet("txtbox"+agent.id, 3, tmp_id+', s '+agent.actT);
    
    if(min_cost < agent.search_lng){	//find enemy
        if(agent.type==0){target = enemy[tmp_id];}else{target = player[tmp_id];}
        
    }else{							//couldnt find enemy

    }
	agent.target = target;
	if(target.dfen>0){agent.target = target.weapon[1];}
	
	//attack range (for npc)
	let atk_maxlength   = 10;
	let atk_longlength  = 7;
	let atk_shortlength = 3.5;
	
    // move to the target
    var destination_cost  = getTatgetDistance( agent, target);
    var moveTo_ene  = ( agent.type!=target.type && target.type < 3 && destination_cost >atk_shortlength);
    var moveTo_item = ( target.type == 3 );

    //TxtSet("txtbox"+agent.id, 5, moveTo_ene +","+ moveTo_frie +","+ moveTo_item);
    if( (moveTo_ene) ){
        // compare img position and destination
        // create graph bet agent and leader
        // A* serch
        //var start = graph.grid[agent.x][agent.y];
        //var end   = graph.grid[target.x][target.y];
        //var result = astar.search(graph, start, end);//GraphNode	
        
		agent.rotationRight = getTatgetDirection( agent, target);
		
		// 横に動く
		if(agent.btlstyle == 1 && destination_cost < atk_maxlength-1 && destination_cost > atk_shortlength+1){
			agent.rotationRight += THREE.Math.degToRad( 80 );
		}
		
		// update destination
        agent.x = agent.x + frameTime * agent.agi * Math.cos(agent.rotationRight);
        agent.y = agent.y + frameTime * agent.agi * Math.sin(agent.rotationRight);

        // destination is not a "Wall"
        MapCollision(agent, mapArray);

    }
	//hoken
    if(agent.x < 0){agent.x=0;}
    if(agent.x > 24){agent.x=24;}
    if(agent.y < 0){agent.y=0;}
    if(agent.y > 19){agent.y=19;}	
        	
    // action
    agent.act_key = 0;
	
    
    // attack
    if(agent.type!=target.type){
    	if( destination_cost < atk_maxlength ){
    		agent.act_key = Katk3;
    	}
    	if( destination_cost < atk_longlength ){
    		agent.act_key = Katk2;
    	}
    	if( destination_cost < atk_shortlength ){
    		agent.act_key = Katk1;
    	}
    	//console.log(agent.sklset);
        //TxtSet("txtbox"+agent.id, 3, destination_cost+', s '+agent.act_key);
    }//end agent.type!=

  
}


 
 
function SearchItem(agent, imapArray, lng){

    var sx, sy;
    var item_lng=1000;
    var item_x, item_y;
    // find the nearest item
    for(var ix=-lng;ix<=lng; ix++){
        for(var iy=-lng;iy<=lng; iy++){
            sx = Math.min( Math.max(0,agent.x+ix), 25);
            sy = Math.min( Math.max(0,agent.y+iy), 25);
            if(imapArray[sx][sy]>0 && (Math.abs(ix)+Math.abs(iy)) < item_lng){
                item_lng = Math.abs(ix)+Math.abs(iy);
                item_x=sx;
                item_y=sy;
            }
        }
    }
    // if item is found, return item as a target agent 
    if(item_lng<1000){
        //(_id, _x, _y, _img, _name, _type, _size)
        var item = new AGENT( -1, item_x, item_y, "", "item", 3, 0);
        return item;
    }else{
        return 0;
    }


}
 
 
 
 