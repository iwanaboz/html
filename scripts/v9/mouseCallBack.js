// マウスが動いたとき
renderer.domElement.addEventListener('mousemove', e => {
	//描画画面中心からの差をマウスの x, y とする
    mousex = e.clientX - renderer.domElement.offsetWidth/2 - renderer.domElement.offsetLeft;
    mousey = e.clientY - renderer.domElement.offsetHeight/2 - renderer.domElement.offsetTop;
});
// マウスが押されたとき
renderer.domElement.addEventListener('mousedown', e => {
  	mouseDrag = 1;
  	console.log( mousex +','+mousey );
});
// マウスが離されたとき
renderer.domElement.addEventListener('mouseup', e => {
  	mouseDrag = 0;
});
			