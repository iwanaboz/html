/*
aiueo	
*/
var player = new Array(5);	

// (_id, _x, _y, _img, _name, _type, _size)
 player[1] = new AGENT(1, 1, 1,"player1","みお",  0, 25);
 player[1].sklset = [4,1,5];
 player[1].maxhp=8;
 
 player[2] = new AGENT(2, 2, 5,"player2","ひぎり",  0, 25);
 player[2].sklset = [0,3,3];
 player[2].agi = 2.5;
 player[2].btlstyle = 1;
 player[2].cpulv = 2;

 player[3] = new AGENT(3, 2, 5,"player3","",  0, 25);
 player[3].agi = 2;
 player[3].btlstyle = 1;
 player[3].cpulv = 4;

 player[4] = new AGENT(4, 2, 5,"player4","",  0, 25);
 player[4].agi = 2;
 player[4].btlstyle = 1;
 player[4].cpulv = 4;

 
 var enemy = new Array(5);	
 enemy[1]  = new AGENT(5, 14, 6,"enemy1","テスト",   1, 25);
 enemy[2]  = new AGENT(6, 10,10,"enemy2","テスト2",   1, 25);
 enemy[3]  = new AGENT(7, 10,10,"enemy3","テスト3",   1, 25);
 enemy[4]  = new AGENT(8, 10,10,"enemy4","テスト4",   1, 25);

 
 // Temp
var MapTmp = new Array(26);
var iMapTmp = new Array(26);
var oMapTmp = new Array(26);	


 
//
for (var id=1; id < 9; id++) {
	LyrAdd("wep"+id+"_1",  headURL2+"turn_c25.gif",  5,10,25,25,  1);
	LyrAdd("wep"+id+"_2",  headURL2+"turn_c25.gif",  5,10,25,25,  1);
	LyrAdd("wep"+id+"_3",  headURL2+"turn_c25.gif",  5,10,25,25,  1);
	LyrAdd("wep"+id+"_4",  headURL2+"turn_c25.gif",  5,10,25,25,  1);
	LyrAdd("wep"+id+"_5",  headURL2+"turn_c25.gif",  5,10,25,25,  1);
	
	LyrAdd("chg"+id,  headURL2+"turn_c5.gif",   5,10,40,40,  1);
	LyrAdd("bst"+id,  headURL2+"bst_c40.gif",   5,10,40,40,  1);
}




// x,y, w,h
LyrAdd("enemy1",  headURL2+"smikIC1.gif",5,10,25,25,1);
LyrAdd("enemy2",  headURL2+"hbkrIC1.gif",5,10,25,25,1);
LyrAdd("enemy3",  headURL2+"damuIC1.gif",5,10,25,25,1);
LyrAdd("enemy4",  headURL2+"damuIC1.gif",5,10,25,25,1);
LyrAdd("player1",  headURL2+"miocIC1.gif",5,10,25,25,1);
LyrAdd("player2",  headURL2+"higrIC1.gif",5,10,25,25,1);
LyrAdd("player3",  headURL2+"waprIC1.gif",5,10,25,25,1);
LyrAdd("player4",  headURL2+"srgsIC1.gif",5,10,25,25,1);
LyrAdd("oyuki",  headURL2+"oyukIC1.gif",25,50,25,25,1);
//cursor
LyrAdd("hyde",  headURL2+"hyde1.gif",   5,10,25,25,1);
LyrAdd("csor",  headURL2+"csor_c40.gif",   5,10,40,40);


// append parent layer of block and item
DivAdd( "map_bloc", 0, 0);
DivAdd( "map_item", 0, 0);




LyrAdd("frame",  headURL2+"frame.gif",0,0,768,512);
LyrAdd("msgwin",  headURL2+"msgwin.gif",0,0,768,512,1);
LyrAdd("sousa",  headURL3+"sousa2.gif",50,360,100,100);
LyrAdd("zbut",  headURL3+"zbut.gif",520,400,50,50);
LyrAdd("xbut",  headURL3+"xbut.gif",590,400,50,50);
LyrAdd("cbut",  headURL3+"cbut.gif",660,400,50,50);
LyrAdd("sbut",  headURL3+"sbut.gif",590,330,50,50);
LyrAdd("fbut",  headURL3+"fbut.gif",660,330,50,50);


DivAdd("txtbossname", 50, 0, 0);
for (var id=1; id < 16; id++) {
    id2 = id+15
    LyrAdd("bosshp"+id,     headURL2+"heart.gif",   100+id*25,  0, 25,25,  1);
    LyrAdd("bosshp"+(id2),  headURL2+"heart2.gif",  100+id*25,  0, 25,25,  1);
}
//
for (var id=1; id < 9; id++) {
	DivAdd("txtbox"+id, 450, 10, 0);
}




// status 
DivAdd( "footer_stat1", 530, 50);
DivAdd( "footer_stat2", 630, 50);

DivAdd( "footer_stat3", 530, 150);
DivAdd( "footer_stat4", 630, 150);

DivAdd( "footer_item",  530, 180);
//message or debug
DivAdd( "message",  20, 463);
DivAdd( "header",  630, 0);

LyrAdd("stage1",  headURL2+"stage1.gif",0,0,768,512,1);
LyrAdd("stage2",  headURL2+"stage2.gif",0,0,768,512,1);
LyrAdd("stage3",  headURL2+"stage3.gif",0,0,768,512,1);


LyrAdd("clear",  headURL2+"clear.gif", 0,0,768,512,1);
LyrAdd("defeated",  headURL2+"defeated.gif", 0,0,768,512,1);
LyrAdd("end",    headURL2+"end.gif",   0,0,768,512,1);

LyrAdd("title",  headURL2+"title2.gif",0,0,768,512);



// fps表示
/*
const stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top  = "0px";
canvas2d_.appendChild(stats.domElement);
*/


var listener = new THREE.AudioListener();
// create a global audio source
var sound = new THREE.Audio( listener );
var audioLoader = new THREE.AudioLoader();
var bgmBuffer =[];
//Load a sound and set it as the Audio object's buffer
audioLoader.load(  headURL+'/bgm/stage.mp3', function( buffer ) {
	bgmBuffer[0] = buffer;
    sound.setBuffer( buffer );
    sound.setLoop(true);
    sound.setVolume(0.1);
},
    // onProgress callback
    function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },

    // onError callback
    function ( err ) {
        console.log( 'error' );
    }

);
audioLoader.load( headURL+'/bgm/acmoa9.mp3', function( buffer ) {
	bgmBuffer[1] = buffer;
});
audioLoader.load( headURL+'/bgm/stage1.mp3', function( buffer ) {
	bgmBuffer[2] = buffer;
});

audioLoader.load(  headURL+'/bgm/clear.mp3', function( buffer ) {
	bgmBuffer[3] = buffer;
});
audioLoader.load(  headURL+'/bgm/defeated.mp3', function( buffer ) {
	bgmBuffer[4] = buffer;
});
audioLoader.load(  headURL+'/bgm/s2_mamoru.mp3', function( buffer ) {
	bgmBuffer[5] = buffer;
});
audioLoader.load(  headURL+'/bgm/s3_tikara.mp3', function( buffer ) {
	bgmBuffer[6] = buffer;
});

audioLoader.load(  headURL+'/bgm/s4_1_syusei.mp3', function( buffer ) {
	bgmBuffer[7] = buffer;
});
audioLoader.load(  headURL+'/bgm/s4_2_zensys.mp3', function( buffer ) {
	bgmBuffer[8] = buffer;
});
audioLoader.load(  headURL+'/bgm/s4_3_kidou.mp3', function( buffer ) {
	bgmBuffer[9] = buffer;
});

audioLoader.load(  headURL+'/bgm/s5_haijo.mp3', function( buffer ) {
	bgmBuffer[10] = buffer;
});

audioLoader.load(  headURL+'/bgm/boss.mp3', function( buffer ) {
	bgmBuffer[11] = buffer;
});

audioLoader.load(  headURL+'/bgm/sagume0.mp3', function( buffer ) {
	bgmBuffer[12] = buffer;
});

audioLoader.load(  headURL+'/bgm/sagume1.mp3', function( buffer ) {
	bgmBuffer[13] = buffer;
});



console.log(bgmBuffer)

 // skill has max 4 wepons (4motion)
 // _img, _hit_n, _actT, _stpT, _endu, _chgT, wep_n, wep_array,      _chgtxt, _acttxt

 var skldata = new Array(50);

 skldata[0] = new SKLDATA("turn_c25.gif",  3, 0.8, 1.0,  0,  0,   2, [0,1,0,0], "", "世話焼きモード起動");
 skldata[1] = new SKLDATA("skew_c50.gif",  1, 0.4, 0.1,  0,  0,   1, [2,0,0,0], "", ""); //gun
 skldata[2] = new SKLDATA("skew_c50.gif",  1, 0.8, 0.5,  0,  0,   1, [3,0,0,0], "", ""); //gre
 skldata[3] = new SKLDATA("skew_c50.gif",  1, 1.6, 0.5,  0,  0,   4, [4,5,6,7], "", ""); //missile
 skldata[4] = new SKLDATA("exp_c50.gif",   3, 0.5, 1.0,  0,  0,   1, [8,0,0,0], "", "びんた");//びんた
 skldata[5] = new SKLDATA("mioc_c40.gif",  3, 6.0, 1.0, 10,  0,   4, [9,10,11,12], "", "しんきろう！");
 


// 2d list (id, time)
var motionset = [];

// binta
// _lng, _shift, _wide, _knock, _stun, _type, yobi, _spd
motionset[8]  = new Array(11);
motionset[8][5] = new MOTION(  1.2,   10,  6,   1.0, 1.0, 0, 0, 2); 
motionset[8][4] = new MOTION(  1.2,   10, 26,   1.0, 1.0, 0, 0, 2); 
motionset[8][3] = new MOTION(  1.2,    5, 16,   1.5, 1.0, 0, 0, 2); 
motionset[8][2] = new MOTION(  1.2,    0,  6,   1.5, 1.0, 0, 0, 2); 
motionset[8][1] = new MOTION(  1.2,  - 5, 16,   1.5, 1.0, 0, 0, 2); 
motionset[8][0] = new MOTION(  1.2,  -10, 26,   1.5, 1.0, 0, 0, 2); 


// ono1
// _lng, _shift, _wide, _knock, _stun, _type, yobi, _spd
motionset[9]  = new Array(76);
motionset[10]  = new Array(76);
motionset[11]  = new Array(76);
motionset[12]  = new Array(76);
for (var it=0; it<101; it++ ){
	motionset[9][it]  = new MOTION( 2.2,  it*10,     20,  1.0, 1.0, 0, 1, 2);
	motionset[10][it] = new MOTION( 2.2,  it*10+90,  20,  1.0, 1.0, 0, 1, 2); 
	motionset[11][it] = new MOTION( 2.2,  it*10+180, 20,  1.0, 1.0, 0, 1, 2); 
	motionset[12][it] = new MOTION( 2.2,  it*10+270, 20,  1.0, 1.0, 0, 1, 2); 
}


// ono1
// _lng, _shift, _wide, _knock, _stun, _type, yobi, _spd
motionset[0]  = new Array(11);

motionset[0][8] = new MOTION(  1.8,  -80, 20,   1.0, 1.5, 0, 0, 1); 
motionset[0][7] = new MOTION(  1.8,  -70, 20,   1.0, 1.5, 0, 0, 1); 
motionset[0][6] = new MOTION(  1.8,  -60, 20,   1.0, 1.5, 0, 0, 1); 
motionset[0][5] = new MOTION(  1.8,  -50, 20,   1.0, 1.5, 0, 0, 2); 
motionset[0][4] = new MOTION(  1.8,  -40, 20,   1.0, 1.5, 0, 0, 3); 
motionset[0][3] = new MOTION(  1.8,  -25, 20,   1.5, 1.5, 0, 0, 4); 
motionset[0][2] = new MOTION(  1.8,  -20, 20,   1.5, 1.5, 0, 0, 5); 
motionset[0][1] = new MOTION(  1.8,  -15, 20,   1.5, 1.5, 0, 0, 7); 
motionset[0][0] = new MOTION(  1.8,  -10, 20,   1.5, 1.5, 0, 0, 7); 
// ono2
// _lng, _shift, _wide, _knock, _stun, _type, yobi, _spd
motionset[1]  = new Array(11);

motionset[1][8] = new MOTION(  1.8,  80, 20,   1.0, 1.5, 0, 0, 1); 
motionset[1][7] = new MOTION(  1.8,  70, 20,   1.0, 1.5, 0, 0, 1); 
motionset[1][6] = new MOTION(  1.8,  60, 20,   1.0, 1.5, 0, 0, 1); 
motionset[1][5] = new MOTION(  1.8,  50, 20,   1.0, 1.5, 0, 0, 1); 
motionset[1][4] = new MOTION(  1.8,  40, 20,   1.0, 1.5, 0, 0, 1); 
motionset[1][3] = new MOTION(  1.8,  25, 20,   1.5, 1.5, 0, 0, 3); 
motionset[1][2] = new MOTION(  1.8,  20, 20,   1.5, 1.5, 0, 0, 3); 
motionset[1][1] = new MOTION(  1.8,  15, 20,   1.5, 1.5, 0, 0, 4); 
motionset[1][0] = new MOTION(  1.8,  10, 20,   1.5, 1.5, 0, 0, 4); 

// gun1
// _lng, _shift, _wide, _knock, _stun, _type, yobi, _spd
motionset[2]  = new Array(7);
motionset[2][6] = new MOTION(  22,  0, 15,   0.4, 0.5, 1, 0, 1);
motionset[2][5] = new MOTION(  22,  0, 15,   0.4, 0.5, 1, 0, 1);
motionset[2][4] = new MOTION(  22,  0, 15,   0.4, 0.5, 1, 0, 1); 
motionset[2][3] = new MOTION(  22,  0, 15,   0.4, 0.5, 1, 0, 1); 
motionset[2][2] = new MOTION(  22,  0, 15,   0.4, 0.5, 1, 0, 1); 
motionset[2][1] = new MOTION(  22,  0, 15,   0.4, 0.5, 1, 0, 1); 
motionset[2][0] = new MOTION(  22,  0, 15,   0.4, 0.5, 1, 0, 1); 


// grenade *0.1sec
// _lng, _shift, _wide, _knock, _stun, _type, yobi, _spd
motionset[3]  = new Array(11);
motionset[3][10]= new MOTION(  18,  0, 15,   1.0, 1, 2, 0, 1); 
motionset[3][9] = new MOTION(  18,  0, 15,   1.0, 1, 2, 0, 1); 
motionset[3][8] = new MOTION(  18,  0, 15,   1.0, 1, 2, 0, 1);
motionset[3][7] = new MOTION(  18,  0, 15,   1.0, 1, 2, 0, 1); 
motionset[3][6] = new MOTION(  18,  0, 15,   1.0, 1, 2, 0, 1); 
motionset[3][5] = new MOTION(  18,  0, 15,   1.0, 1, 2, 0, 1);
motionset[3][4] = new MOTION(  0,   0, 30,   1.0, 1, 2, 0, 1); 
motionset[3][3] = new MOTION(  0,   0, 40,   1.0, 1, 2, 0, 1); 
motionset[3][2] = new MOTION(  0,   0, 40,   1.0, 1, 2, 0, 1); 
motionset[3][1] = new MOTION(  0,   0, 50,   1.0, 1, 2, 0, 1); 
motionset[3][0] = new MOTION(  0,   0, 50,   1.0, 1, 2, 0, 1); 

// missile *0.1sec
// _lng, _shift, _wide, _knock, _stun, _type, yobi, _spd
motionset[4]  = new Array(17);
motionset[4][16]= new MOTION(  8,  40, 15,   0.5, 0.5, 3, 0, 1); 
motionset[4][15]= new MOTION(  8,  40, 15,   0.5, 0.5, 3, 0, 1); 
motionset[4][14]= new MOTION(  8,  40, 15,   0.5, 0.5, 3, 0, 1);
motionset[4][13]= new MOTION(  8,  40, 15,   0.5, 0.5, 3, 0, 1); 
for (var it=5; it<13; it++ ){
	motionset[4][it]= new MOTION(  9,  0, 15,   0.5, 0.5, 3, 0, 1); 
}
motionset[4][4] = new MOTION(  0,   0, 20,   0.5, 0.5, 3, 0, 1); 
motionset[4][3] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[4][2] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[4][1] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[4][0] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 

// missile *0.1sec
// _lng, _shift, _wide, _knock, _stun, _type, yobi, _spd
motionset[5]  = new Array(17);
motionset[5][16]= new MOTION(  8,  -40, 15,   0.5, 0.5, 3, 0, 1); 
motionset[5][15]= new MOTION(  8,  -40, 15,   0.5, 0.5, 3, 0, 1); 
motionset[5][14]= new MOTION(  8,  -40, 15,   0.5, 0.5, 3, 0, 1);
motionset[5][13]= new MOTION(  8,  -40, 15,   0.5, 0.5, 3, 0, 1); 
for (var it=5; it<13; it++ ){
	motionset[5][it]= new MOTION(  9,  0, 15,   0.5, 0.5, 3, 0, 1); 
}
motionset[5][4] = new MOTION(  0,   0, 20,   0.5, 0.5, 3, 0, 1); 
motionset[5][3] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[5][2] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[5][1] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[5][0] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 

// missile *0.1sec
// _lng, _shift, _wide, _knock, _stun, _type, yobi, _spd
motionset[6]  = new Array(17);
motionset[6][16]= new MOTION(  8,  80, 15,   0.5, 0.5, 3, 0, 1); 
motionset[6][15]= new MOTION(  8,  80, 15,   0.5, 0.5, 3, 0, 1); 
motionset[6][14]= new MOTION(  8,  80, 15,   0.5, 0.5, 3, 0, 1);
motionset[6][13]= new MOTION(  8,  80, 15,   0.5, 0.5, 3, 0, 1); 
for (var it=5; it<13; it++ ){
	motionset[6][it]= new MOTION(  9,  0, 15,   0.5, 0.5, 3, 0, 1); 
}
motionset[6][4] = new MOTION(  0,   0, 20,   0.5, 0.5, 3, 0, 1); 
motionset[6][3] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[6][2] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[6][1] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[6][0] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 


// missile *0.1sec
// _lng, _shift, _wide, _knock, _stun, _type, yobi, _spd
motionset[7]  = new Array(17);
motionset[7][16]= new MOTION(  8,  -80, 15,   0.5, 0.5, 3, 0, 1); 
motionset[7][15]= new MOTION(  8,  -80, 15,   0.5, 0.5, 3, 0, 1); 
motionset[7][14]= new MOTION(  8,  -80, 15,   0.5, 0.5, 3, 0, 1);
motionset[7][13]= new MOTION(  8,  -80, 15,   0.5, 0.5, 3, 0, 1); 
for (var it=5; it<13; it++ ){
	motionset[7][it]= new MOTION(  9,  0, 15,   0.5, 0.5, 3, 0, 1); 
}
motionset[7][4] = new MOTION(  0,   0, 20,   0.5, 0.5, 3, 0, 1); 
motionset[7][3] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[7][2] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[7][1] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 
motionset[7][0] = new MOTION(  0,   0, 30,   0.5, 0.5, 3, 0, 1); 


