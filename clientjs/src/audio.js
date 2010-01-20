/*
 * DGE audio Object.
 * @namespace DGE
 * @class audio
 */

DGE.Audio = DGE.extend(DGE.Object, function(conf) {
	this.init(conf);
});

DGE.Audio.prototype.play = function() {
	//console.log('play(', this.get('file'), ')');
};

DGE.Audio.mute = function() {
	console.log('DGE.Audio.mute();');
};

var sfx = new DGE.Audio({
	id : 'hurr',
	file : 'shot.mp3',
	volume : 100
});

/*
sfx.set('volume', 100);
*/
console.log(
	'set voluem to',
	sfx.get('volume')
);

sfx.play();

// Static methods
/*
DGE.Audio.mute();
DGE.Audio.set('volume', 100);
DGE.Audio.get('volume');
*/

DGE.Music = DGE.extend(DGE.Audio, function(conf) {
	this.init(conf);
});

(function() {

// Individual Audio objects

// Simple example
var itemGet = new DGE.Audio({
	file : 'item_get.mp3'
});

// Complex example
var levelUp = new DGE.Audio({
	id : 'levelUp',
	file : 'level_up.mp3',
	//panning : DGE.Audio.PANNING_CENTER,
	polyphony : 2,
	volume : DGE.Audio.VOLUME_MAX
});

// Sound FX methods
levelUp.play();
levelUp.stop();
//levelUp.set('panning', Number);
levelUp.set('polyphony', Number);
levelUp.set('volume', Number);

// Retrieve sound FX
var levelUp = DGE.Audio.getById('levelUp');

// Setting up music
// Note: for future release include callback with [complete, error]

// Simple example
var levelOne = new DGE.Music({
	file : 'level_one.mp3'
});

var levelTwo = new DGE.Music({
	id : 'levelTwo',
	file : 'level_two.mp3',
	loop : true,
});

// Music methods
levelTwo.seek(Number); // ms to skip to

levelTwo.on('complete', fn);
levelTwo.on('play', fn);
levelTwo.on('stop', fn);

levelTwo.set('loop', true);
//levelTwo.set('panning', DGE.Audio.PANNING_RIGHT);
levelTwo.set('repeat', true); // Can this also be a Number, representing how many times to loop?
levelTwo.set('volume', 50);

levelTwo.fadeIn(); // Amount of time 
levelTwo.fadeOut(Number); // Amount of time (ms) to fade out
levelTwo.play();
levelTwo.stop();

/**
 * Begins playing the music and fades it in.
 * @param {Number} ms The number of milliseconds to take when fading in.
 * @param {Number} volume (optional) The volume to fade in to (default: 100).
 * @method fadeIn
 */

/**
 * Stops playing the music by fading it out and stopping.
 * @param {Number} ms The number of milliseconds to take when fading out.
 * @param {Number} volume (optional) The volume to fade out to (default: 0).
 * @method fadeOut
 */

// Retrieve music
var theme = DGE.Audio.getById('theme');

});

(function() {

DGE.execScript('SoundManager2/script/soundmanager2.js');

var interval = new DGE.Interval(function() {

	if (typeof(soundManager) == 'undefined') return;
console.log('got it');

	soundManager.url = (DGE.conf.libsURL + 'swf/');
console.log('URL=',soundManager.url);
	soundManager.debugMode = false;

	this.stop();

}, 10).start();
console.log("inter val is off ...");

})();
