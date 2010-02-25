/**
 * Keyboard control utility.
 * @namespace DGE
 * @class Keyboard
 * @static
 */
DGE.Keyboard = new DGE.Object();

/**
 * The ctrl key.
 * @final
 * @property CONTROL
 * @type Number
 */
DGE.Keyboard.CONTROL = 17;

/**
 * The ESC key.
 * @final
 * @property ESCAPE
 * @type Number
 */
DGE.Keyboard.ESCAPE = 27;

/**
 * The shift key.
 * @final
 * @property SHIFT
 * @type Number
 */
DGE.Keyboard.SHIFT = 16;

/**
 * The space key.
 * @final
 * @property SPACE
 * @type Number
 */
DGE.Keyboard.SPACE = 32;

/**
 * The tab key.
 * @final
 * @property TAB
 * @type Number
 */
DGE.Keyboard.TAB = 9;

/**
 * The up arrow.
 * @final
 * @property UP
 * @type Number
 */
DGE.Keyboard.UP = 38;

/**
 * The down arrow.
 * @final
 * @property DOWN
 * @type Number
 */
DGE.Keyboard.DOWN = 40;

/**
 * The left arrow.
 * @final
 * @property LEFT
 * @type Number
 */
DGE.Keyboard.LEFT = 37;

/**
 * The right arrow.
 * @final
 * @property RIGHT
 * @type Number
 */
DGE.Keyboard.RIGHT = 39;

/*
 * Listens for a specific keyboard code, like The Konami Code.
 * @param {Array} code An array of Number variables to look for (uses e.keyCode).
 * @param {Function} fn The function to fire when the code is entered.
 * @static
 * @method code
 */
DGE.Keyboard.code = function(code, fn) {

	var index = 0;

	DGE.on(window, 'keydown', function(e) {

		if (e.keyCode == code[index]) {
			if (++index == code.length) {
				index = 0;
				fn();
			}
		} else {
			index = 0;
		}

	});

};

/**
 * Lets you know if the specificed key is being held down.
 * @param {String} key The key to check for.
 * @return {Boolean} true if the key is down, false otherwise.
 * @static
 * @method isDown
 */
DGE.Keyboard.isDown = function(key) {
	return !!DGE.Keyboard.get(DGE.sprintf('keyDown:%s', key));
};

DGE.on(window, 'keydown', function(e) {
	DGE.Keyboard.set(DGE.sprintf('keyDown:%s', e.keyCode), true);
	DGE.Keyboard.fire('keyDown', e.keyCode);
});

DGE.on(window, 'keyup', function(e) {
	DGE.Keyboard.set(DGE.sprintf('keyDown:%s', e.keyCode), false);
	DGE.Keyboard.fire('keyUp', e.keyCode);
});
