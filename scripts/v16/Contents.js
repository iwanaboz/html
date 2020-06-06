
// ボタン関係の画像( 実体は mousecallback.js)
let ctx = canvas2d_.getContext("2d");
const sousa = new Image();
sousa.src = "./canvas/sousa.png";  // 画像のURLを指定
const space = new Image();
space.src = "./canvas/space.png"; 
const Fbut = new Image();
Fbut.src = "./canvas/F.png"; 
const Gbut = new Image();
Gbut.src = "./canvas/G.png"; 

function dispButtons(){
	// スマホなら表示する項目
	ctx.font = '10px Times Roman';
	if(UIType>0){
		ctx.font = '20px Times Roman';
		// control
		sousa.onload = () => {
			ctx.drawImage(sousa, 0, canvas2d_.height*0.7,
						 canvas2d_.height*0.2, canvas2d_.height*0.2);
		};
		// space
		space.onload = () => {
			ctx.drawImage(space, canvas2d_.width*0.4, canvas2d_.height*0.75,
						 canvas2d_.height*0.14, canvas2d_.height*0.14);
		};
		// F
		Fbut.onload = () => {
			ctx.drawImage(Fbut, canvas2d_.width*0.65, canvas2d_.height*0.78,
						 canvas2d_.height*0.09, canvas2d_.height*0.09);
		};
		// G
		Gbut.onload = () => {
			ctx.drawImage(Gbut, canvas2d_.width*0.85, canvas2d_.height*0.78,
						 canvas2d_.height*0.09, canvas2d_.height*0.09);
		};
	}
}

//************************************************************
//シーン**********
var scene = new THREE.Scene();


//光源***************
const light = new THREE.DirectionalLight(0x777777, 1);
light.position.x=0.2;
light.position.z=0.2;
scene.add(light);

//mainカメラ**********
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 10, 500 );


//renderer**********
var renderer = new THREE.WebGLRenderer({ alpha: true});
renderer.setPixelRatio( window.devicePixelRatio );
//描画サイズをwindowサイズに
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('canvas3d').appendChild( renderer.domElement );


// 霧オブジェクト**********
let texture =THREE.ImageUtils.loadTexture('effects/fog.png');
let material = new THREE.MeshLambertMaterial({
  color: 0xeeeeee, 
  blending: THREE.AdditiveBlending,
  transparent: true, depthTest: false, map: texture, side : THREE.DoubleSide });

// 物体を作成
var fogObject = new THREE.Group();
fogObject.position = new THREE.Vector3(0, 0, -0);

// 形状データを作成
var numParticles = 50;
for(var i = 0 ; i < numParticles ; i++) {
	var geometry = new THREE.PlaneGeometry(160,160);
	// 0, 75, 0 +-
	var mesh = new THREE.Mesh(geometry, material);
	mesh.sortParticles = false;
  	fogObject.add(mesh);
}

//フィールドマップの読み込み
var Fld_land = new MyLoadObject('models/field/Cartoon_land.3DS');


// 樽
var barrel = new MyLoadObject('models/winebarrel/winebarrel.glb');



// モーションファイル (vmd:Vocaloid Motion Data)
var motionFiles = [
	{filePath : './vmd/walk/walk.vmd', 
	loop : THREE.LoopRepeat, fadeIn: 0.0, fadeOut: 0.1, timeScale: 1 },	
	{filePath : './vmd/Lat式/Run_resized/run_斉天大聖ver1.12_short.vmd',  
	loop : THREE.LoopRepeat, fadeIn: 0.1, fadeOut: 0.1, timeScale: 1 },
	{filePath : './vmd/Lat式/Jump_resized/1.段差に飛び乗る/jump_斉天大聖ver1.12.vmd',  
	loop : THREE.LoopOnce, fadeIn: 0.1, fadeOut: 0.6, timeScale: 0.8},
	{filePath : './vmd/Kenshi風/sing-kenshi-battle-attack1_resized.vmd',  
	loop : THREE.LoopOnce, fadeIn: 0.1, fadeOut: 0.1, timeScale: 1},
	{filePath : './vmd/Lat式/Idle_resized/idle.vmd',  
	loop : THREE.LoopRepeat, fadeIn: 0.1, fadeOut: 0.1, timeScale: 1},
	{filePath : './vmd/格闘簡易作成用モーション/Albert-damaged-face.vmd',  
	loop : THREE.LoopOnce, fadeIn: 0.1, fadeOut: 0.1, timeScale: 1}
];
// モーションファイル２
var motionFiles2 = [
	{filePath : './vmd/牛鬼モーション/牛鬼移動(壱).vmd', 
	loop : THREE.LoopRepeat, fadeIn: 0.5, fadeOut: 0.1, timeScale: 0.5 },	
	{filePath : './vmd/牛鬼モーション/牛鬼移動(壱).vmd', 
	loop : THREE.LoopRepeat, fadeIn: 0.1, fadeOut: 0.1, timeScale: 1 },
	{filePath : './vmd/Lat式/Jump_resized/1.段差に飛び乗る/jump_斉天大聖ver1.12.vmd',  
	loop : THREE.LoopOnce, fadeIn: 0.1, fadeOut: 0.6, timeScale: 0.8},
	{filePath : './vmd/格闘簡易作成用モーション/Albert-combo1.vmd',  
	loop : THREE.LoopOnce, fadeIn: 0.1, fadeOut: 0.1, timeScale: 1},
	{filePath : './vmd/Lat式/Idle_resized/idle.vmd',  
	loop : THREE.LoopRepeat, fadeIn: 0.1, fadeOut: 0.1, timeScale: 1},
	{filePath : './vmd/格闘簡易作成用モーション/Albert-damaged-face.vmd',  
	loop : THREE.LoopOnce, fadeIn: 0.1, fadeOut: 0.1, timeScale: 1}
	
];

// load のためのオブジェクトを作る			
var seiten;
var miku 	= new MyCharacter('https://cdn.rawgit.com/mrdoob/three.js/r87/examples/models/mmd/miku/miku_v2.pmd', motionFiles);
var t_komainu 	= new MyCharacter('./models/t_komainu_ver132/橘狛犬1.323.pmx', motionFiles);
var oyuki 	= new MyCharacter('./models/oyuki/おゆきver1.1.pmx', motionFiles);

//
var ushioni	= new MyCharacter('./models/ushioni/牛鬼.pmx', motionFiles2);

if(physicsON==true){
	seiten = new MyCharacter('./models/seiten_ver112/斉天大聖ver1.12.pmx', motionFiles);
}else{
	seiten = new MyCharacter('./models/seiten_ver112/斉天大聖ver1.12_fewbones.pmx', motionFiles);
}
			
