var brver;	
var NN6;	
var IE5;	 
brver = eval(0 + navigator.appVersion.charAt(0));    
NN6   = (brver >= 5 && navigator.appName=="Netscape");           
IE5   = (brver >= 4 && navigator.userAgent.indexOf("MSIE")!=-1);  

$.ajaxSetup({
beforeSend: function(xhr){
xhr.overrideMimeType("text/html;charset=Shift_JIS");
}});

function LyrTru( lyr ) {
document.getElementById( lyr ).style.visibility = "visible";}
function LyrFal( lyr ) {
document.getElementById( lyr ).style.visibility = "hidden";}


function LyrSetx( lyr , x ) {
  if ( NN6 ) {
    document.getElementById( lyr ).style.left = x+"px"; }
  if ( IE5 ) {
    document.getElementById( lyr ).style.pixelLeft = x+"px"; }
}
//　　　　　　
function LyrSety( lyr , y ) {
  if ( NN6 ) {
    document.getElementById( lyr ).style.top  = y+"px"; }
  if ( IE5 ) {
    document.getElementById( lyr ).style.pixelTop  = y+"px"; }
}

//Changing BG of layer
function BackReset( lyr , url , w, h) {

	jQuery("#"+lyr).css({ backgroundImage: 'url(' +url+')',
					 width: w,
					 height: h });
}
//Changing img of layer
function LyrReset( lyr , url , w, h) {

	jQuery("#"+lyr).children('img').attr('src', url);
	jQuery("#"+lyr).children('img').attr('width', w);
	jQuery("#"+lyr).children('img').attr('height', h);
}

//Resize layer image
function LyrResize( lyr,  w, h) {

	jQuery("#"+lyr).children('img').attr('width', w);
	jQuery("#"+lyr).children('img').attr('height', h);
}

//Add an image layer
function LyrAdd(_id, _img, _x, _y, _w, _h, _opt) {
	// div
	var visiblity = "visibility:visible;";
	if(_opt){visiblity = "visibility:hidden;";}
    var div = document.createElement('div');
	div.id = _id;
	div.style = "position:absolute;left:"+(_x)+"px;top:"+(_y)+"px;"+visiblity;
	// img
	var img = document.createElement('img');
	img.src    = _img;
	img.width  = _w;
	img.height = _h;
	img.alt    = "Img";
	div.appendChild(img);
	//div.innerHTML = '<img src='+(_img)+' width="'+(_w)+'" height="'+(_h)+'">';	
	//document.body.appendChild(div);
	jQuery("#maindisp").append(div);	
  return div;
}

//Bg
function BackAdd(_id,_img, _x, _y, _w, _h, _opt) {
	 
	var visiblity = "visibility:visible;";
	if(_opt){visiblity = "visibility:hidden";}
	var div = document.createElement('div');
	div.id = _id;
	div.style = "position:absolute;left:"+(_x)+"px;top:"+(_y)+"px;"
				+"width:"+(_w)+"px;height:"+(_h)+"px;"
				+ visiblity
				+"background-image:url("+(_img)+");";
	//document.body.appendChild(div);
	jQuery("#maindisp").append(div);
 	return div;	
 
}

// Rendering map images
var objName = ["bloc","tile","gate","kyho","goal", "mizu", "redw", "tree"];

function CreateMap(lyr, omapArray, fhead, bsize){
	// init
	jQuery("#"+lyr).html("");
	// img
	var div_tmp, img_tmp;
	for(var ix = 0;ix <25;ix++){
		for(var iy = 0;iy <20;iy++){
			if(omapArray[ix][iy] <1 || omapArray[ix][iy] >2){
				id_tmp = objName[omapArray[ix][iy]];
				div_tmp = document.createElement('div');
				div_tmp.id = id_tmp+"<"+(ix)+"_"+(iy)+">";
				div_tmp.style = "position:absolute;left:"+(ix*bsize)+"px;top:"+(iy*bsize)+"px;";
				img_tmp = document.createElement('img');
				img_tmp.src    = fhead+id_tmp+"IC1.gif";
				img_tmp.width  = bsize;
				img_tmp.height = bsize;
				img_tmp.alt    = "Img";
				div_tmp.appendChild(img_tmp);
				jQuery("#"+lyr).append(div_tmp);
				jQuery("#"+lyr).overflow = "hidden";
			}
		}
	}	
  	return true;
}

var ItemName = ["","npch","trpi","sake","noch","krak","damu","srgs","iwna"];
var ItemData = ["","ないるぱーち","てぃらぴあ","さけ","ぺーぱーのーちらす","くらーけん","だーむ","かに","いわな"]
var ItemMaxSize = ["","193てん", "85てん", "80てん", "<br/>うあるにあげよう", "201てん", "185てん","40てん<br/>さるがす「」", "42てん"];

function UpdateMapItem(lyr, imapArray, fhead, bsize){
	// init
	jQuery("#"+lyr).html("");
	// img
	var div_tmp, img_tmp, id_tmp;
	for(var ix = 0;ix<25;ix++){
		for(var iy = 0;iy<20;iy++){
            // set item 
			if(imapArray[ix][iy] >0){
				if (imapArray[ix][iy] <100){
					id_tmp =ItemName[imapArray[ix][iy]];
				}else{id_tmp = "key";}
				div_tmp = document.createElement('div');
				div_tmp.id = id_tmp+"<"+(ix)+"_"+(iy)+">";
				div_tmp.style = "position:absolute;left:"+(ix*bsize)+"px;top:"+(iy*bsize)+"px;";
				img_tmp = document.createElement('img');
				img_tmp.src    = fhead+id_tmp+"IC1.gif";
				img_tmp.width  = bsize;
				img_tmp.height = bsize;
				img_tmp.alt    = "Img";
				div_tmp.appendChild(img_tmp);
				jQuery("#"+lyr).append(div_tmp);
			}
		}
	}	
  	return true;
}

//Add empty layer
function DivAdd(_id, _x, _y, _opt) {
	var div = document.createElement('div');
	div.id = _id;
	div.style = "position:absolute;left:"+(_x)+"px;top:"+(_y)+"px;";
	//document.body.appendChild(div);
	jQuery("#maindisp").append(div);

 	return div;	
		
  if(_opt){LyrFal(_id);}
}
//

// set text
function TxtSet(id, fsize, txt){
  //document.getElementById(id).innerHTML=('<font size="'+fsize+'">'+txt+'</font>');
  jQuery("#"+id).html('<b><font size="'+fsize+'">'+txt+'</font></b>');
}