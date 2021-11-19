
// time
var timeOfRendering;
var timeOfUserActionProc;
var timeOfUserAnimationProc;
var timeOfFriendActionProc;
var timeOfFriendAnimationProc;

//キーボード情報
var key_on;

// マウス情報
var mousex, mousey;
var mouseDrag=0;
var touchInfo=[];
var touchControl=0;
var touchControlId;

// モーション（仮）
//var selectmotion = 0;

// キャラクター管理
var MyCharacter = function(modelFile_, motionFiles_){
	this.modelFile = modelFile_;
	this.motionFiles = motionFiles_;
	this.mesh;
	this.animations = [];	// 切り出すキーとなるvmd(後で破棄してもよい)
	this.actions=[];		// 切り出したaction
	this._isLoaded = 0;	//最低限変数がつくられているか
	this._isAdded=0;
	this.helper = new THREE.MMDAnimationHelper({ afterglow: 2.0, resetPhysicsOnLoop: true });
	this.offsetPosition = new THREE.Vector3(0, 0, 0);
}

var MyLoadObject = function(filePath_){
	this.filePath = filePath_;
	this.object;
	this._isLoaded = 0;
	
}

// Agent object
var MyAgent = function(){
	this.mesh;
	this.chara = new MyCharacter(null, null);
	this.type =0; //0:player, 1 friend, 2:enemy
		
	this.position = new THREE.Vector3(0, 0, 0);	// 場所
	this.viewVect = new THREE.Vector3(0, 0, 0); // 向いている方向
	this.rotationUp = 0;						// 向いている上下の角度
	this.rotationRight = THREE.Math.degToRad( -90 );// 向いている水平方向の角度
	this.lookingUp = 0;								//見ている方向
	this.lookingRight = THREE.Math.degToRad( -90 );// 見ている方向
	this.offsetPosition = new THREE.Vector3(0, 0, 0);
	this.offsetRotationUp	= 0;
	this.offsetRotationRight= THREE.Math.degToRad( 90 );
	//
	this.isJoin = 0;
	//this.isRunning =0;
	//this.isWalking =0;
	this.isStop =1;
	this.lastMotion=1;
	this.selectMotion=0;
	this.isOnGround =1;
	this.ySpeed = 0;
	this.speed = 0;
	
	this.direction = 0;
	
	//
	this.zspeed = 0;
	this.xspeed = 0;
	this.stopTime = 0;
	this.knockTime = 0;
	this.actTime = 0;
	this.knocked = new Array(5).fill(0);
	this.isKnocked = 0;
	this.weapon = new MyWeapon();
	
	// 向いている角度から向いている方向を計算する
	this.updateView = function(){
		var y_ = Math.sin(this.rotationUp+this.offsetRotationUp);
		var x_ = Math.cos(this.rotationUp+this.offsetRotationUp) * Math.cos(this.rotationRight+this.offsetRotationRight);
		var z_ = Math.cos(this.rotationUp+this.offsetRotationUp) * Math.sin(this.rotationRight+this.offsetRotationRight); 
		this.viewVect = new THREE.Vector3(x_, y_, z_);
	}
	
	this.getLookingVect = function(){
		var y_ = Math.sin(this.lookingUp+this.offsetRotationUp);
		var x_ = Math.cos(this.lookingUp+this.offsetRotationUp) * Math.cos(this.lookingRight+this.offsetRotationRight);
		var z_ = Math.cos(this.lookingUp+this.offsetRotationUp) * Math.sin(this.lookingRight+this.offsetRotationRight); 
		return new THREE.Vector3(x_, y_, z_);
	}
	
}


// Agent object
var MyWeapon = function(){
	this.position = new THREE.Vector3(0, 0, 0);
	this.knock = 500;
	this.knockTime = 0.02;
	this.stopTime  = 1.8;
	this.size  = 4;
	
}

// item object
var itemText = ['G：拾う', '', ];
var itemHoldText = ['G：投げる', '', ];


var MyItem = function(id_){
	this.id = id_;
	this.loadObj;
	this.initPosition = new THREE.Vector3(0, 0, 0);
	this.position = new THREE.Vector3(0, 0, 0);
	//this.rotation = new THREE.Vector3(0, 0, 0);
	this.offsetPosition = new THREE.Vector3(0, 0, 0);
	this.holdDirection = 1;
	this._isAdded=0;
	this.type = 0;
	this.state = 0; // 0:dropped, 1:have 2:hold 3:throw 4:wait repop
	this.ySpeed = 0;
	this.speed = 0;
	this.angle = 0;
	this.direction=1;
	this.isOnGround=1;
	this.thrownVect;
	this.coolDown=0;
	this.effect;
		
	
	this.updatePosition = function(offset_){
		if(offset_){}else{offset_ = this.offsetPosition;}
		let offsetLocal = offset_.clone().applyQuaternion(this.loadObj.object.quaternion);
		this.loadObj.object.position.x = this.position.x + offsetLocal.x;
		this.loadObj.object.position.y = this.position.y + offsetLocal.y;
		this.loadObj.object.position.z = this.position.z + offsetLocal.z;
	}
	this.updateRotation = function(lookVect){
		this.loadObj.object.lookAt(lookVect.multiplyScalar(10000*this.holdDirection));
		
	}
}

// Effect

var MyEffectObj = function(id_, video_, scale_){
	this.id = id_;
	this.type = 0;
	this.time=0;
	this.video;
	this.position = new THREE.Vector3(0, 0, 0);
	this.offsetPosition = new THREE.Vector3(0, 0, 0);
	this.scale;
	// 
	this.video = video_;
	let texture = new THREE.VideoTexture(this.video);
	let material = new THREE.SpriteMaterial({
	  color: 0xffffff,
	  opacity:0.8,
	  visible: false,
	  //side: THREE.FrontSide,
	  map: texture,
	  depthTest: true,
	  transparent: true,
	  blending: THREE.AdditiveBlending
	});
	
	this.sprite = new THREE.Sprite(material);
	this.sprite.scale.y = scale_;
	this.sprite.scale.x = scale_;
	this.sprite.scale.z = scale_;
	this.updatePosition = function(){
		this.sprite.position.x = this.position.x +this.offsetPosition.x;
		this.sprite.position.y = this.position.y +this.offsetPosition.y;
		this.sprite.position.z = this.position.z +this.offsetPosition.z;
	}
	
	
}



// Agent object
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
		key_on[this.keyUp]=0;
		key_on[this.keyDown]=0;
		key_on[this.keyLeft]=0;
		key_on[this.keyRight]=0;
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
				
		}	
	}

	
}

// field
var script_version = 0; 
var stageSelect =0;
var fieldObjs = new THREE.Group();
var player;
var friend =[];
var enemy =[];
var staticItem = [];
var pEffect = [];

var scaleOfWorld;
var field_isLoaded =0;
var displayedItemId=-1;
var eventTime=0;
var physicsON=true;
var loading=1;

var eventOn=0;



// detect UI
var UIType = 0;
const ua = navigator.userAgent;
if (ua.indexOf('iPhone') > -1 || (ua.indexOf('Android') > -1 && ua.indexOf('Mobile') > -1)) {
    // スマートフォン
    UIType = 1;
    physicsON=false;
} else if (ua.indexOf('iPad') > -1 || ua.indexOf('Android') > -1) {
    // タブレット
    UIType = 2;
} else {
    // PC
}

// canvas object for 2d rendering
var canvas2d_ = document.getElementById('canvas2d');
canvas2d_.width = window.innerWidth;
canvas2d_.height = window.innerHeight;
