var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

var LFOnode = audioCtx.createBiquadFilter();
var LFOgain = audioCtx.createGain();
LFOnode.type = "lowpass";
LFOnode.frequency.value = 75;
LFOnode.Q.value = 4.5;
LFOgain.gain.value = 0.7;
LFOnode.connect(LFOgain);
LFOgain.connect(audioCtx.destination);


//LISTENER
var listener = audioCtx.listener;
listener.setOrientation(0,0,1,0,1,0);
listener.setPosition(0,10,0);

//LOAD RVERB IMPULSE

var convolver = audioCtx.createConvolver();
var covolverGain = audioCtx.createGain();

covolverGain.gain.value = 0.06;
convolver.connect(covolverGain);
covolverGain.connect(audioCtx.destination);


function loadImpulse(filename) {
	loadSounds(this, {
		buffer: filename
	});
}
loadImpulse.prototype.play = function()  {
	convolver.buffer  = this.buffer;
	console.log(convolver.buffer);
}

