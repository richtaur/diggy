// --- DOCS DONE
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

	var down = false,
		fns = {
			click : DGE.eventMethod(DGE.Mouse),
			move : DGE.eventMethod(DGE.Mouse),
			up : DGE.eventMethod(DGE.Mouse),
			down : DGE.eventMethod(DGE.Mouse),
			over : DGE.eventMethod(DGE.Mouse),
			out : DGE.eventMethod(DGE.Mouse)
		},
		x = 0,
		y = 0;

	DGE.addEvent(window, 'mousedown', function(e) {
		down = true;
		fns.down(e);
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

		fns.move(e);

	});

	return {

		/**
		 * Read-only: is set to true if the mouse button is currently down.
		 * @property _down
		 * @final
		 * @static
		 * @type Boolean
		 */
		_down : down,

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
		_y, y,

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
		move : fns.move,

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
		down : fns.down,

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
