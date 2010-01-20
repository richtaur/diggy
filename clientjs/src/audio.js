// TODO: Titanium support
/*
implemented so far:
- mute
- play
- pause
- set file
- set volume

still need:
- stop
*/
/*
 * The DGE.Audio Object manages audio in your gameomg!
 * @namespace DGE
 * @class audio
 */
DGE.Audio = DGE.extend(DGE.Object, function(conf) {

	if (conf === undefined) return;

	for (var k in DGE.Audio.initEvents) {
		this.on(k, DGE.Audio.initEvents[k]);
	}

	this._node = document.createElement('audio');

	if (this._node) {
		DGE.stage._node.appendChild(this._node);
	}

	this.init(conf);

});

/**
 * Mutes the audio playback.
 * @param {Boolean} mute true to mute the audio, false to turn off mute.
 * @return {Object} this (for chaining).
 */
DGE.Audio.prototype.mute = function(mute) {
	this.set('mute', (mute !== false));
	return this;
};

/**
 * Plays the audio file.
 * @return {Object} this (for chaining).
 */
DGE.Audio.prototype.play = function() {
	this._node.play();
	return this;
};

/**
 * Pauses the audio playback.
 * @return {Object} this (for chaining).
 */
DGE.Audio.prototype.pause = function() {
	this._node.pause();
	return this;
};

/**
 * Stops audio playback (resets seeker to beginning).
 * @return {Object} this (for chaining).
 */
DGE.Audio.prototype.stop = function() {
	this._node.pause();
	return this;
};

/**
 * Reports on the availability of audio in the current platform.
 * @return {Boolean} trure if audio is available, otherwise false.
 */
DGE.Audio._available = (function() {

	if (DGE.platform.name == DGE.platform.TITANIUM) {
		return true;
	} else {
		var el = document.createElement('audio');
		return !!el;
	}

})();

DGE.Audio.initEvents = {
	file : function(file) {
		this._node.src = file;
	},
	mute : function(mute) {
console.log('mute!', mute);
		this._node.muted = mute;
	},
	volume : function(volume) {
		this._node.volume = (volume / 100);
	}
};

DGE.Audio.mute = function() {
DGE.debug('DGE.Audio.mute();');
};

DGE.Music = DGE.extend(DGE.Audio, function(conf) {
	this.init(conf);
});

/*
 * Begins playing the music and fades it in.
 * @param {Number} ms The number of milliseconds to take when fading in.
 * @param {Number} volume (optional) The volume to fade in to (default: 100).
 * @method fadeIn
 */

/*
 * Stops playing the music by fading it out and stopping.
 * @param {Number} ms The number of milliseconds to take when fading out.
 * @param {Number} volume (optional) The volume to fade out to (default: 0).
 * @method fadeOut
 */
