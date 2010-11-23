/**
 * Diggy (DGE): DHTML Game Engine.<br>
 * http://github.com/richtaur/diggy/
 * @namespace
 * @module Diggy
 */

// todo: rethink the concept of Assets, Loader and loading ... DGE.init itself needs to wait for the .swf file to load, for example
// todo: redo the makeId() stuff to instead increment a number?

/**
 * DGE is the single global utilizied by Diggy.
 * It contains all of Diggy's classes, properties and methods.
 * @namespace
 * @class DGE
 */
var DGE = {
	/**
	 * What version of the Diggy library this is.
	 * @final
	 * @property version
	 * @type Object
	 */
	version : {
		/**
		 * The name of the version of Diggy.
		 * @final
		 * @property version.name
		 * @type String
		 */
		name : 'alpha 0.1',
		/**
		 * The version of Diggy represented as an integer.
		 * @final
		 * @property version.number
		 * @type Number
		 */
		number : 0.1
	}
};

/**
 * The platform Object contains information on the platform Diggy is running on.
 * @final
 * @property platform
 * @type Object
 */
DGE.platform = {};

/**
 * The constant for any web browser.
 * @final
 * @property platform.BROWSER
 * @type String
 */
DGE.platform.BROWSER = 'browser';

/**
 * The constant for the Titanium platform.
 * @final
 * @property platform.TITANIUM
 * @type String
 */
DGE.platform.TITANIUM = 'titanium';

/**
 * A string representing the platform DGE is running on.
 * @final
 * @property platform.name
 * @type String
 */
DGE.platform.name = (function() {

	var platform = DGE.platform.BROWSER;

	if (typeof(Titanium) == 'object') {
		platform = DGE.platform.TITANIUM;
	}

	return platform;

})();

/**
 * An object for the terms associated with a platform.
 * @final
 * @property platform.terms
 * @type Object
 */
DGE.platform.terms = {

	/**
	 * A string representing the "click" action of this platform (click or tap).
	 * @final
	 * @property platform.terms.click
	 * @type String
	 */
	click : ((DGE.platform.name == DGE.platform.BROWSER) ? 'click' : 'tap'),

	/**
	 * A string representing the "clicked" action of this platform (clicked or tapped).
	 * @final
	 * @property platform.terms.clicked
	 * @type String
	 */
	clicked : ((DGE.platform.name == DGE.platform.BROWSER) ? 'clicked' : 'tapped'),

	/**
	 * A string representing the "clicking" action of this platform (clicking or tapping).
	 * @final
	 * @property platform.terms.clicking
	 * @type String
	 */
	clicking : ((DGE.platform.name == DGE.platform.BROWSER) ? 'clicking' : 'tapping')

};

DGE.platform.clickTerm = (function() {

	var platform = DGE.platform.BROWSER;

	if (typeof(Titanium) == 'object') {
		platform = DGE.platform.TITANIUM;
	}

	return platform;

})();

/**
 * Initializes DGE.
 * @param {Object} The key/value pair of configuration settings.
 * @return {Object} DGE.stage, the primary stage object as a DGE.Sprite instance.
 * @method init
 * @static
 */
DGE.init = function(conf) {
	DGE.stage = new DGE.Sprite(conf);
	return DGE.stage;
};

/**
 * Creates a custom attribute method.
 * @param {Object} that The scope to execute in.
 * @param {Function} change The function to fire when the attr changes.
 * @return {Function} The attribute method method (confused?).
 * @method attrMethod
 * @static
 */
DGE.attrMethod = function(that, change) {

	var attr;

	return function(a) {

		if (a === undefined) return attr;
		attr = a;
		if (change) change.apply(that, arguments);

		return that;

	};

};

/**
 * Sends a log message to the platform running Diggy. All parameters are passed through.
 * @method log
 * @static
 */
DGE.log = function() {

	switch (DGE.platform.name) {
		case DGE.platform.BROWSER:
			try {
				if (console && console.log) {
					console.log.apply(DGE, arguments);
				}
			} catch(e) {
				//console.log(Array.prototype.join.apply(arguments, [',']));
			}
			break;
		case DGE.platform.TITANIUM:
			//Titanium.API.info.apply(DGE, arguments);
			Titanium.API.info(arguments[0]);
			break;
	}

};

/**
 * Extends an object.
 * @param {Function} P The parent object to extend.
 * @param {Function} F The object to extend with.
 * @return {Function} F, having extended P.
 * @method extend
 * @static
 */
DGE.extend = function(P, F) {
	F.prototype = new P();
	return F;
};

/**
 * Creates a custom event method.
 * @param {Object} that The scope to execute in.
 * @param {Function} change The function to fire when the attr changes.
 * @return {Function} An event method.
 * @method eventMethod
 * @static
 */
DGE.eventMethod = function(that, change) {

	var e;

	return function(fn) {

		if (fn === undefined) {
			if (e) e.apply(that);
		} else {
			e = fn;
			if (change) change.apply(that, arguments);
		}

		return that;

	};

};

/**
 * Formats a number to a human-readable format (eg, 1234 = 1,234).
 * @param {Number} n The number to format.
 * @return {String} The formatted number.
 * @method formatNumber
 * @static
 */
DGE.formatNumber = function(n) {

	if (!n && (n !== 0)) return '';

	var reverse = [];
	n = n.toString();

	for (var i = 1; i <= n.length; i++) {
		reverse.push(n[n.length - i]);
		if (!(i % 3) && (i < n.length)) reverse.push(',');
	}

	reverse = reverse.reverse();
	return reverse.join('');

};

/**
 * Gets the new coords based on angle and velocity.
 * @param {Number} angle The angle to use (0-360).
 * @param {Number} velocity The velocity to use.
 * @method getCoordsByAngleVelocity
 * @return {Object} An object of coordinates as: {x : x, y : y}.
 * @static
 */
DGE.getCoordsByAngleVelocity = function(angle, velocity) {

	angle = (270 - angle);
	var r = ((angle * Math.PI) / 180);

	return {
		x : (Math.sin(r) * velocity),
		y : (Math.cos(r) * velocity)
	};

};

/**
 * Gets a DOM element.
 * @param {Object | String} Element or String (id).
 * @return {Object} The DOM element (or undefined on failure).
 * @method getNode
 * @static
 */
DGE.getNode = function(el) {
	if (typeof(el) == 'object') {
		return el;
	} else {
		return document.getElementById(el);
	}
};

/**
 * Gets the current UNIX timestamp.
 * @return {Number} The timestamp.
 * @method getTimestamp
 * @static
 */
DGE.getTimestamp = function() {
	return Math.round((new Date()).getTime() / 1000);
};

/**
 * Gets the current UNIX timestamp in milliseconds.
 * @return {Number} The timestamp.
 * @method getTimestampInMS
 * @static
 */
DGE.getTimestampInMS = function() {
	return Math.round((new Date()).getTime());
};

/**
 * Generates a random string of n characters.
 * @param {Number} length The length of the key (default: 10).
 * @return {Number} The random string.
 * @method makeId
 * @static
 */
DGE.makeId = function(length) {

	var str = '';
	length = (length || 10);

	for (var i = 0; i < length; i++) {
		str += String.fromCharCode(DGE.rand(97, 122)); // a-z
	}

	return str;

};

/**
 * Adds an event listener.
 * @param {Object} el The element to attach to.
 * @param {String} e The event to watch.
 * @param {Function} fn The function to attach.
 * @method on
 * @static
 */
DGE.on = (document.addEventListener ? function(el, e, fn) {
		el.addEventListener(e, fn, false);
	} : function(el, e, fn) {
		el.attachEvent('on' + e, fn);
	}
);

/**
 * Generate a random number based on the passed range.
 * @param {Number | Array} from The starting point (or an Array to return a random index).
 * @param {Number} to The ending point.
 * @return {Number} The random number.
 * @method rand
 * @static
 */
DGE.rand = function(from, to) {

	if (from.length === undefined) {
		return (from + Math.floor((to - from + 1) * Math.random())); 
	} else {
		return arguments.callee(0, (from.length - 1));
	}

};

/**
 * Sets a style on a DOM node, correcting for cross-browser support.
 * @param {Object} el The DOM node to work on.
 * @param {String} style The style to apply (also accepts a key/value object).
 * @param {Object} value The style value to apply.
 * @method setCSS
 * @static
 */
DGE.setCSS = (function() {

	function dashToCamelCase(text) {

		var camelCase = '';

		for (var i = 0; i < text.length; i++) {
			if (text[i] == '-') {
				i++;
				camelCase += text[i].toUpperCase();
			} else {
				camelCase += text[i];
			}
		}

		return camelCase;

	};

	return function(el, style, value) {

		if (typeof(style) == 'object') {

			for (var k in style) {
				arguments.callee(el, k, style[k]);
			}

		}

		// Handle cross-platform issues here
		switch (style) {

			case 'border-radius':
				el.style['border-radius'] = value;
				el.style['-moz-border-radius'] = value;
				el.style['-webkit-border-radius'] = value;
				return el;

			case 'box-shadow':
				el.style['box-shadow'] = value;
				el.style['-moz-box-shadow'] = value;
				el.style['-webkit-box-shadow'] = value;
				/*
					If I *ever* feel like wasting some time, I guess I could make this work in IE. Here's how:
					filter: progid:DXImageTransform.Microsoft.dropshadow(OffX=0px, OffY=0px, Color='#ffffff'); / IE6,IE7 /
					-ms-filter: "progid:DXImageTransform.Microsoft.dropshadow(OffX=0px, OffY=0px, Color='#ffffff')"; / IE8 /
				*/
				break;

			case 'float':
				el.style.cssFloat = value;
				el.style.styleFloat = value;
				return el;

			case 'opacity':
				el.style.filter = DGE.sprintf('alpha(opacity=%s)', value);
				el.style.opacity = (value / 100);
				return el;

			case 'rotation':
				// Known bug: this doesn't work in Firefox, though setting via Firebug works ...
				el.style['-moz-transform'] = DGE.sprintf('rotate(%s)', value);
				el.style['-webkit-transform'] = DGE.sprintf('rotate(%s)', value);
				return el;

		}

		style = dashToCamelCase(style);
		el.style[style] = value;

	};

})();

/**
 * Sort of emulates the sprintf() function in C (replaces %s with the next argument).
 * @param {String} str The string to replace, followed by any number of replacements.
 * @return {String} The replaced string.
 * @method sprintf
 * @static
 */
DGE.sprintf = function(str) {

	for (var i = 1; i < arguments.length; i++) {
		str = str.replace(/%s/, arguments[i]);
	}

	return str;

};

/**
 * Vibrates the platform (if supported, for mobile devices).
 * @method vibrate
 * @static
 */
DGE.vibrate = function() {

	if (DGE.platform.name == DGE.platform.TITANIUM) {
		Titanium.Media.vibrate();
	}

};
