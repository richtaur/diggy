// TODO: CENTER DOESNT FUCKING WORK
// TODO: this is a big one ... clicking bubbles, and we don't want it to, right?
// TODO: add rotationVelocity? just like moving to x, y
/**
 * An extensible Sprite class that normalizes DOM API and behavior.
 * @param {Object} conf The configuration settings for this new Sprite object.
 * @namespace DGE
 * @class Sprite
 * @constructor
 * @extends DGE.Object
 */
DGE.Sprite = DGE.Object.make(function(conf) {
	this.initSprite(conf);
}, {
	active : false,
	angle : 0,
	delay : DGE.Interval.formatFPS(30),
	frame : 0,
	framesMax : 0,
	image : null,
	opacity : 100,
	rotation : 0,
	velocity : 0,
	visible : true,
	width : 16,
	height : 16,
	x : 0,
	y : 0,
	z : 1
}, {
	'change:cursor' : function(cursor) {
		if (cursor === true) cursor = 'pointer';
		if (cursor === false) cursor = 'auto';
		this.setCSS('cursor', cursor);
	},
	'change:delay' : function(delay) {
		this.interval.set('delay', delay);
	},
	'change:image' : function(url) {
		if (url) this.setCSS(
			'background-image',
			DGE.sprintf('url(%s)', url)
		);
	},
	'change:opacity' : function(opacity) {
		this.setCSS('opacity', opacity);
	},
	'change:parent' : function(obj) {
		this.parent = obj;
		obj.node.appendChild(this.node);
	},
	'change:rotation' : function(angle) {
		this.setCSS('rotation', DGE.sprintf('%sdeg', angle));
	},
	'change:visible' : function(visible) {
		this.setCSS('display', (visible ? '' : 'none'));
	},
	'change:width' : function(width) {
		this.width = width;
		this.setCSS('width', DGE.sprintf('%spx', width));
	},
	'change:height' : function(height) {
		this.height = height;
		this.setCSS('height', DGE.sprintf('%spx', height));
	},
	'change:x' : function(x) {
		this.x = x;
		this.setCSS('left', DGE.sprintf('%spx', x));
	},
	'change:y' : function(y) {
		this.y = y;
		this.setCSS('top', DGE.sprintf('%spx', y));
	},
	'change:z' : function(z) {
		this.z = z;
		this.setCSS('z-index', z);
	},
	'on:click' : function(fn) {

		var that = this;

		this.node.onclick = function() {
			fn.apply(that, arguments);
		};

	},
	'on:mouseDown' : function(fn) {

		var that = this;

		this.node.onmousedown = function() {
			fn.apply(that, arguments);
		};

	},
	'on:mouseUp' : function(fn) {

		var that = this;

		this.node.onmouseup = function() {
			fn.apply(that, arguments);
		};

	},
	'on:mouseOver' : function(fn) {

		var that = this;

		this.node.onmouseover = function() {
			fn.apply(that, arguments);
		};

	},
	'on:mouseOut' : function(fn) {

		var that = this;

		this.node.onmouseout = function() {
			fn.apply(that, arguments);
		};

	},
	remove : function() {
		this.node.parentNode.removeChild(this.node);
		this.stop();
	}
});

/**
 * Sets up the Sprite's interval, node, and other necessities.
 * @param {Object} conf The configuration settings for this new Sprite object.
 * @return {Object} this (for chaining).
 * @method initSprite
 */
DGE.Sprite.prototype.initSprite = function(conf) {

	if (conf === undefined) return;
	if (conf.id) this.node = DGE.getNode(conf.id);

	if (!this.node) {
		conf.parent = (conf.parent || DGE.stage);
		this.node = document.createElement('div');
	}

	this.setCSS({
		overflow : 'hidden',
		position : 'absolute'
	});

	var that = this;

	this.interval = new DGE.Interval({
		delay : conf.delay,
		interval : function() {

			if (that.get('velocity')) that.move();
			that.fire('ping');

		},
		scope : that
	});

	return this.init(conf);

};

/**
 * Gets or sets the angle used to travel from this Sprite to another.
 * @param {Object} target The target Sprite.
 * @param {Boolean} setNow true to set the angle immediately (then returns this instead of angle).
 * @return {Number | Object} The angle or this for chaining.
 * @method angleTo
 */
DGE.Sprite.prototype.anchorToStage = function() {

	var p = this.parent;
	var x = this.x;
	var y = this.y;

	while (p) {
		x += p.x;
		y += p.y;
		p = p.parent;
	}

	this.set('parent', DGE.stage);
	this.plot(x, y);

	return this;

};

/**
 * Centers this Sprite within its parent.
 * @param {String} which undefined to center both X and Y, or 'x' or 'y' separately.
 * @return {Object} this (for chaining).
 * @method center
 */
DGE.Sprite.prototype.center = function(which) {

	var x, y;

	if (which === undefined) {
		x = true;
		y = true;
	} else {
		if (which == 'x') {
			x = true;
		} else {
			y = true;
		}
	}

	var p = this.node.parentNode;
	var width = (p.offsetWidth || DGE.stage.width);
	var height = (p.offsetHeight || DGE.stage.height);

	if (x) var newX = ((width / 2) - (this.node.offsetWidth / 2));
	if (y) var newY = ((height / 2) - (this.node.offsetHeight / 2));

	return this.plot(newX, newY);

};

/**
 * Centers this Sprite based on another Sprite.
 * @param {Object} target The target Sprite object to center on.
 * @return {Object} this (for chaining).
 * @method centerOn
 */
DGE.Sprite.prototype.centerOn = function(target) {

	var parent = target.parent;
	var x = target.x;
	var y = target.y;

	// This Sprite's offset
	x -= (this.width / 2);
	y -= (this.height / 2);

	// Target Sprite's offset
	x += (target.width / 2);
	y += (target.height / 2);

	// Check parent's offset
	while (parent !== DGE.stage) {
		x += target.parent.x;
		y += target.parent.y;
		parent = parent.parent;
	}

	return this.plot(x, y);

};

/**
 * Fill the Sprite with the passed color.
 * @param {String} color A CSS-valid color (hexcode, etc.).
 * @param {Boolean} fillAll true to fill the entire Sprite, overriding any image set.
 * @return {Object} this (for chaining).
 * @method fill
 */
DGE.Sprite.prototype.fill = function(color, fillAll) {
	if (fillAll) {
		return this.setCSS('background', color);
	} else {
		return this.setCSS('background-color', color);
	}
};

/**
 * Gets the angle used to travel from this Sprite to another.
 * @param {Object} mixed Can be two numbers (x, y) or an object ({x : x, y : y})
 * which is also compatible with another Sprite, such as: spriteOne.getAngleTo(spriteTwo);
 * @return {Number} The angle from this Sprite to the passed coordinates.
 * @method getAngleTo
 */
DGE.Sprite.prototype.getAngleTo = function() {

	var obj = arguments[0];

	if (typeof(obj) == 'object') {
		if (obj.getCenter) {
			var center = obj.getCenter();
			var toX = center.x;
			var toY = center.y;
		} else {
			var toX = obj.x;
			var toY = obj.y;
		}
	} else {
		var toX = arguments[0];
		var toY = arguments[1];
	}

	var center = this.getCenter();
  var x = (center.x - toX);
  var y = (center.y - toY);
  var angle = Math.atan2(y, x);
  angle = ((angle * 180) / Math.PI);

	return angle;

};

/**
 * Gets the coordinates at the center of this Sprite.
 * @return {Object} The cordinates at the center represented as {x : x, y : y}.
 * @method getCenter
 */
DGE.Sprite.prototype.getCenter = function() {

	return {
		x : (this.x + (this.width / 2)),
		y : (this.y + (this.height / 2))
	};

}

/**
 * Checks if a Sprite is at the passed coordinates.
 * @param {Object} mixed You can pass in either (x, y) or ({x : x, y : y}).
 * @return {Boolean} true if the Sprite has any regions outside of the stage's bounds.
 * @method isOutOfBounds
 */
DGE.Sprite.prototype.isAt = function() {

	if (typeof(arguments[0]) == 'number') {
		var x = arguments[0];
		var y = arguments[1];
	} else {
		var x = arguments[0].x;
		var y = arguments[0].y;
	}

	return (
		(this.x == x)
		&& (this.y == y)
	);

};

/**
 * Checks if a Sprite is out of the viewport.
 * @param {Boolean} entirely When set to true, will check if the Sprite is entirely out of bounds. false just checks if any part is outside.
 * @return {Boolean} true if the Sprite has any regions outside of the stage's bounds.
 * @method isOutOfBounds
 */
DGE.Sprite.prototype.isOutOfBounds = function(entirely) {

	if (entirely) return (
		(this.x < -this.width)
		|| (this.x > DGE.stage.width)
		|| (this.y < -this.height)
		|| (this.y > DGE.stage.height)
	);

	return (
		(this.x < 0)
		|| (this.x > (DGE.stage.width - this.width))
		|| (this.y < 0)
		|| (this.y > (DGE.stage.height - this.height))
	);

};

/**
 * Detects if this Sprite is intersected with another Sprite.
 * @param {Sprite} sprite The other Sprite to check the boundaries of.
 * @return {Boolean} true if the Sprites are touching, false if they're not.
 * @method isTouching
 */
DGE.Sprite.prototype.isTouching = function(sprite) {

	var ax1 = this.x;
	var ax2 = (this.x + this.width);
	var ay1 = this.y;
	var ay2 = (this.y + this.height);
	var bx1 = sprite.x;
	var bx2 = (sprite.x + sprite.width);
	var by1 = sprite.y;
	var by2 = (sprite.y + sprite.height);

	return (
		(ax1 < bx2)
		&& (ax2 > bx1)
		&& (ay1 < by2)
		&& (ay2 > by1)
	);

};

/**
 * Moves this Sprite within two dimensions based on angle and velocity.
 * @return {Object} this (for chaining).
 * @method move
 */
DGE.Sprite.prototype.move = function() {

	var angle = this.get('angle');
	var frame = this.get('frame');
	var framesMax = this.get('framesMax');
	var velocity = this.get('velocity');

	if (frame < framesMax) {
		var offset = (frame / framesMax);
	} else {
		var offset = 1;
	}

	if (!velocity) return this;

	// What the fuck is wrong with me I used to know how to do this
	angle = (270 - angle);
	var r = ((angle * Math.PI) / 180);

	this.x += (Math.sin(r) * velocity * offset);
	this.y += (Math.cos(r) * velocity * offset);

	this.offset('frame', 1);

	return this.plot();

};

/**
 * Positions the Sprite based on the passed parameters or last settings to .x, .y and .z.
 * Examples:<br>
 * sprite.plot(); // uses .x, .y and .z
 * sprite.plot(x, y);
 * sprite.plot({x : x, y : y});
 * sprite.plot({z : z});
 * @return {Object} this (for chaining).
 * @method plot
 */
DGE.Sprite.prototype.plot = function() {

	var arg = arguments[0];

	if (arg !== undefined) {

		if (typeof(arg) == 'number') {
			// sprite.plot(x, y, z);
			this.x = arg;
			if (typeof(arguments[1]) == 'number') {
				this.y = arguments[1];
			}
			if (typeof(arguments[2]) == 'number') {
				this.z = arguments[2];
			}
		} else {
			// sprite.plot({x : x, y : y, z : z});
			if (typeof(arg.x) == 'number') {
				this.x = arg.x;
			}
			if (typeof(arg.y) == 'number') {
				this.y = arg.y;
			}
			if (typeof(arg.z) == 'number') {
				this.z = arg.z;
			}
		}

	}

	this.set('x', this.x);
	this.set('y', this.y);
	this.set('z', this.z);

	return this;

};

/**
 * Sets multiple styles on this Sprite's DOM Object.
 * @param {String || Object} id Either the string to get/set or an Object of key/values to set.
 * @param {String || undefined} value Either a string for the key's value or undefined if id is an Object.
 * @return {Object} this (for chaining).
 * @method setCSS
 */
DGE.Sprite.prototype.setCSS = function(key, value) {
	DGE.setCSS(this.node, key, value);
	return this;
};

/**
 * Shows this Sprite (under the hood: unhides it using CSS).
 * @return {Object} this (for chaining)
 * @method show
 */
DGE.Sprite.prototype.show = function() {
	return this.set('visible', true);
};

/**
 * Hides this Sprite.
 * @param {Number} delay (optional) If delay is set, suspends the hide until the passed milliseconds.
 * @return {Object} this (for chaining).
 * @method hide
 */
DGE.Sprite.prototype.hide = function(delay) {

	var that = this;

	function hide() {
		that.set('visible', false);
	};

	if (delay) {
		setTimeout(hide, delay);
	} else {
		hide();
	}

	return this;

};

/**
 * Starts (or restarts) the interval.
 * @return {Object} this (for chaining).
 * @method start
 */
DGE.Sprite.prototype.start = function() {
	this.set('frame', 0);
	this.interval.start();
	return this.set('active', true);
};

/**
 * Stops the interval.
 * @return {Object} this (for chaining).
 * @method stop
 */
DGE.Sprite.prototype.stop = function() {
	this.interval.stop();
	return this.set('active', false);
};

/**
 * Toggles the display of the Sprite (calls show or hide accordingly).
 * @return {Object} this (for chaining)
 * @method toggleVisibility
 */
DGE.Sprite.prototype.toggleVisibility = function() {
	if (this.get('visible')) {
		return this.set('visible', false);
	} else {
		return this.set('visible', true);
	}
};
