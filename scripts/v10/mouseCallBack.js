// マウスが動いたとき
var canvas2d_ = document.getElementById('canvas2d');
canvas2d_.addEventListener('mousemove', e => {
	//描画画面中心からの差をマウスの x, y とする
    mousex = e.clientX - canvas2d_.offsetWidth/2 - canvas2d_.offsetLeft;
    mousey = e.clientY - canvas2d_.offsetHeight/2 - canvas2d_.offsetTop;
});
// マウスが押されたとき
canvas2d_.addEventListener('mousedown', e => {
  	mouseDrag = 1;
  	//console.log( mousex +','+mousey );
});
// マウスが離されたとき
canvas2d_.addEventListener('mouseup', e => {
  	mouseDrag = 0;
});
			