/**
 * The DGE.Audio Object manages audio in your gameomg!
 * @param {Object} conf The configuration settings for this new Audio object.
 * @namespace DGE
 * @class Audio
 * @constructor
 * @extends DGE.Object
 */
DGE.Audio = DGE.Object.make(function(conf) {

	if (conf === undefined) return;

	if (DGE.platform.name == DGE.platform.BROWSER) {

		this.node = document.createElement('audio');

		if (this.node) {
			DGE.stage.node.appendChild(this.node);
		}

	}

	this.init(conf);

}, {
	volume : 100
}, {
	'change:file' : function(file) {

		if (DGE.platform.name == DGE.platform.TITANIUM) {
			this.node = Titanium.Media.createSound(file);
		} else {
			this.node.src = file;
			this.node.load();
		}

	},
	'change:mute' : function(muted) {

		if (DGE.platform.name == DGE.platform.TITANIUM) {
			if (muted === false) {
				this.node.setVolume(this.get('volume'));
			} else {
				this.node.setVolume(0);
			}
		} else {
			this.node.muted = muted;
		}

	},
	'change:volume' : function(volume) {

		// This line is necessary because of the crappy way Titanium implements sound objects.
		// The node might not exist yet because you must create it with a file defined,
		// and the file might not have been set yet.
		if (!this.node) return;

		if (DGE.platform.name == DGE.platform.TITANIUM) {
			this.node.setVolume(volume / 100);
		} else {
			this.node.volume = (volume / 100);
		}

	}
});

/**
 * Mutes the audio.
 * @param {Boolean} mute true to mute the audio, false to disable mute.
 * @return {Object} this (for chaining).
 * @method mute
 */
DGE.Audio.prototype.mute = function(mute) {
	return this.set('mute', (mute !== false));
};

/**
 * Pauses the audio.
 * @return {Object} this (for chaining).
 * @method pause
 */
DGE.Audio.prototype.pause = function() {
	this.node.pause();
	return this.fire('pause');
};

/**
 * Plays the audio file.
 * @return {Object} this (for chaining).
 * @method play
 */
DGE.Audio.prototype.play = function() {
	if (DGE.Audio.enabled) this.node.play();
	return this.fire('play');
};

/**
 * Stops audio playback (resets seeker to beginning).
 * @return {Object} this (for chaining).
 * @method stop
 */
DGE.Audio.prototype.stop = function() {

	if (DGE.platform.name == DGE.platform.BROWSER) {
		// The try/catch is here because this error gets thrown in Gecko and Webkit:
		// An attempt was made to use an object that is not, or is no longer, usable" code: "11"
		try {
			this.node.pause();
			this.node.currentTime = 0;
		} catch(e) {}
	} else {
		this.node.stop();
	}

	return this.fire('stop');

};

/**
 * Represents the availability of audio in the current platform.
 * @property available
 * @final
 * @static
 * @type Boolean
 */
DGE.Audio.available = (function() {

	if (DGE.platform.name == DGE.platform.TITANIUM) {
		return true;
	} else {
		var el = document.createElement('audio');
		return !!el;
	}

})();

/**
 * Whether the audio is enabled or not.
 * Note: audio can be available (supported by the platform)
 * but disabled (meaning this flag is set to false).
 * @property enabled
 * @default true
 * @static
 * @type Boolean
 */
DGE.Audio.enabled = true;

// TODO: clean up below here

/*
DGE.Audio.mute = function() {
};
*/

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
