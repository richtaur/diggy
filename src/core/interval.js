/**
 * A more intuitive wrapper for JavaScript's interval functions.

 * <h3>Example usage:<h3>
 * <ol>
 *	<li>var interval = new DGE.Interval({</li>
 *  <li>	delay : 100,</li>
 *  <li>	interval : function,</li>
 *  <li>		DGE.log('interval!');</li>
 *  <li>	}</li>
 *  <li>});</li>
 *	<li></li>
 *	<li>interval.start();</li>
 *	<li></li>
 *	<li>if (interval.get('active')) interval.stop();</li>
 *	<li>interval.set('delay', 10); // speed it up</li>
 *	<li>interval.set('interval', myFunction); // change the interval</li>
 * </ol>

 * @param {Function} fn The function to execute each interval.
 * @param {Number} delay The number of milliseconds between intervals.
 * @namespace DGE
 * @class Interval
 * @constructor
 */
DGE.Interval = DGE.Object.make(function(conf) {
	this.init(conf);
}, {
	active : false,
	delay : 67, // ~30 FPS
	interval : function() {},
	scope : null
}, {
	'change:delay' : function() {
		if (this.get('active')) this.start();
	},
	'change:interval' : function() {
		if (this.get('active')) this.start();
	}
});

/**
 * Starts (or restarts) the interval.
 * @return {Object} this (for chaining).
 * @method start
 */
DGE.Interval.prototype.start = function() {

	if (this.get('active')) {
		this.stop().set('active', true);
	}

	var interval = this.get('interval');
	var that = (this.get('scope') || this);
	var fn = function() {
		interval.apply(that);
	};

	return this.set('intervalID', setInterval(fn, this.get('delay')));

};

/**
 * Stops the interval if it's active.
 * @return {Object} this (for chaining).
 * @method stop
 */
DGE.Interval.prototype.stop = function() {

	var intervalID = this.get('intervalID');
	if (intervalID) clearInterval(intervalID);
	this.set('intervalID', null);

	return this.set('active', false);

};

/**
 * Formats the passed frames per second into milliseconds.
 * @param {Number} fps The frames per second.
 * @return {Number} The number of milliseconds to equal the passed frames per second.
 * @method formatFPS
 * @static
 */
DGE.Interval.formatFPS = function(fps) {
	return Math.ceil(1000 / fps);
};

/**
 * TODO
 */
DGE.Interval.start = function() {

	for (var id in DGE.Interval.children) {

		var child = DGE.Interval.children[id];

		if (child.get('active')) {
			child.start();
		}

	}

};

DGE.Interval.stop = function() {

	for (var id in DGE.Interval.children) {

		var child = DGE.Interval.children[id];

		if (child.get('active')) {
			child.stop();
		}

	}

};
