function addSpeaker(filename, spX, spY, spZ) {
	this.filename = filename;
	this.spX = spX;
	this.spY = spY;
	this.spZ = spZ;
	
	this.isPlaying = false;
	
	this.pan = audioCtx.createPanner();
	this.pan.panningModel = 'HRTF';
	this.pan.distanceModel = 'inverse';
	this.pan.refDistance = 30;
	this.pan.maxDistance = 10000;
	this.pan.rolloffFactor = 0.5;
	this.pan.coneInnerAngle = 360;
	this.pan.coneOuterAngle = 0;
	this.pan.coneOuterGain = 0;
	
	this.pan.setPosition(spX,spY,spZ);
	this.pan.setOrientation(0,10,0);
	
	this.gainNode = audioCtx.createGain();
	this.gainNode.gain.value = 0.3;
	this.pan.connect(this.gainNode);
	this.gainNode.connect(audioCtx.destination);
	
	loadSounds(this, {
		buffer: this.filename
	}); 

	this.analyse = audioCtx.createAnalyser();
	this.analyse.smoothingTimeConstant = 0.2;
	this.analyse.fftSize = 1024;

	this.source;


	this.R = Math.sqrt(this.spX*this.spX + this.spZ*this.spZ);
	// SPEAKER OBJECT
	this.mesh = new THREE.Mesh( geometry, material );
	this.mesh.position.x = this.spX;
	this.mesh.position.y = this.spY;
	this.mesh.position.z = this.spZ;
	this.mesh.rotateY(Math.atan2(this.spX,this.spZ));
	this.mesh.rotateX(Math.atan2(Math.abs(this.R),this.spY-10));
	this.mesh.name = filename;
	scene.add( this.mesh );

	material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	objects.push( this.mesh );

	//lighter
	this.lighter = new THREE.PointLight( 0xccccff, 1, 10 );
	
	//Directional back lights
	this.lighter1 = new THREE.DirectionalLight( 0xffcccc, 0.1 );
	this.lighter1.castShadow = false;
	scene.add( this.lighter );
	scene.add( this.lighter1 );
	
	//Dynamic light for sound
	this.Ry = Math.sqrt(this.R*this.R + (this.spY-5)*(this.spY-5))-15;
	this.beta = Math.atan2((this.spY-5), this.R);
	this.newR = Math.cos(this.beta)*(this.Ry);
	this.theta = Math.atan2(this.spZ, this.spX);
	this.lighter.position.x = this.newR * Math.cos(this.theta);
	this.lighter.position.y = this.Ry   * Math.sin(this.beta)+6;
	this.lighter.position.z = this.newR * Math.sin(this.theta);
	
	//Shadow lights
	//Shadow position
	if (! isMobile()) {
		this.lighterShadow = new THREE.PointLight( 0xccccff, 2, 15 );
		scene.add( this.lighterShadow );
		this.lighterShadow.position.x = this.R * Math.cos(this.theta)*0.7;
		this.lighterShadow.position.y = 1.5;
		this.lighterShadow.position.z = this.R * Math.sin(this.theta)*0.7;
		this.lighterShadow.name = filename+'lightShadow';	
	}
	
	//Static light for speaker
	this.Ry = Math.sqrt(this.R*this.R + (this.spY-5)*(this.spY-5))+15;
	this.beta = Math.atan2((this.spY-5), this.R);
	this.newR = Math.cos(this.beta)*(this.Ry);
	this.theta = Math.atan2(this.spZ, this.spX);
	this.lighter1.position.x = this.newR * Math.cos(this.theta);
	this.lighter1.position.y = this.Ry   * Math.sin(this.beta)+5;
	this.lighter1.position.z = this.newR * Math.sin(this.theta);

	this.lighter.name = filename+'light';
	this.lighter1.name = filename+'light1';
	this.drawIt = false; 
}

if (isMobile()) {
	addSpeaker.prototype.analyzitor = function() {
	if (this.drawIt) {
		var array = new Uint8Array(this.analyse.frequencyBinCount);
		this.analyse.getByteFrequencyData(array);
		var length = array.length;
		var values = 0;
		//var brightValues = 0;
		for (var i = 0; i < array.length; i++) {
			values += array[i];
			//brightValues += array[i]*i;
		}
		var aver = values / length;
		//var brightness = brightValues * 126.25; // / 524800
		//this.lighter.color.setHex( Number(parseInt( brightness , 10)).toString(16) );
		this.lighter.intensity = aver / 5;
		//console.log(brightness);
	}
	}	
} else {
	addSpeaker.prototype.analyzitor = function() {
	if (this.drawIt) {
		var array = new Uint8Array(this.analyse.frequencyBinCount);
		this.analyse.getByteFrequencyData(array);
		var length = array.length;
		var values = 0;
		//var brightValues = 0;
		for (var i = 0; i < array.length; i++) {
			values += array[i];
			//brightValues += array[i]*i;
		}
		var aver = values / length;
		//var brightness = brightValues * 126.25; // / 524800
		//this.lighter.color.setHex( Number(parseInt( brightness , 10)).toString(16) );
		this.lighter.intensity = aver / 5;
		this.lighterShadow.intensity = aver / 5;
		//console.log(brightness);
	}
}
}


addSpeaker.prototype.stop = function()  {
	if (this.isPlaying) {
		this.source.stop();
		//this.aud.pause();
		if (videoAdded) {video.pause();} 
	}
	console.log('STOPED');
	this.isPlaying = false;
	this.drawIt=false;
}


addSpeaker.prototype.player = function()  {
	if (this.isPlaying===false) {
		this.source = audioCtx.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.connect(this.pan);
		this.source.connect(convolver);
		this.source.connect(LFOnode);
		this.source.connect(this.analyse);
		this.source.start(0);	
		this.source.loop = 1; 
		//this.aud.play();
		this.drawIt=true;
		this.isPlaying = true;
	}
}

var videoAdded = false;
var video;
var movieScreen;
function addVideo(videoSrc) {
	video = document.createElement( 'video' );
	// video.id = 'video';
	// video.type = ' video/ogg; codecs="theora, vorbis" ';
	video.src = videoSrc;
	video.load(); // must call after setting/changing source	
	// alternative method -- 
	// create DIV in HTML:
	// <video id="myVideo" autoplay style="display:none">
	//		<source src="videos/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>
	// </video>
	// and set JS variable:
	// video = document.getElementById( 'myVideo' );
	
	videoImage = document.createElement( 'canvas' );
	videoImage.width = 1280;
	videoImage.height = 720;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	
	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	// the geometry on which the movie will be displayed;
	// 		movie image will be scaled to fit these dimensions.
	var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
	movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	movieScreen.position.set(0,60,-110);
	scene.add(movieScreen);
	videoAdded = true;
	
	video.oncanplaythrough = function() {
		showLoadedMedia();
	};
}


addSpeaker.objects = [];

function loadSounds(obj, soundMap, callback) {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in soundMap) {
    var path = soundMap[name];
    names.push(name);
    paths.push(path);
  }
  bufferLoader = new BufferLoader(audioCtx, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      obj[name] = buffer;
    }
    if (callback) {
      callback();
    }
  });
  bufferLoader.load();
}


function BufferLoader(audioCtx, urlList, callback) {
  this.audioCtx = audioCtx;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.audioCtx.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length) {
			loader.onload(loader.bufferList);
			showLoadedMedia();
		}
          
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};


function showLoadedMedia() {
	console.log("++Media");
	loadedMedia++;
	if (loadedMedia == mediaElementsCount) {
		document.getElementById("loading").innerHTML = 'Click to play';
		document.getElementById("instructions").style.cursor = 'pointer';
		canPlayIt = true;
		canPlayItAll();
	} else {
		document.getElementById("loading").innerHTML = pageLoader + '<br><br>loading: ' + loadedMedia + ' / ' + mediaElementsCount + ' files<br><br>';
	}

}

function canPlayItAll() {
	clickToPlay = function ( event ) {
		instructions.style.display = 'none';
		blocker.style.display = 'none';
		backButton.style.display = 'inline-block';
		
		impulse.play();
		for (var i=0; i<speakers.length;i++) {
			speakers[i].player();
		}
		if (videoAdded) {video.play();}
		animate();
						
		// Ask the browser to lock the pointer
		if (controlsType == ControlsType.MOUSE) {
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
			if ( /Firefox/i.test( navigator.userAgent ) ) {
				var fullscreenchange = function ( event ) {
					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
						element.requestPointerLock();
					}
				}
				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
				element.requestFullscreen();
			} else {
				element.requestPointerLock();
			}
		}
	}		
	document.getElementById('instructions').addEventListener( 'click', clickToPlay, false );
}