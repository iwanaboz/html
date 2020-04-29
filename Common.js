//キーボード情報
var key_on;


// マウス情報
var mousex, mousey;
var mouseDrag=0;

// Agent object
var MyAgent = function(){
	this.position = new THREE.Vector3(0, 0, 0);	// 場所
	this.viewVect = new THREE.Vector3(0, 0, 0); // 向いている方向
	this.rotationUp = 0;						// 向いている上下の角度
	this.rotationRight = THREE.Math.degToRad( -90 );// 向いている水平方向の角度
	
	// 向いている角度から向いている方向を計算する
	this.updateView = function(){
		var y_ = Math.sin(this.rotationUp);
		var x_ = Math.cos(this.rotationUp) * Math.cos(this.rotationRight);
		var z_ = Math.cos(this.rotationUp) * Math.sin(this.rotationRight); 
		this.viewVect = new THREE.Vector3(x_, y_, z_);
	}
}