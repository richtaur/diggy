/**
 * Diggy (DGE): DHTML Game Engine.<br>
 * http://diggy.sistertrain.com/
 * @namespace
 * @module Diggy
 */

// TODO: Scenes? Think about transitions. Do layers even make sense?
/* TODO: think about how I was using DGE.layers before, like doing this.stats and this.movesText
that's some ugliness, because Sprite is already such a packed Object. If you did your own this.add (for a sprite)
you'd overwrite an important method. Perhaps .children or something? (yes. just audit this)
*/
// TODO: get rid of DISPLAY_WIDTH and STAGE_WIDTH, etc.

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
		name : 'alpha 0',
		/**
		 * The version of Diggy represented as an integer.
		 * @final
		 * @property version.number
		 * @type Number
		 */
		number : 0
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
				console.log.apply(DGE, arguments);
			} catch(e) {
				console.log(Array.prototype.join.apply(arguments, [',']));
			}
			break;
		case DGE.platform.TITANIUM:
			Titanium.API.info.apply(DGE, arguments);
			break;
	}

};

/**
 * Execute a function immediately.
 * @param {Function} fn The function to call.
 * @param {Number} ms (optional) The number of milliseconds to wait (via setTimeout).
 * @param {Object} scope (optional) The scope within which to call the function.
 * @method execScript
 * @static
 * TODO might not need this anymore if we ditch SM2
 */
DGE.exec = function(fn, ms, scope) {

	var fire = function() {
		fn.apply(scope);
	};

	if (ms) {
		setTimeout(fire, ms);
	} else {
		fire();
	}

};

/**
 * Executes an external JavaScript file.
 * @param {String} src The URL of the file.
 * @method execScript
 * @static
 */
DGE.execScript = function(src) {
	var script = document.createElement('script');
	script.src = (DGE.conf.libsURL + src);
	document.getElementsByTagName('head')[0].appendChild(script);
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
    return (from + Math.floor((to - from + 1) * (Math.random() % 1)));
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
			case 'float':
				el.style.cssFloat = value;
				el.style.styleFloat = value;
				return el;
			case 'opacity':
				el.style.filter = DGE.sprintf('alpha(opacity=%s)', (value * 100));
				el.style.opacity = value;
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
 * @FINAL
 */
DGE.vibrate = function() {

	if (DGE.platform.name == DGE.platform.TITANIUM) {
		Titanium.Media.vibrate();
	}

};
