function TDSLoad( loadobj, scale_, rotationX_, rotationY_, rotationZ_, fieldSet_ ) {
	return new Promise(resolve => {
	    let floader = new THREE.TDSLoader();
	 	floader.load( loadobj.filePath,  (object) => {
		let fldChild = object.children;
			for (let i = fldChild.length-1; i >= 0; i--){
				var m = new THREE.MeshLambertMaterial();
				m.copy( fldChild[i].material );
				m.side = THREE.DoubleSide;
				m.transparent = false;
				m.opacity = 1;
				fldChild[i].material = m;
				fldChild[i].rotation.x = THREE.Math.degToRad( rotationX_ );
				fldChild[i].rotation.y = THREE.Math.degToRad( rotationY_ );
				fldChild[i].rotation.z = THREE.Math.degToRad( rotationZ_ );
				//
				fldChild[i].scale.x = scale_;
				fldChild[i].scale.y = scale_;
				fldChild[i].scale.z = scale_;
				if(fieldSet_==true){
				 	fieldObjs.children.push(fldChild[i]);
				}
			}
			console.log(fieldObjs);
			loadobj._isLoaded =1;
			loadobj.object = object;
			field_isLoaded =1;
			resolve(object);
		});
	});
}

function GTLFLoad( loadobj, scale_, rotationX_, rotationY_, rotationZ_ ){
//glTFの読み込み
	return new Promise(resolve => {
		var gloader = new THREE.GLTFLoader();
		gloader.load( loadobj.filePath, function(data){
		    var scn = data.scene;
		    var obj = scn.children[0];
		    obj.scale.x = scale_;
	 	    obj.scale.y = scale_;
	 	    obj.scale.z = scale_;
			obj.rotation.x = THREE.Math.degToRad( rotationX_ );
			obj.rotation.y = THREE.Math.degToRad( rotationY_ );
			obj.rotation.z = THREE.Math.degToRad( rotationZ_ );
	    	for (let i = 0; i < obj.children.length; i++){
	 	    	var m = new THREE.MeshLambertMaterial();
				m.copy( obj.children[i].material );
		 	  	m.side = THREE.DoubleSide;
				m.opacity = 1;
				m.color.r= 10;
				m.color.g= 10;
				m.color.b= 10;
				obj.children[i].material = m;
			}
			loadobj._isLoaded =1;
			loadobj.object = obj;
		    resolve(obj);
		});
	});
}




// キャラクターのロード
const loader = new THREE.MMDLoader(); 
function LoadCharacter(chara, physics_){
	return new Promise(resolve => {
		loader.load( chara.modelFile, function (mesh) {
			mesh.scale.x = scaleOfWorld;
			mesh.scale.y = scaleOfWorld;
			mesh.scale.z = scaleOfWorld;
			let array = [];
			let materials = mesh.material;
			for ( let i = 0, il = materials.length; i < il; i ++ ) {
				let m = new THREE.MeshToonMaterial();
				m.copy( materials[ i ] );
				if(script_version<14){
				}else{
					m.emissive.r=0;
					m.emissive.g=0;
					m.emissive.b=0;
				}
				//m.needsUpdate = true;
				array.push( m );
			}
			mesh.material = array;
			
			//let skeleton = mesh.skeleton;
			//numBones = skeleton.bones.length;

			chara.mesh = mesh;
			// モーションファイル(vmd:Vocaloid Motion Data)
			for(let i=0;i<chara.motionFiles.length; i++){
				LoadVmd( i, chara );
			}
	        // motionをセットする
			chara.helper.add(mesh,{
		      animation: chara.animations,
		      physics: physics_,
		      //warmup  : 6,
		      unitStep : 1/80
		    });
		    chara._isLoaded =1;
		    resolve(true);
		    
	    }, onProgress, onError);
	});	    
}

// モーションファイル読み込み
function LoadVmd( motionId, chara ){
	vmdPath = chara.motionFiles[motionId].filePath;
	// アニメーションファイルを読み込む
	loader.loadAnimation(vmdPath, chara.mesh, function(vmd){
		// vmdを保持しておく
		chara.animations[motionId] = vmd.optimize();
	}, onProgress, onError);
	return true;
}

// motionのセット
function initAction(chara){
	// 全てのモーションがセットされているmixer
	let mixer = chara.helper.objects.get( chara.mesh ).mixer;
	// 全てのモーションの停止
	mixer.stopAllAction();
	for(let i=0;i<chara.motionFiles.length; i++){
		if(chara.animations[i]){
    		// ばらばらに取り出す
			let action = mixer.clipAction( chara.animations[i] );
			// Loopさせるかどうか
			action.setLoop( chara.motionFiles[i].loop );
			// ループなしなら終了後のポーズを維持
			if (chara.motionFiles[i].loop == THREE.LoopOnce){ action.clampWhenFinished = true;}
			// 再生スピード
			action.timeScale = chara.motionFiles[i].timeScale;
			// 保持しておく
			chara.actions[i] = action;
		}else{return false;}	
	}
	chara.animations = null;
	// インバースキネマティクス(IK)のhelper
	ikHelper = chara.helper.objects.get( chara.mesh ).ikSolver.createHelper();
	ikHelper.visible = false;
	//scene.add( ikHelper );
	
	//console.log(chara);
	chara._isLoaded +=1;
	return true;
}





//MMD loading progress
function onProgress( xhr ) {
  if ( xhr.lengthComputable ) {
    let percentComplete = xhr.loaded / xhr.total * 100;
    console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
  }
};

// Error MMD Load
function onError( xhr ) {
};
	
			
