/**
 * @class Sprite
 */

/**
 * Animates a Sprite.
 * @param {Object} ops A key/value pair of rules (from, to).
 * @param {Number} ms The number of milliseconds the animation should last (default: 1000).
 * @param {Object} callbacks An object of functions to call when certain events happen (complete, frame).
 * @return {Object} this (for chaining).
 * @method animate
 */
DGE.Sprite.prototype.animate = function(ops, ms, callbacks) {

	callbacks = callbacks || {};
	ms = (ms || 1000);
	if (ms < DGE.conf.interval) ms = 1000;

	var frames = Math.ceil(ms / DGE.conf.interval),
		that = this;

	for (var i in ops) {
		ops[i].inc = ((ops[i].to - ops[i].from) / frames);
	}

	this.tween = function() {

		for (var i in ops) {

			ops[i].from += ops[i].inc;

			this[i](ops[i].from);
			if (callbacks.frame) callbacks.frame.apply(this, [i, ops[i].from]);

		}

		if (--frames == 0) {

			// This snaps to grid in case the math was off (it probably was)
			for (var i in ops) {
				this[i](ops[i].to);
			}

			this.tween = function(){};
			if (callbacks.complete) callbacks.complete.apply(this);

			return;

		}


	};

	return this;

};

/**
 * The method to call at each iteration of the main interval.
 * Overrides the default DGE.Sprite.prototype.exec by adding the tween method.
 * @return {Object} this (for chaining).
 * @member exec
 */
DGE.Sprite.prototype.exec = function() {

	return this.move()
		.ping()
		.tween();

};

/**
 * The method to call during each frame change when animating.
 * Is changed each time this.animate() is called.
 * @member tween
 */
DGE.Sprite.prototype.tween = function(){}; // Gets sets in constructor
