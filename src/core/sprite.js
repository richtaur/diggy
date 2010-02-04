/**
 * An extensible Sprite class that normalizes DOM API and behavior.
 * @param {Object} conf The configuration settings for this new Sprite object.
 * @namespace DGE
 * @class Sprite
 * @constructor
 */
DGE.Sprite = DGE.Object.make(function(conf) {
	this.initSprite(conf);
}, {
	active : false,
	angle : 0,
	delay : DGE.Interval.formatFPS(30),
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
		this.interval.setDelay(delay);
	},
	'change:image' : function(url) {
		this.setCSS(
			'background-image',
			DGE.sprintf('url(%s)', url)
		);
	},
	'change:opacity' : function(opacity) {
		this.setCSS('opacity', opacity);
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

	if (conf.id) {
		this.node = DGE.getNode(conf.id);
		if (!this.node) this.node = document.createElement('div');
	} else {
		conf.parent = (conf.parent || DGE.stage);
		this.node = document.createElement('div');
		DGE.stage.node.appendChild(this.node);
	}

	this.setCSS({
		overflow : 'hidden',
		position : 'absolute'
	});

	var that = this;

	this.interval = new DGE.Interval(function() {

		if (that.get('moving')) that.move();

		that.fire('ping');

	}, conf.delay, this);

	return this.init(conf);

};

/**
 * Centers this Sprite within its parent.
 * @param {String} which undefined to center both X and Y, or 'x' or 'y' separately.
 * @return {Object} this (for chaining).
 * @method centerXY
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
 * Check if a Sprite is out of the viewport.
 * @param {Boolean} entirely When set to true, will check if the Sprite is entirely out of bounds. False just checks if any part is out instead of the entire region.
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
	var velocity = this.get('velocity');

	if (
		(typeof(angle) != 'number')
		|| (!velocity)
	) return this;

	// What the fuck is wrong with me I used to know how to do this
	angle = (270 - angle);
	var r = ((angle * Math.PI) / 180);

	this.x += (Math.sin(r) * velocity);
	this.y += (Math.cos(r) * velocity);

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

	return this.setCSS({
		left : (this.x + 'px'),
		top : (this.y + 'px'),
		'z-index' : this.z
	});

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
