
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
	this.helper = new THREE.MMDAnimationHelper({ afterglow: 2.0, resetPhysicsOnLoop: true });
	
}
// Agent object
var MyAgent = function(){
	this.mesh;
	this.chara = new MyCharacter(null, null);
	
	this.position = new THREE.Vector3(0, 0, 0);	// 場所
	this.viewVect = new THREE.Vector3(0, 0, 0); // 向いている方向
	this.rotationUp = 0;						// 向いている上下の角度
	this.rotationRight = THREE.Math.degToRad( -90 );// 向いている水平方向の角度
	this.lookingUp = 0;								//見ている方向
	this.lookingRight = THREE.Math.degToRad( -90 );// 見ている方向
	this.offsetPosition = new THREE.Vector3(0, 0, 0);
	this.offsetRotationUp	= 0;
	this.offsetRotationRight= THREE.Math.degToRad( 90 );
	
	this.isJoin = 0;
	this.isRunning =0;
	this.isWalking =0;
	this.isStop =1;
	this.lastMotion=0;
	this.selectMotion=0;
	this.isOnGround =1;
	this.ySpeed = 0;
	
	// 向いている角度から向いている方向を計算する
	this.updateView = function(){
		var y_ = Math.sin(this.rotationUp+this.offsetRotationUp);
		var x_ = Math.cos(this.rotationUp+this.offsetRotationUp) * Math.cos(this.rotationRight+this.offsetRotationRight);
		var z_ = Math.cos(this.rotationUp+this.offsetRotationUp) * Math.sin(this.rotationRight+this.offsetRotationRight); 
		this.viewVect = new THREE.Vector3(x_, y_, z_);
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
var fieldObjs = new THREE.Group();
var player;
var friend =[];
var enemy =[];
var scaleOfWorld;