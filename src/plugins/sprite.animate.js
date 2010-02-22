/**
 * @class Sprite
 */

/**
 * Animates a Sprite.
 * @param {Object} rules A key/value pair of rules (from, to).
 * @param {Number} ms (optional) The number of milliseconds the animation should last (default: DGE.Sprite.defaults.animationDelay).
 * @param {Object} callbacks (optional) An object of functions to call when certain events happen (complete, tween).
 * @param {Function} easeFn (optional) The function to use for easing (default: DGE.Sprite.eases.linear). Parameter can also be a string, which will then be used as the key, as DGE.Sprite.eases[easeFn].
 * @return {Object} this (for chaining).
 * @method animate
 */
DGE.Sprite.prototype.animate = function(rules, ms, callbacks, easeFn) {

	var animationInterval = this.get('animationInterval');

	if (animationInterval) {
		animationInterval.stop();
	} else {
		this.set('animationInterval', new DGE.Interval());
		animationInterval = this.get('animationInterval');
	}

	if (easeFn === undefined) {
		easeFn = DGE.Sprite.eases.linear;
	} else if (typeof(easeFn) == 'string') {
		easeFn = DGE.Sprite.eases[easeFn];
	}

	callbacks = callbacks || {};
	ms = ms || DGE.Sprite.defaults.animationDelay;

	var currentFrame = 0;
	var numFrames = Math.ceil(ms / this.get('delay'));
	var parsedRules = {};
	var that = this;

	for (var k in rules) {

		parsedRules[k] = {};

		if (typeof(rules[k]) == 'object') {
			if (rules[k].from === undefined) {
				parsedRules[k].from = this.get(k);
			} else {
				parsedRules[k].from = rules[k].from;
			}
		} else {

			parsedRules[k] = {
				from : this.get(k),
				to : rules[k]
			};

		}

		parsedRules[k].current = parsedRules[k].from;

	}

	animationInterval.set('interval', function() {

		for (var k in parsedRules) {

			parsedRules[k].current = easeFn(
				currentFrame,
				parsedRules[k].from,
				(parsedRules[k].to - parsedRules[k].from),
				numFrames
			);

			that.set(k, parsedRules[k].current);
			if (callbacks.tween) callbacks.tween.apply(that, [k, parsedRules[k].current, currentFrame, numFrames]);

		}

		if (currentFrame++ == numFrames) {
			animationInterval.stop();
			if (callbacks.complete) callbacks.complete.apply(that);
		}

	}).start();

	return this.set('animationInterval', animationInterval);

};

/**
 * Fades a Sprite out.
 * @param {Number} ms (optional) The number of milliseconds the animation should last (default: DGE.Sprite.defaults.animationDelay).
 * @param {Function} complete (optional) The function to call on complete.
 * @param {Boolean} fadeIn (optional) Pass true to fade in, otherwise it fades out (the default).
 * @return {Object} this (for chaining).
 * @method fade
 */
DGE.Sprite.prototype.fade = function(ms, complete, fadeIn) {

	return this.animate({
		opacity : {
			from : this.get('opacity'),
			to : (fadeIn ? 100 : 0)
		}
	}, ms, {
		complete : (complete || function() {})
	});

};

DGE.Sprite.defaults.animationDelay = 1000;

/**
 * @class Sprite.eases
 */

/*
 * The animation easing functions.
 * Borrowed from the wonderful YUI library: http://developer.yahoo.com/yui/
 * @final
 * @property eases
 * @type Object
 */
DGE.Sprite.eases = {

	/**
	 * Uniform speed between points.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @return {Number} The computed value for the current animation frame.
	 * @method easeNone
	 */
	linear : function (t, b, c, d) {
		return c*t/d + b;
	},

	/**
	 * Begins slowly and accelerates towards the end.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @return {Number} The computed value for the current animation frame.
	 * @method easeIn
	 */
	easeIn : function (t, b, c, d) {
		return c*(t/=d)*t + b;
	},

	/**
	 * Begins quickly and decelerates towards the end.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @return {Number} The computed value for the current animation frame.
	 * @method easeOut
	 */
	easeOut : function (t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},

	/**
	 * Begins slowly and decelerates towards the end.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @return {Number} The computed value for the current animation frame.
	 * @method easeBoth
	 */
	easeBoth : function (t, b, c, d) {

		if ((t/=d/2) < 1) return c/2*t*t + b;

		return -c/2 * ((--t)*(t-2) - 1) + b;

	},

	/**
	 * Begins slowly and accelerates towards the end.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @return {Number} The computed value for the current animation frame.
	 * @method inStrong
	 */
	inStrong : function (t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},

	/**
	 * Begins quickly and decelerates towards the end.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @return {Number} The computed value for the current animation frame.
	 * @method outStrong
	 */
	outStrong : function (t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},

	/**
	 * Begins slowly and decelerates towards end.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @return {Number} The computed value for the current animation frame.
	 * @method bothStrong
	 */
	bothStrong : function (t, b, c, d) {

		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}

		return -c/2 * ((t-=2)*t*t*t - 2) + b;

	},

	/**
	 * Snap in elastic effect.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @param {Number} a (optional) Amplitude.
	 * @param {Number} p (optional) Period.
	 * @return {Number} The computed value for the current animation frame.
	 * @method elasticIn
	 */
	elasticIn : function (t, b, c, d, a, p) {

		if (t == 0) return b;
		if ((t /= d) == 1) return b+c;

		if (!p) p=d*.3;

		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}

		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;

	},

	/**
	 * Snap out elastic effect.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @param {Number} a (optional) Amplitude.
	 * @param {Number} p (optional) Period.
	 * @return {Number} The computed value for the current animation frame.
	 * @method elasticOut
	 */
	elasticOut : function (t, b, c, d, a, p) {

		if (t == 0) return b;
		if ((t /= d) == 1) return b+c;

		if (!p) p=d*.3;

		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}

		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;

	},

	/**
	 * Snap both elastic effect.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @param {Number} a (optional) Amplitude.
	 * @param {Number} p (optional) Period.
	 * @return {Number} The computed value for the current animation frame.
	 * @method elasticBoth
	 */
	elasticBoth : function (t, b, c, d, a, p) {

		if (t == 0) return b;
		if ((t /= d/2) == 2) return b+c;

		if (!p) p = d*(.3*1.5);

		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}

		if (t < 1) {
			return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}

		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;

	},

	/**
	 * Backtracks slightly, then reverses direction and moves to end.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @param {Number} s (optional) Overshoot.
	 * @return {Number} The computed value for the current animation frame.
	 * @method backIn
	 */
	backIn : function (t, b, c, d, s) {

		if (s === undefined) s = 1.70158;

		return c*(t/=d)*t*((s+1)*t - s) + b;

	},

	/**
	 * Overshoots end, then reverses and comes back to end.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @param {Number} s (optional) Overshoot.
	 * @return {Number} The computed value for the current animation frame.
	 * @method backOut
	 */
	backOut : function (t, b, c, d, s) {

		if (s === undefined) s = 1.70158;

		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;

	},

	/**
	 * Backtracks slightly, then reverses direction, overshoots end, 
	 * then reverses and comes back to end.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @param {Number} s (optional) Overshoot.
	 * @return {Number} The computed value for the current animation frame.
	 * @method backBoth
	 */
	backBoth : function (t, b, c, d, s) {

		if (s === undefined) s = 1.70158; 

		if ((t /= d/2 ) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;

		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;

	},

	/**
	 * Bounce off of start.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @return {Number} The computed value for the current animation frame.
	 * @method bounceIn
	 */
	bounceIn : function (t, b, c, d) {
		return c - DGE.Sprite.eases.bounceOut(d-t, 0, c, d) + b;
	},

	/**
	 * Bounces off end.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @return {Number} The computed value for the current animation frame.
	 * @method bounceOut
	 */
	bounceOut : function (t, b, c, d) {

		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		}

		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;

	},

	/**
	 * Bounces off start and end.
	 * @param {Number} t Time value used to compute current value.
	 * @param {Number} b Starting value.
	 * @param {Number} c Delta between start and end values.
	 * @param {Number} d Total length of animation.
	 * @return {Number} The computed value for the current animation frame.
	 * @method bounceBoth
	 */
	bounceBoth : function (t, b, c, d) {

		if (t < d/2) return DGE.Sprite.eases.bounceIn(t*2, 0, c, d) * .5 + b;

		return DGE.Sprite.eases.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;

	}

};
