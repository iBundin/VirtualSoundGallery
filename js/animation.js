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

var controlsType = true
function setOrientationControls() {
		controlsEnabled = false;
		//controls.enabled = true;
		controlsType = false;
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

if ( havePointerLock ) {

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



} else {

	setOrientationControls();

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

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2( 0x000000, 0.005, 1850 );

	/*var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.005 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );*/

	// skyBoxCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	// skyBoxScene = new THREE.Scene();

	// SKYBOX
	var imagePrefix = "images/nebula2_";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( 1000, 1000, 1000 );

	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	// skyBoxScene.add( skyBox );
	scene.add( skyBox );


	geometry = new THREE.BoxGeometry( 10, 10, 10 );
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	}
	material = new THREE.MeshPhongMaterial( { shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
	//material = new THREE.MeshLambertMaterial( { vertexColors: THREE.VertexColors } );


	//Control Type
	if (controlsType) {
		controls = new THREE.PointerLockControls( camera );
		scene.add( controls.getObject() );
	} else {
		controls = new THREE.DeviceOrientationControls(camera);
  		controls.connect();
  		camera.position.y = 10;
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

function animate() {

	animateId = requestAnimationFrame( animate );

	var time = performance.now();
	var delta = ( time - prevTime ) / 1000;

	if ( !controlsType ) {
		controls.update();

		// walking-on-touch
		touchWalkingSpeed -= touchWalkingSpeed * 10.0 * delta;

		if ( moveForward ) {
			touchWalkingSpeed -= 400.0 * delta;
			controls.getObject().translateZ( touchWalkingSpeed * delta );
			controls.getObject().position.y = 10;
		}

		skyBox.position.copy( controls.getObject().position );
	}

	for (var i=0; i<speakers.length;i++) {
		speakers[i].analyzitor();
	}

	//light1.intensity = avg;
	if ( controlsEnabled ) {
		raycaster.ray.origin.copy( controls.getObject().position );
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

		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateY( velocity.y * delta );
		controls.getObject().translateZ( velocity.z * delta );

		skyBox.position.copy( controls.getObject().position );

		if ( controls.getObject().position.y < 10 ) {

			velocity.y = 0;
			controls.getObject().position.y = 10;

			canJump = true;

		}

		listener.setPosition(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);
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

	// skyBoxCamera.rotation.setFromRotationMatrix( new THREE.Matrix4().extractRotation( camera.matrixWorld ), skyBoxCamera.rotation.Order );

	// renderer.clear();
	// manager.render( skyBoxScene, skyBoxCamera );
	// renderer.clearDepth();
	manager.render( scene, camera );

}

