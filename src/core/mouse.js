/**
 * Properties explaining the currently state of the mouse.

 * <h3>Example usage:<h3>
 * <ol>
 *  <li>DGE.Mouse.out(DGE.stop);</li>
 *  <li>DGE.Mouse.over(DGE.start);</li>
 *	<li>DGE.Mouse.click(function() {</li>
 *  <li>&nbsp;&nbsp;new DGE.Text({text : DGE.Mouse.x + ', ' + DGE.Mouse.y});</li>
 *  <li>});</li>
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
	 * @final
	 * @static
	 * @type Boolean
	 */
	down : false,

	/**
	 * Read-only: The current x position of the mouse cursor.
	 * @property x
	 * @default 0
	 * @final
	 * @static
	 * @type Number
	 */
	x : 0,

	/**
	 * Read-only: The current y position of the mouse cursor.
	 * @property y
	 * @default 0
	 * @final
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
