// TODO: Titanium support
// TODO: getById? if so, can that be added to DGE.Object?
/**
 * The DGE.Audio Object manages audio in your gameomg!
 * @param {Object} conf The configuration settings for this new Sprite object.
 * @namespace DGE
 * @class Audio
 * @constructor
 * @extends DGE.Object
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
 * @param {Boolean} mute true to mute the audio, false to disable mute.
 * @return {Object} this (for chaining).
 * @method mute
 */
DGE.Audio.prototype.mute = function(mute) {
	this.set('mute', (mute !== false));
	return this;
};

/**
 * Pauses the audio playback.
 * @return {Object} this (for chaining).
 * @method pause
 */
DGE.Audio.prototype.pause = function() {
	this._node.pause();
	return this;
};

/**
 * Plays the audio file.
 * @return {Object} this (for chaining).
 * @method play
 */
DGE.Audio.prototype.play = function() {
	if (DGE.Audio.enabled) this._node.play();
	return this;
};

/**
 * Stops audio playback (resets seeker to beginning).
 * @return {Object} this (for chaining).
 * @method stop
 */
DGE.Audio.prototype.stop = function() {
	this._node.pause();
	this._node.currentTime = 0;
	return this;
};

/**
 * Represents the availability of audio in the current platform.
 * @property _available
 * @final
 * @static
 * @type Boolean
 */
DGE.Audio._available = (function() {

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
 * but disabled (meaning this flag set to false).
 * @property enabled
 * @default true
 * @static
 * @type Boolean
 */
DGE.Audio.enabled = true;

/**
 * A key/value pair of events to fire when given attributes are set.
 * @property initEvents
 * @type Object
 */
DGE.Audio.initEvents = {
	file : function(file) {
		this._node.src = file;
		this._node.load();
	},
	mute : function(mute) {
		this._node.muted = mute;
	},
	volume : function(volume) {
		this._node.volume = (volume / 100);
	}
};

// stuff below this line not yet supported

/*
DGE.Audio.mute = function() {
DGE.debug('DGE.Audio.mute();');
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
