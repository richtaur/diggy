/**
 * A more intuitive wrapper for JavaScript's interval functions.

 * <h3>Example usage:<h3>
 * <ol>
 *	<li>var interval = new DGE.Interval(function() {</li>
 *	<li>&nbsp;&nbsp;// do something interesting</li>
 *	<li>}, 100);</li>
 *	<li></li>
 *	<li>interval.start();</li>
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
		this.stop();
		this.start();
	},
	'change:interval' : function() {
		this.stop();
		this.start();
	}
});

/**
 * Starts (or restarts) the interval.
 * @return {Object} this (for chaining).
 * @method start
 */
DGE.Interval.prototype.start = function() {

	this.stop().set('active', true);

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
 * Formats the passed frames per second into milliseconds (JS only works with ms).
 * @param {Number} fps The frames per second.
 * @return {Number} The number of milliseconds to equal the passed frames per second.
 * @method formatFPS
 * @static
 */
DGE.Interval.formatFPS = function(fps) {
	return Math.ceil(1000 / fps);
};
