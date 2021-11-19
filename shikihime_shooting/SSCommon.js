//----------------------------------------
// (0) general
// (1) User Interface
// (2) camera 
// (3) motion, agent 
// (4) stage control 
//----------------------------------------
var headURL  = "./shikihime_shooting/";
var headURL2 = "./shikihime_shooting/gif/";
var headURL3 = "./shikihime_shooting/canvas/";

// time (backup)
var timeOfRendering;
var timeOfUserActionProc;
var timeOfUserAnimationProc;
var timeOfFriendActionProc;
var timeOfFriendAnimationProc;


// canvas object to avoid image dragging
var canvas2d_ = document.getElementById('canvas2d');
//canvas2d_.width = window.innerWidth;
//canvas2d_.height = window.innerHeight;
canvas2d_.width = 768;
canvas2d_.height = 512;
var ctx = canvas2d_.getContext("2d");

//----------------------------------------
// (1) User Interface
//----------------------------------------
// Keyboard info
var key_on;

// Mouse info
var mousex, mousey;
var mouseDrag=0;

// Key names
var N=0;	//up
var E=1;
var S=2;
var W=3;
var Katk1=4;
var Katk2=5;
var Katk3=6;
var Kdash=7;
var Kdfen=8;
var Ktgt =9;
var block_size =25;

// user key input (N...dfen)
var key_on;	//on off(user input)
var user_key=4;	// reflect key of direction
var user_act=0;	// reflect key of action 

// detect UI
var UIType = 0;
const ua = navigator.userAgent;
if (ua.indexOf('iPhone') > -1 || (ua.indexOf('Android') > -1 && ua.indexOf('Mobile') > -1)) {
    // smart phone
    UIType = 1;
} else if (ua.indexOf('iPad') > -1 || ua.indexOf('Android') > -1) {
    // tablet
    UIType = 2;
} else {
    // PC (0)
}
//console.log(UIType);



// button object (touch)
var MyButton = function(canvas_, X_, Y_, width_, height_, key_ ){
	this.width = width_;
	this.height = height_;
	this.radius = Math.sqrt(width_**2 + height_**2);
	this.x = X_+canvas2d_.offsetLeft;
	this.y = Y_+canvas2d_.offsetTop;
	this.centerX = X_ +  width_/2 +canvas_.offsetLeft;
	this.centerY = Y_ + height_/2 +canvas_.offsetTop;
	this.key = key_;
	this.keyUp=87;	//w
	this.keyDown=83;	//s
	this.keyLeft=68;	//a
	this.keyRight=65;	//d
	this.touchId;
	this.resetControl = function(){
		//key_on[this.keyUp]=0;
		//key_on[this.keyDown]=0;
		//key_on[this.keyLeft]=0;
		//key_on[this.keyRight]=0;
		//console.log(key_on[this.keyRight]);
	}
	this.resetButton = function(){
		key_on[this.key]=0;
	}
	this.pushButton = function(){
		key_on[this.key]=1;
	}
	this.onButtonThenPush = function(id_, x_, y_){
		if( x_ >= this.x && x_ <= this.x+this.width &&
			y_ >= this.y && y_ <= this.y+this.height ){
				key_on[this.key]=1;
				this.touchId = id_;
				console.log(this.key);
		}	
	}
}

//----------------------------------------
// (2) camera 
//----------------------------------------
var targetID =1;
var camx =0;
var camy =0;

//----------------------------------------
// (3) motion, agent 
//----------------------------------------
// each motion of bullet
 var MOTION = function( _lng, _shift, _wide, _knock, _stun, _type, _dfen, _spd){				

	this.lng = _lng;
	this.shift = _shift;
	this.wide = _wide;
	this.knock = _knock;	// knock back
	this.stun = _stun;
	this.type = _type;		// 0: infight, 1: gun, 2: grenade 3:missile
	this.dfen = _dfen;
    this.spd = _spd;
    
 }
 
 var WEAPON = function(_id, _x, _y, _img, _type, _size){
	this.x   	  = _x;					
	this.y   	  = _y;	
	this.rotationRight = THREE.Math.degToRad( -90 );
	this.on       = false;
	this.actT     = 0;				
	this.img      = _img;				
	this.size     = _size;
	this.img_offset = Math.floor((block_size -_size)/2);			
	this.imgx     = _x*block_size+this.img_offset;		
	this.imgy     = _y*block_size+this.img_offset;				
	this.type     = _type;              // 0:player 1:enemy	
	this.motion   =NaN;	// knock back
	this.hit_n    =0;
	this.guide    =0;
	this.exploded = false;	// 
	this.SetSize = function(arg){
		this.size = arg;
		this.img_offset = Math.floor((block_size - arg)/2);
	} 
 }
 	 
 var AGENT = function(_id, _x, _y, _img, _name, _type, _size){
    this.id  =_id;	//1...8
    this.x   = _x;					
    this.y   = _y;	
    this.join = 0;	
    
    this.rotationRight = THREE.Math.degToRad( -90 );// radian
    this.speed = 0;	//速度<=agi
    			
    this.img = _img;				
    this.size = _size;
    this.img_offset = Math.floor((block_size -_size)/2);			
    this.imgx= _x*block_size+this.img_offset;		
    this.imgy= _y*block_size+this.img_offset;		
    this.name = _name;			
    this.type = _type;              // 0:player 1:enemy
    this.astpT = 0;					// stop time (only moving available)
    this.stpT = 0;					// stop time 
    this.actT = 0;					// action time
    this.chgT	= 0;				// charge time
    this.act_key = 0;
    this.action = 0;				// 4...8(atk...dfen)
    this.dir_key = 4;
    this.direction = 2;				// backup
    this.agi = 4;
    this.dfen = 0;
    this.weapon =[];
    for (var it=1; it<5; it++ ){
    	this.weapon[it] = new WEAPON(_id, _x, _y, "wep"+_id+"_"+it, _type, 25);
	}
	this.wepstage =0;
    this.sklset = [0,0,0];
    this.anxT =0;
    this.cpulv=1;
    this.search_lng = 10;			//default
    this.btlstyle   = 0;
    this.item = 0;
    this.maxhp =10;
    this.maxmp =20;
    this.hp =10;
    this.mp = 0;
    this.respT = 0;
    this.boss =0;
    this.wapr =0;
    this.target=NaN;				// taget agent


 }
 
 var SKLDATA = function( _img, _hit_n, _actT, _stpT, _mp, _chgT, 
 						_wep_n, _wep_array,  _chgtxt, _acttxt){				
    this.img = _img;				
    this.size = 15;
    this.mp   = _mp;
    this.wep_n = _wep_n;
    this.wep_array = [];
    for (var it=1; it<5; it++ ){
    	this.wep_array[it] =_wep_array[it-1];	
	}
    this.actT = _actT;
    this.stpT = _stpT; //astop
    this.chgT  = _chgT;
    this.hit_n = _hit_n;
    this.motion = new Array(5);
    this.chgtxt = _chgtxt;
    this.acttxt = _acttxt;
 }

 
// get horizontal angle (radian) 
function getTatgetDirection( orig, tgt) {
	return Math.atan2(tgt.y-orig.y, tgt.x-orig.x);
}

// get euclidean distance
function getTatgetDistance( orig, tgt) {
	return Math.sqrt( (tgt.y-orig.y)*(tgt.y-orig.y) + (tgt.x-orig.x)*(tgt.x-orig.x));
}


//----------------------------------------
// (4) stage control 
//----------------------------------------
//
function Update_footer() {
    TxtSet( "footer_stat1", 2, player[1].name+"</br>HP:"+player[1].hp+"/"+player[1].maxhp+"</br>MP:"+Math.floor(player[1].mp)+"/"+player[1].maxmp)
    //TxtSet( "footer_stat2", 2, player[2].name+"</br>HP:"+player[2].hp+"/"+player[2].maxhp+"</br>MP:"+player[2].mp+"/"+player[2].maxmp)
    
    //TxtSet( "footer_stat3", 2, enemy[1].name+"</br>HP:"+enemy[1].hp+"/"+enemy[1].maxhp+"</br>MP:"+enemy[1].mp+"/"+enemy[1].maxmp)
    //TxtSet( "footer_stat4", 2, enemy[2].name+"</br>HP:"+enemy[2].hp+"/"+enemy[2].maxhp+"</br>MP:"+enemy[2].mp+"/"+enemy[2].maxmp)
    // item
    var itemtxt = ""
    if (player[1].item > 100 || player[2].item > 100){itemtxt = "かぎ"}
    //TxtSet( "footer_item", 2,"もちもの"+"</br>　"+itemtxt)
    TxtSet( "footer_item", 2,"左のアイコンをどらっぐで　いどう</br>zxc：こうげき</br>  s : だっしゅ</br>  f : たーげっとへんこう")
    	
    //LyrFal("kyho<"+(gate_x)+"_"+(gate_y)+">");
    
    //TxtSet( "message", 2,"てすてす")
}



var event_on=0;
var event_id=0;
var pause   =1;
var Init    =0;

// hp, agi, cpulv, btlstyle
// skill(3)
function ModeReset(agent){
        agent.actT  = 0;
        agent.action  = 0;
        agent.act_key  = 0;
        agent.chgT  = 0;
        agent.dfen  = 0;
        agent.respT  = 0;
        agent.item  = 0;

        for (var it=1; it <5; it++ ){
        	LyrFal(agent.weapon[it].img);
    	}
        LyrFal("chg"+agent.id);
        LyrFal("bst"+agent.id);

        TxtSet("txtbox"+agent.id, 3, "");
        hideBossHP();
        TxtSet("txtbossname", 3, "");
        LyrFal("clear");
}

// load stage 
function StageSet(){
    var id_ = event_id;
    var destination_imgx, destination_imgy;
    targetID=1;
    for (var it=1; it <5; it++ ){
        var it_ = it-1
        player[it].hp = player[it].maxhp
        player[it].mp = 0;
        player[it].target = enemy[1];
        player[it].x      = stagePosition[id_][it_*2+0];
        player[it].y      = stagePosition[id_][it_*2+1];
        if(player[it].hp>0){player[it].join = 1;}
        ModeReset(player[it]);
    }
    player[1].target = enemy[targetID];
    for (var it=1; it <5; it++ ){
        var it_ = it-1
        //TxtSet("message", 2, it);
        enemy[it].name   = enemyName[id_][it_];
        enemy[it].maxhp  = enemyStat[id_][it_*4];
        enemy[it].hp     = enemyStat[id_][it_*4];
        enemy[it].mp     = 0;
        enemy[it].agi    = enemyStat[id_][it_*4+1];
        enemy[it].cpulv  = enemyStat[id_][it_*4+2];
        enemy[it].btlstyle= enemyStat[id_][it_*4+3];
        enemy[it].x      = stagePosition[id_][it_*2+8];
        enemy[it].y      = stagePosition[id_][it_*2+9];
        enemy[it].sklset[0]=enemySkill[id_][it_*3];
        enemy[it].sklset[1]=enemySkill[id_][it_*3+1];
        enemy[it].sklset[2]=enemySkill[id_][it_*3+2];
        enemy[it].boss  =0;
        LyrReset( enemy[it].img , headURL2+enemySkin[id_][it_], 25, 25)
        if(enemy[it].hp>0){enemy[it].join = 1;}
        ModeReset(enemy[it]);
        
    }
    
}

// init stage
function SSInit() {
	LyrFal("title");
	if(sound.isPlaying){sound.stop();}
	StageSet();
	//console.log(costMap[event_id])
    MapTmp  = transposeMap( costMap[event_id]);
    oMapTmp = transposeMap( objMap[event_id] );
    iMapTmp = transposeMap(ItemMap[event_id] );

    
    GraphTmp = new Graph(MapTmp);
    CreateMap( "map_bloc", oMapTmp, headURL2, 25);
    Update_footer();
    
	// event start
	event_on=1;
    pause=0;
    //console.log(player[1]);
    for (var it=1; it <5; it++ ){
        if(enemy[it].maxhp>0){
            LyrTru("enemy"+it);
        }else{
            LyrFal("enemy"+it);
        }
    }

    Init=1;
    
}

// transpose matrix
const transposeMap = a => a[0].map((_, c) => a.map(r => r[c]));




// backup
 var map_text;
 function FileRequest( filename){
 	 
      $.ajax({
      	  type : "GET",
          url : filename,
          dataType: "text",
          success : function(data){
             map_text = $(data)[0].responseText.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '').replace(/#13/g, '').replace(/10/g, '');
          	 //console.log(map_text);     	 
	      },
          error: function(data){
          	 map_text=0;
          	 //console.log(map_text);
          }
      });
 }


 function datasplit(str){ 
    var tmp_col = new Array();
    var ret_col = new Array();
    tmp_col = str.split(/[ \t]/,6);
    for(var it=0; it<tmp_col.length; it++){
    	ret_col[it] = parseFloat(tmp_col[it]);
    }
    return ret_col;
 }
	