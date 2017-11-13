var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

// PANNERS
var pannerA = audioCtx.createPanner();
pannerA.panningModel = 'HRTF';
pannerA.distanceModel = 'inverse';
pannerA.refDistance = 1;
pannerA.maxDistance = 10000;
pannerA.rolloffFactor = 0.01;
pannerA.coneInnerAngle = 360;
pannerA.coneOuterAngle = 0;
pannerA.coneOuterGain = 0;

var pannerB = audioCtx.createPanner();
pannerB.panningModel = 'HRTF';
pannerB.distanceModel = 'inverse';
pannerB.refDistance = 1;
pannerB.maxDistance = 10000;
pannerB.rolloffFactor = 0.01;
pannerB.coneInnerAngle = 360;
pannerB.coneOuterAngle = 0;
pannerB.coneOuterGain = 0;


var pannerC = audioCtx.createPanner();
pannerC.panningModel = 'HRTF';
pannerC.distanceModel = 'inverse';
pannerC.refDistance = 1;
pannerC.maxDistance = 10000;
pannerC.rolloffFactor = 0.01;
pannerC.coneInnerAngle = 360;
pannerC.coneOuterAngle = 0;
pannerC.coneOuterGain = 0;

var pannerD = audioCtx.createPanner();
pannerD.panningModel = 'HRTF';
pannerD.distanceModel = 'inverse';
pannerD.refDistance = 1;
pannerD.maxDistance = 10000;
pannerD.rolloffFactor = 0.01;
pannerD.coneInnerAngle = 360;
pannerD.coneOuterAngle = 0;
pannerD.coneOuterGain = 0;


//LISTENER
var listener = audioCtx.listener;
//listener.dopplerFactor = 1;
//listener.speedOfSound = 343.3;
listener.setOrientation(0,1,0,0,1,0);

// set up listener and panner position information
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var xPos = WIDTH/2;
var yPos = 0;
var zPos = HEIGHT/2;
// Only x and z velocity needed, as the listener only moves left and right and in and out in this example. Never up and down.
var xVel = 0;
var zVel = 0;
// listener will always be in the same place for this demo
listener.setPosition(xPos,0,300);
//listenerData.innerHTML = 'Listener data: X ' + xPos + ' Y ' + yPos + ' Z ' + 300;

pannerA.setPosition(WIDTH/10,0,HEIGHT/10);
pannerA.setOrientation(WIDTH-WIDTH/10,0,HEIGHT-HEIGHT/10);
pannerB.setPosition(WIDTH-WIDTH/10,0,HEIGHT/10);
pannerB.setOrientation(WIDTH/10,0,HEIGHT-HEIGHT/10);

pannerD.setPosition(WIDTH-WIDTH/10,0,HEIGHT-HEIGHT/10);
pannerD.setOrientation(WIDTH/10,0,HEIGHT/10);
pannerC.setPosition(WIDTH/10,0,HEIGHT-HEIGHT/10);
pannerC.setOrientation(WIDTH-WIDTH/10,0,HEIGHT/10);

//SOURCES
var sourceA;
var sourceAbuf = audioCtx.createBuffer;
var sourceB;
var sourceBbuf = audioCtx.createBuffer;
var sourceC;
var sourceCbuf = audioCtx.createBuffer;
var sourceD;
var sourceDbuf = audioCtx.createBuffer;
function getData(filename) {
  request = new XMLHttpRequest();
  request.open('GET', filename, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buf) {
		sourceAbuf = buf;
		getData1('1.ogg');
      },
      function(e){"Error with decoding audio data" + e.err});
  }
  request.send();
}
function getData1(filename) {
  request = new XMLHttpRequest();
  request.open('GET', filename, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buf) {
		sourceBbuf = buf;
		getData2('2.ogg');
      },
      function(e){"Error with decoding audio data" + e.err});
  }
  request.send();
}
function getData2(filename) {
  request = new XMLHttpRequest();
  request.open('GET', filename, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buf) {
		sourceCbuf = buf;
		getData3('3.ogg');
      },
      function(e){"Error with decoding audio data" + e.err});
  }
  request.send();
}
function getData3(filename) {
  request = new XMLHttpRequest();
  request.open('GET', filename, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buf) {
		sourceDbuf = buf;
		ajaxRequest.send();
      },
      function(e){"Error with decoding audio data" + e.err});
  }
  request.send();
}
getData('4.ogg');


//LOAD RVERB IMPULSE
var convolver = audioCtx.createConvolver();
// grab audio track via XHR for convolver node
var concertHallBuffer;
ajaxRequest = new XMLHttpRequest();
ajaxRequest.open('GET', '6 Spaces 05 Cinema Room  M-to-S.wav', true);
ajaxRequest.responseType = 'arraybuffer';
ajaxRequest.onload = function() {
  var audioData = ajaxRequest.response;
  audioCtx.decodeAudioData(audioData, function(buffer) {
      concertHallBuffer = buffer;
    }, function(e){"Error with decoding audio data" + e.err});
}
var covolverGain = audioCtx.createGain();
covolverGain.gain.value = 0.2;
// CONNCET NODES

pannerA.connect(audioCtx.destination);
pannerB.connect(audioCtx.destination);
pannerC.connect(audioCtx.destination);
pannerD.connect(audioCtx.destination);
convolver.connect(covolverGain);
covolverGain.connect(audioCtx.destination);


// ANALYZER
var javascriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
    // connect to destination, else it isn't called
	javascriptNode.connect(audioCtx.destination);

    // setup a analyzer
var analyser = audioCtx.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;
	analyser.connect(javascriptNode);

javascriptNode.onaudioprocess = function() {
    // get the average for the first channel
    var array =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var average = getAverageVolume(array);
	
	//DRAW SOMETHING HERE
	ctx.fillStyle = "rgb(0, 0, 0)";		
	ctx.beginPath();
	ctx.moveTo(c.width-c.width/10-120, c.height/10);
	ctx.lineTo(c.width-c.width/10+30,c.height/10+150);
	ctx.lineTo(c.width-c.width/10+30,c.height/10+average*2+150);
	ctx.lineTo(c.width-c.width/10-average*2-120, c.height/10);
	ctx.fill();
	incA = average/130;
}

function getAverageVolume(array) {
    var values = 0;
    var average;
    var length = array.length;
    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
        values += array[i];
    }
    average = values / length;
    return average;
}






function play() {
	sourceA = audioCtx.createBufferSource();
	sourceA.buffer=sourceAbuf;
	sourceA.connect(pannerA);
	sourceA.start(0);	
	sourceA.loop = 0;
	
	sourceB = audioCtx.createBufferSource();
	sourceB.buffer=sourceBbuf;
	sourceB.connect(pannerB);
	sourceB.start(0);	
	sourceB.loop = 1;
	
	sourceC = audioCtx.createBufferSource();
	sourceC.buffer=sourceCbuf;
	sourceC.connect(pannerC);
	sourceC.start(0);	
	sourceC.loop = 0;
	
	sourceD = audioCtx.createBufferSource();
	sourceD.buffer=sourceDbuf;
	sourceD.connect(pannerD);
	sourceD.start(0);	
	sourceD.loop = 0;
	
	//reverb Buffer
	convolver.buffer = concertHallBuffer;
	
	sourceA.connect(convolver);
	sourceB.connect(convolver);
	sourceC.connect(convolver);
	sourceD.connect(convolver);
	
	
	sourceB.connect(analyser);
}
