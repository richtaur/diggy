/* TODO:
instead of DGE.mouse.down(fn);
implement this: DGE.mouse.on('down', fn);
... should that be on stage? hrm. also, examine input.js and mouse.js
maybe maybe them input.keyboard.js and input.mouse.js?
and while on that subject, DGE.input.mouse? *sigh*
*/
/**
 * The DGE.Mouse class contains methods and properties to handle player input from a mouse.

 * <h3>Example usage:<h3>
 * <ol>
 *  <li>DGE.Mouse.out(DGE.stop);</li>
 *  <li>DGE.Mouse.over(DGE.start);</li>
 *	<li>DGE.Mouse.click(function() {</li>
 *  <li>&nbsp;&nbsp;new DGE.Text({text : DGE.Mouse._x + ', ' + DGE.Mouse._y});</li>
 *  <li>});</li>
 * </ol>

 * @namespace DGE
 * @class Mouse
 * @final
 * @static
 */
DGE.Mouse = (function() {

	var down = false;
	var fns = {
		click : DGE.eventMethod(DGE.Mouse),
		move : function() {},
		up : DGE.eventMethod(DGE.Mouse),
		down : function() {},
		over : DGE.eventMethod(DGE.Mouse),
		out : DGE.eventMethod(DGE.Mouse)
	};
	var x = 0;
	var y = 0;

	DGE.addEvent(window, 'mousedown', function(e) {
		down = true;
		fns.down(x, y);
	});

	DGE.addEvent(window, 'mouseup', function(e) {
		down = false;
		fns.up(e);
	});

	DGE.addEvent(window, 'mousemove', function(e) {

		if (e.clientX === undefined) {
			x = e.pageX;
			y = e.pageY;
		} else {
			x = e.clientX;
			y = e.clientY;
		}

		fns.move(x, y);

	});

	return {

		isDown : function() {
			return down;
		},

		/**
		 * Read-only: The current x position of the mouse cursor.
		 * @property _x
		 * @default 0
		 * @final
		 * @static
		 * @type Number
		 */
		_x : x,

		/**
		 * Read-only: The current y position of the mouse cursor.
		 * @property _y
		 * @default 0
		 * @final
		 * @static
		 * @type Number
		 */
		_y : y,

		/**
		 * Fires the listener of the stage click event, or sets the listener to a new function.
		 * The listener receives the event object as its only argument.
		 * @param {Function | undefined} fn Either the new function to assign as the listener or undefined to fire the event.
		 * @method click
		 * @final
		 * @static
		 */
		click : fns.click,

		/**
		 * Fires the listener of the stage's mouse move event, or sets the listener to a new function.
		 * The listener receives the event object as its only argument.
		 * @param {Function | undefined} fn Either the new function to assign as the listener or undefined to fire the event.
		 * @method move
		 * @final
		 * @static
		 */
		move : function(e) {
			fns.move = e;
		},

		/**
		 * Fires the listener of the stage mouse up event, or sets the listener to a new function.
		 * The listener receives the event object as its only argument.
		 * @param {Function | undefined} fn Either the new function to assign as the listener or undefined to fire the event.
		 * @method up
		 * @final
		 * @static
		 */
		up : fns.up,

		/**
		 * Fires the listener of the stage mouse down event, or sets the listener to a new function.
		 * The listener receives the event object as its only argument.
		 * @param {Function | undefined} fn Either the new function to assign as the listener or undefined to fire the event.
		 * @method down
		 * @final
		 * @static
		 */
		down : function(e) {
			fns.down = e;
		},

		/**
		 * Fires the listener of the stage mouse over event, or sets the listener to a new function.
		 * The listener receives the event object as its only argument.
		 * @param {Function | undefined} fn Either the new function to assign as the listener or undefined to fire the event.
		 * @method over
		 * @final
		 * @static
		 */
		over : fns.over,

		/**
		 * Fires the listener of the stage mouse out event, or sets the listener to a new function.
		 * The listener receives the event object as its only argument.
		 * @param {Function | undefined} fn Either the new function to assign as the listener or undefined to fire the event.
		 * @method out
		 * @final
		 * @static
		 */
		out : fns.out
		
	};

})();
