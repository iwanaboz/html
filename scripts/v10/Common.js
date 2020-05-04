//キーボード情報
var key_on;


// マウス情報
var mousex, mousey;
var mouseDrag=0;

// モーション（仮）
var selectmotion = 0;

// Agent object
var MyAgent = function(){
	this.mesh;
	this.position = new THREE.Vector3(0, 0, 0);	// 場所
	this.viewVect = new THREE.Vector3(0, 0, 0); // 向いている方向
	this.rotationUp = 0;						// 向いている上下の角度
	this.rotationRight = THREE.Math.degToRad( -90 );// 向いている水平方向の角度
	this.lookingUp = 0;								//見ている方向
	this.lookingRight = THREE.Math.degToRad( -90 );// 見ている方向
	this.offsetPosition = new THREE.Vector3(0, 0, 0);
	this.offsetRotationUp	= 0;
	this.offsetRotationRight= 0;
	this.isRunning =0;
	this.isWalking =0;
	this.isStop =1;
	this.lastMotion=0;
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

// field
var script_version = 0; 
var fieldObjs = new THREE.Group();
