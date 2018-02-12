var camera, scene, skyBoxCamera, skyBoxScene, renderer;
var geometry, material, mesh;
var controls;
var animateId;
var objects = [];
var skyBox;

var raycaster;
var blocker = document.getElementById( 'blocker' );
var backButton = document.getElementById( 'back-button');
var instructions = document.getElementById( 'instructions' );

var ControlsType = {
	MOUSE: 1,
	PHONE: 2,
	VR: 3,
  };

var controlsType = ControlsType.MOUSE;

function setControlsType(controlsTypeArg){
	controlsType = controlsTypeArg;
	
	switch(controlsTypeArg){
		case ControlsType.PHONE:
			controlsEnabled = false;
			break;
	}
}

var havePointerLock = false
if (! isMobile()) {
	havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
}

function showBlocker() {
	blocker.style.display = '-webkit-box';
	blocker.style.display = '-moz-box';
	blocker.style.display = 'box';
	instructions.style.display = '';
	// cancelAnimationFrame( animateId );
	backButton.style.display = 'none';
}

function hideBlocker() {
	blocker.style.display = 'none';
	backButton.style.display = 'inline-block';
}

if (havePointerLock) {

	var element = document.body;

	var pointerlockchange = function ( event ) {
		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
			controlsEnabled = true;
			controls.enabled = true;
			hideBlocker()
		} else {
			controls.enabled = false;
			showBlocker()
		}
	}

	var pointerlockerror = function ( event ) {
		instructions.style.display = '';
	}

	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	setControlsType(ControlsType.MOUSE);

} else {
	setControlsType(ControlsType.PHONE);
}

init();

var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var touchWalkingSpeed = 0; // walking-on-touch speed
var avg = 0;

function init() {

	// CAMERA
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	scene = new THREE.Scene();
	scene.add(camera);

	// SKYBOX
	var imagePrefix = "images/nebula2_";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	
	var backugroundSides = [];
	for (var i = 0; i < 6; i++){
		backugroundSides.push(imagePrefix + directions[i] + imageSuffix);
	};
	 
	var background = new THREE.CubeTextureLoader().load(backugroundSides);

	background.format = THREE.RGBFormat;
	scene.background = background;

	//Control Type
	function gotVRDisplays( displays ) {
		if ( displays.length > 0 ) {
			setControlsType(ControlsType.VR);

			controls = new THREE.VRControls(camera, null);
			controls.standing = true;
			//camera.position.y = 20;
		} else {
			console.warn( 'VR input not available. Using default controls.' );
		}
	}
	
	if (navigator.getVRDisplays) {
		var displays = navigator.getVRDisplays().then(gotVRDisplays).catch(function () {
			console.warn( 'VR input not available. Using default controls.' );

		});
	}

	switch(controlsType){
		case ControlsType.MOUSE:
			controls = new THREE.PointerLockControls( camera );
			scene.add(controls.getObject());
		break;

		case ControlsType.PHONE:
			controls = new THREE.DeviceOrientationControls(camera);
			controls.connect();
			camera.position.y = 10;
		break;
	}

	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;
			case 37: // left
			case 65: // a
				moveLeft = true;
				break;
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
		}
	};

	var onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;
			case 37: // left
			case 65: // a
				moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	//  walking in cardboard
	if ( isMobile() ) {
		document.addEventListener( 'touchstart', function ( event ) {
			if ( event.touches.length == 1 && event.touches.item(0).target.tagName == 'CANVAS' ) {
				moveForward = true;
			}
		}, false );
		document.addEventListener( 'touchend', function ( event ) {
			moveForward = false;
		}, false );
	}

	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

	var upperLight = new THREE.PointLight( 0xffdddd, 2, 300 );
	upperLight.position.set( 0, 170, 0 );
	scene.add( upperLight );
	
	// floor
	geometry = new THREE.PlaneGeometry( 800, 800, 100, 100 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
		var vertex = geometry.vertices[ i ];
		vertex.x += Math.random() * 20 - 10;
		vertex.y += Math.random() * 2;
		vertex.z += Math.random() * 20 - 10;
	}

	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	}

	material = new THREE.MeshLambertMaterial( { vertexColors: THREE.VertexColors } );
	material.transparent = true;
	material.opacity = 0.35;
	

	/* var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } ); */
	mesher = new THREE.Mesh( geometry, material );
	scene.add( mesher );

	geometry = new THREE.BoxGeometry( 15, 15, 15 );
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	}

	//renderer = new THREE.WebGLRenderer();
	renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
	var effect = new THREE.VREffect(renderer);
	effect.setSize(window.innerWidth, window.innerHeight);

    manager = new WebVRManager(renderer, effect);
	// renderer.setClearColor( 0x000000, 0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	// renderer.autoClear = false;

	window.addEventListener( 'resize', onWindowResize, false );

	//document.getElementById("post").style.height=window.innerHeight-400+'px';
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	//document.getElementById("post").style.height=window.innerHeight-400+'px';

}

var PI_2 = Math.PI / 2;

function animate() {

	animateId = requestAnimationFrame( animate );

	var time = performance.now();
	var delta = ( time - prevTime ) / 1000;

	switch(controlsType){
		case ControlsType.PHONE:
			controls.update();
			touchWalkingSpeed -= touchWalkingSpeed * 10.0 * delta;

			if ( moveForward ) {
				touchWalkingSpeed -= 400.0 * delta;
				camera.translateZ( touchWalkingSpeed * delta );
				camera.position.y = 10;
			}
		break;

		case ControlsType.VR:
			controls.update();
			//camera.position.y = 10;

			var listenerX = Math.cos(camera.rotation.y+PI_2)*PI_2;
			var listenerZ = -Math.sin(camera.rotation.y+PI_2)*PI_2;
			var listenerY = Math.max( - PI_2, Math.min( PI_2, camera.rotation.x ) );
			
			if(!isNaN(listenerX) && !isNaN(listenerZ) && !isNaN(listenerY)){
				listener.setOrientation(listenerX, listenerY, listenerZ, 0, 1, 0);
			}

			listener.setPosition(camera.position.x, camera.position.y, camera.position.z);
		break;
	}

	for (var i=0; i<speakers.length;i++) {
		speakers[i].analyzitor();
	}

	if ( controlsEnabled && controlsType != ControlsType.VR) {
		var yawObject = controls.getObject();

		raycaster.ray.origin.copy( yawObject.position );
		raycaster.ray.origin.y -= 10;

		var intersections = raycaster.intersectObjects( objects );

		var isOnObject = intersections.length > 0;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * 70.0 * delta; // 100.0 = mass

		if ( moveForward ) velocity.z -= 400.0 * delta;
		if ( moveBackward ) velocity.z += 400.0 * delta;

		if ( moveLeft ) velocity.x -= 400.0 * delta;
		if ( moveRight ) velocity.x += 400.0 * delta;

		if ( isOnObject === true ) {
			velocity.y = Math.max( 0, velocity.y );

			canJump = true;
		}

		yawObject.translateX( velocity.x * delta );
		yawObject.translateY( velocity.y * delta );
		yawObject.translateZ( velocity.z * delta );

		//skyBox.position.copy( controls.getObject().position );

		if ( yawObject.position.y < 10 ) {
			velocity.y = 0;
			yawObject.position.y = 10;
			canJump = true;
		}

		var pitchObject = yawObject.children[0];

		var listenerX = Math.cos(yawObject.rotation.y+PI_2)*PI_2;
		var listenerZ = -Math.sin(yawObject.rotation.y+PI_2)*PI_2;

		listener.setOrientation(listenerX, pitchObject.rotation.x, listenerZ, 0, 1, 0);
		listener.setPosition(yawObject.position.x, yawObject.position.y, yawObject.position.z);
	}

	prevTime = time;

	render();
}

function render()
{
	if (videoAdded) {
		if ( video.readyState === video.HAVE_ENOUGH_DATA )
		{
			videoImageContext.drawImage( video, 0, 0 );
			if ( videoTexture )
				videoTexture.needsUpdate = true;
		}
	}

	manager.render( scene, camera );
}

