/**
 * Properties explaining the currently state of the mouse.

 * <h3>Example usage:<h3>
 * <ol>
 *	<li>var x = DGE.Mouse.x;</li>
 *	<li>var y = DGE.Mouse.y;</li>
 *	<li>if (DGE.Mouse.down) DGE.log('mouse is down');</li>
 *	<li></li>
 *	<li>// Listen for the mouse click event</li>
 *	<li>DGE.stage.on('click', myClickFunction);</li>
 * </ol>

 * @namespace DGE
 * @class Mouse
 * @static
 */
DGE.Mouse = {

	/**
	 * Read-only: true if the mouse is currently down, false if it's up.
	 * @property down
	 * @default false
	 * @static
	 * @type Boolean
	 */
	down : false,

	/**
	 * Read-only: The current x position of the mouse cursor.
	 * @property x
	 * @default 0
	 * @static
	 * @type Number
	 */
	x : 0,

	/**
	 * Read-only: The current y position of the mouse cursor.
	 * @property y
	 * @default 0
	 * @static
	 * @type Number
	 */
	y : 0

};

DGE.on(window, 'mousedown', function(e) {
	DGE.Mouse.down = true;
});

DGE.on(window, 'mouseup', function(e) {
	DGE.Mouse.down = false;
});

DGE.on(window, 'mousemove', function(e) {

	var x, y;

	if (e.clientX === undefined) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x = e.clientX;
		y = e.clientY;
	}

	DGE.Mouse.x = x;
	DGE.Mouse.y = y;

});
