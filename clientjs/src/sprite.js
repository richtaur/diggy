// not yet --- DOCS DONE

// TODO: there are issues with x(), y(), setXY(), cneter(), dimensions, plot(), holy FUCK how should this work?!
// TODO: also think about _active and how that should work

/**
 * An extensible Sprite class that normalizes DOM API and behavior.
 * @param {Object} conf The configuration settings for this new Sprite object.
 * @namespace DGE
 * @class Sprite
 * @constructor
 */
DGE.Sprite = function(conf) {
	if (conf) this.init.apply(this, [conf]);
};

/**
 * Read-only: this Sprite's unique id.
 * @default null
 * @final
 * @property _id
 * @type String
 */
DGE.Sprite.prototype._id = null;

/**
 * Read-only: whether the Sprite is active or not.
 * @default true
 * @property _active
 * @type String
 */
DGE.Sprite.prototype._active = true;

/**
 * Read-only: this Sprite's children.
 * @default null
 * @property _children
 * @type Object
 */
DGE.Sprite.prototype._children = null;

/**
 * Read-only: this Sprite's parent.
 * @default null
 * @property _parent
 * @type Object
 */
DGE.Sprite.prototype._parent = null;

/**
 * Read-only: this Sprite's DOM node.
 * @default null
 * @final
 * @property _node
 * @type Object
 */
DGE.Sprite.prototype._node = null;

/**
 * Read-only: is set to true when .show() is called, false when .hide() is called.
 * @default true
 * @final
 * @property _visible
 * @type Boolean
 */
DGE.Sprite.prototype._visible = true;

/**
 * Read-only: the width of this Sprite.
 * @default 0
 * @final
 * @property _width
 * @type Number | String
 */
DGE.Sprite.prototype._width = 0;

/**
 * Read-only: the height of this Sprite.
 * @default 0
 * @final
 * @property _height
 * @type Number | String
 */
DGE.Sprite.prototype._height = 0;

/**
 * Read-only: the x coordinate of this Sprite.
 * @default 0
 * @final
 * @property _x
 * @type Number
 */
DGE.Sprite.prototype._x = 0;

/**
 * Read-only: the y coordinate of this Sprite.
 * @default 0
 * @final
 * @property _y
 * @type Number
 */
DGE.Sprite.prototype._y = 0;

/**
TODO: this entire method (currently 138 lines) needs auditing!
 * Initializes the Sprite: sets default confs and adds to the stage or another parent Sprite.
 * @param {Object} conf The configuration settings.
 * @param {Object} extra Additional confs to tack onto conf (helpful when batching).
 * @return {Object} this (for chaining).
 * @method init
 */
DGE.Sprite.prototype.init = function(conf, extra) {

  var attrs, fns, i, set;

  if (extra) for (i in extra) conf[i] = extra[i];

  // Default attribute values
  // TODO: audit this
  attrs = {
    element : DGE.Sprite.defaults.nodeName,
// TODO: tiles.js
    tWidth : DGE.Sprite.TILE_WIDTH,
    tHeight : DGE.Sprite.TILE_HEIGHT
  };

  for (i in attrs) if (conf[i] === undefined) conf[i] = attrs[i];

  // Attach some conf settings to this object
  // TODO this is the old way. use attrMethod(s) now
  set = {
    width : null,
    height : null,
		// TODO: move this shite to tiles.js
    tWidth : null,
    tHeight : null
  };

  for (i in set) if (i in conf) this[i] = conf[i];

	if (conf.id && DGE.getNode(conf.id)) {
		this._node = DGE.getNode(conf.id);
	} else {
		this._node = document.createElement(conf.element);
	}

  if (conf.className) this._node.className = conf.className;

	this.setCSS('overflow', 'hidden');
	this.setCSS('position', 'absolute');

	// Apply dynamic attributes and methods
  this.angleChange = DGE.eventMethod(this);
  this.angle = DGE.attrMethod(this, this.angleChange);
  this.clickChange = DGE.eventMethod(this, function(fn) {
		var that = this;
		this._node.onclick = function() {
			fn.apply(that);
		};
	});
  this.click = DGE.eventMethod(this, this.clickChange);
  this.cursor = DGE.attrMethod(this, function(cursor) {
		this.setCSS('cursor', (cursor ? 'pointer' : 'auto'));
	});
  this.downChange = DGE.eventMethod(this, function(fn) {
    var that = this;
    this._node.onmousedown = function() {
      fn.apply(that);
    };
  });
  this.down = DGE.eventMethod(this, this.downChange);
  this.fillChange = DGE.eventMethod(this, function(color, setAll) {
    if (setAll) {
			this.setCSS('background', color);
    } else {
			this.setCSS('background-color', color);
    }
  });
  this.fill = DGE.attrMethod(this, this.fillChange);
  this.groupChange = DGE.eventMethod(this);
  this.group = DGE.attrMethod(this, this.groupChange);
	this.imageChange = DGE.eventMethod(this, function(url) {
		this.setCSS(
			'background-image',
			DGE.printf('url(%s%s)', DGE.conf.baseURL, url)
		);
	});
	this.image = DGE.attrMethod(this, this.imageChange);
  this.move = DGE.eventMethod(this);
	this.onShow = DGE.eventMethod(this);
	this.onHide = DGE.eventMethod(this);
  this.ping = DGE.eventMethod(this);
  this.speedChange = DGE.eventMethod(this);
  this.speed = DGE.attrMethod(this, this.speedChange);
  this.zIndex = DGE.attrMethod(this, function(z) {
		this.setCSS('z-index', z);
	});

  // Methods to set immediately
  fns = {
		align : null,
    angle : null,
		center : null,
    click : null,
    cursor : null,
    down : null,
    fill : null,
    group : null,
    hide : null,
    image : null,
    move : null,
    onShow : null,
    onHide : null,
    opacity : null,
    ping : null,
    over : null,
    out : null,
    speed : null,
// TODO: got down working, but not up, because the event should be on the window, not this Sprite
    up : null,
		zIndex : null
  };

  for (i in fns) if (i in conf) this[i](conf[i]);

  // Recognize coordinates
	// TODO: this should be done in sprite.tiles.js now
	conf.x = (conf.x || 0);
	conf.y = (conf.y || 0);
	this.setXY(conf.x, conf.y);
	// TODO: ^ should that be there?
	this.dimensions(conf.width, conf.height);

	// All done! Append this thing someplace
	this._id = (conf.id || DGE.makeId());
	this._node.id = this._id;

	if (conf.addTo) {
		this.addTo(conf.addTo);
	} else if (conf.addTo !== false) {
		this.addTo(DGE.stage);
	}

	if (conf._active !== undefined) {
		this._active = conf._active;
	}

	return this;

};

/**
 * Adds a child Sprite to this parent Sprite.
 * @param {Object} sprite The child Sprite object to add to this parent Sprite.
 * @return {Object} this (for chaining).
 * @method addChild
 */
DGE.Sprite.prototype.addChild = function(sprite) {

	if (!this._children) this._children = {};
	this._children[sprite._id] = sprite;

	sprite._parent = this;

	this._node.appendChild(sprite._node);
	DGE.Sprite._objects[sprite._id] = sprite;

	return this;

};

/**
 * Adds this Sprite as a child to another parent Sprite.
 * @param {Object} sprite The parent sprite to add this Sprite to.
 * @return {Object} this (for chaining).
 * @method addTo
 */
DGE.Sprite.prototype.addTo = function(sprite) {
  sprite.addChild(this);
  return this;
};

/**
 * Aligns the Sprite within its container to the passed position.
 * @param {String} pos The position to align to (left, right, top, bottom).
 * @param {Number} offset An additional amount to offset by (optional).
 * @return {Object} this (for chaining).
 * @method align
 */
DGE.Sprite.prototype.align = function(pos, offset) {

	offset = (offset || 0);

	switch (pos) {
		case 'left':
			this.setXY(offset);
			break;
		case 'right':
			this.setXY(DGE.STAGE_WIDTH - this._width + offset);
			break;
		case 'top':
			this.setXY(undefined, offset);
			break;
		case 'bottom':
			this.setXY(undefined, (DGE.STAGE_HEIGHT - this._height + offset));
			break;
		default:
			throw new Error(this.printf('Unknown setting "%s"', attr));
	}

	return this;

};

/**
 * Aligns the Sprite within its container to the left.
 * @param {Number} offset An additional amount to offset by (optional).
 * @return {Object} this (for chaining).
 * @method alignLeft
 */
DGE.Sprite.prototype.alignLeft = function(offset) {
	return this.align('left', offset);
};

/**
 * Aligns the Sprite within its container to the right.
 * @param {Number} offset An additional amount to offset by (optional).
 * @return {Object} this (for chaining).
 * @method alignRight
 */
DGE.Sprite.prototype.alignRight = function(offset) {
	return this.align('right', offset);
};

/**
 * Aligns the Sprite within its container to the top.
 * @param {Number} offset An additional amount to offset by (optional).
 * @return {Object} this (for chaining).
 * @method alignTop
 */
DGE.Sprite.prototype.alignTop = function(offset) {
	return this.align('top', offset);
};

/**
 * Aligns the Sprite within its container to the bottom.
 * @param {Number} offset An additional amount to offset by (optional).
 * @return {Object} this (for chaining).
 * @method alignBottom
 */
DGE.Sprite.prototype.alignBottom = function(offset) {
	return this.align('bottom', offset);
};

/**
 * TODO
 */
DGE.Sprite.prototype.anchorToStage = function() {
	this.setXY(this.getAbsoluteXY());
	return this.addTo(DGE.stage);
};

/**
 * Gets the angle or sets the angle to move the Sprite.
 * Defined in constructor.
 * @param {Number} angle The new angle, or undefined to return the current angle value.
 * @return {Object | Number} this (for chaining) or the current angle value if no arguments are passed.
 * @method angle
 */
DGE.Sprite.prototype.angle = function(){};

/**
 * The event listener for when this.angle() is called to change the value of angle.
 * Defined in constructor.
 * @method angleChange
 */
DGE.Sprite.prototype.angleChange = function(){};

/**
 * Gets or sets the angle used to travel from this Sprite to another.
 * @param {Object} target The target Sprite.
 * @param {Boolean} set True to set the angle immediately (then returns this instead of angle).
 * @return {Number | Object} The angle or this for chaining.
 * @method angleTo
 */
DGE.Sprite.prototype.angleTo = function(target, set) {

	var coords = target.getAbsoluteXY();

	var toX = coords.x;
	var toY = coords.y;

  var x = (this._x - toX);
  var y = (this._y - toY);

  var angle = Math.atan2(y, x);
  angle = ((angle * 180) / Math.PI);

  if (set) {
    this.angle(angle);
		this.move = DGE.Sprite.move.angle;
/*
console.log('angle: ', this.angle());
console.log('speed: ', this.speed());
console.log('move: ', this.move);
*/
    return this;
  }

  return angle;

};

/**
 * Performs a batch of operations on the Sprite.
 * @param {Object} methods A key/value pair of methods to call with parameters to pass in.
 * @return {Object} this (for chaining).
 * @method batch
 */
DGE.Sprite.prototype.batch = function(methods) {

	for (var k in methods) {
		if (typeof(this[k]) == 'function') {
			this[k](methods[k]);
		} else {
			throw new Error(DGE.printf('%s is not a method', k));
		}
	}

	return this;

};

/**
 * Centers this Sprite horizontally and vertically within its parent.
 * @return {Object} this (for chaining).
 * @method center
 */
DGE.Sprite.prototype.center = function() {
	return this.centerXY(true, true);
};

/**
 * Centers this Sprite horizontally within its parent.
 * @return {Object} this (for chaining).
 * @method centerX
 */
DGE.Sprite.prototype.centerX = function() {
	return this.centerXY(true, false);
};

/**
 * Centers this Sprite vertically within its parent.
 * @return {Object} this (for chaining).
 * @method centerY
 */
DGE.Sprite.prototype.centerY = function() {
	return this.centerXY(false, true);
};

/**
 * Centers this Sprite within its parent.
 * @param {Boolean} x True to center horizontally.
 * @param {Boolean} y True to center vertically.
 * @return {Object} this (for chaining).
 * @method centerXY
 */
DGE.Sprite.prototype.centerXY = function(x, y) {

	var p = this._node.parentNode;
	var width = p.offsetWidth;
	var height = p.offsetHeight;
	var newX = ((width / 2) - (this._node.offsetWidth / 2));
	var newY = ((height / 2) - (this._node.offsetHeight / 2));

	width = (width || DGE.STAGE_WIDTH);
	height = (height || DGE.STAGE_HEIGHT);

	return this.setXY((x ? newX : undefined), (y ? newY : undefined));

};

/**
 * Centers this Sprite to another Sprite.
 * @param {Object} target The target Sprite object to center on.
 * @return {Object} this (for chaining).
 * @method centerOn
TODO this doesn't work for shit
 */
DGE.Sprite.prototype.centerOn = function(target) {

	var x = target._x;
	var y = target._y;

	// This Sprite's offset
	x -= (this._width / 2);
	y -= (this._height / 2);

	// Target Sprite's offset
	x += (target._width / 2);
	y += (target._height / 2);

	// Check parent's offset
	if (target._node.parentNode !== this._node.parentNode) {
		x += target._node.parentNode.offsetLeft;
		y += target._node.parentNode.offsetTop;
	}

	return this.setXY(x, y);

};

/**
 * Gets or sets the dimensions (width/height) of this Sprite.
 * @param {Number | undefined} width The width to set the Sprite or undefined to get the dimensions.
 * @param {Number} height (optional) The height of the Sprite.
 * @return {Object} this (for chaining) or an Object with width/height keys if no arguments passed.
 * @method dimensions
 */
DGE.Sprite.prototype.dimensions = function(width, height) {

	// No arguments means pass back {width,height}
	if ((width === undefined) && (height === undefined)) {

		return {
			width : this._width,
			height : this._height
		};

	}

	// Something is set so operate on either/both
	if (width !== undefined) {
		this._width = width;
		if (typeof(width) == 'number') width += 'px';
		this.setCSS('width', width);
	}

	if (height !== undefined) {
		this._height = height;
		if (typeof(height) == 'number') height += 'px';
		this.setCSS('height', height);
	}

	return this;

};

/**
 * The method to call at each iteration of DGE's main interval.
 * @return {Object} this (for chaining).
 * @method exec
 */
DGE.Sprite.prototype.exec = function() {

	return this.move()
		.ping();

};

/**
 * Fills the sprite with the passed color.
 * Defined in constructor.
 * @param {String} color The color to set.
 * @param {Boolean} setAll Set to true to set the entire background CSS rule and not just background-color.
 * @return {Object} this (for chaining).
 * @method fill
 */
DGE.Sprite.prototype.fill = function(){};

/**
 * The event listener for when this.fill() is called.
 * Defined in constructor.
 * @method fillChange
 */
DGE.Sprite.prototype.fillChange = function(){};

/**
 * Gets the Sprite's absolute coordinates (accounts for parent).
 */
DGE.Sprite.prototype.getAbsoluteXY = function() {

	var x = this._x;
	var y = this._y;
	var p = this._parent;

	while (p) {
		x += p._x;
		y += p._y;
		p = p._parent;
	}

	return {
		x : x,
		y : y
	};

};

/**
 * Gets or sets this Sprite's group.
 * @param {String | undefined} group The group to set or undefined to get the group.
 * @return {Object | String} this (for chaining) or the group if no arguments passed.
 * @method group
 */
DGE.Sprite.prototype.group = function(){};

/**
 * The event listener for when this.group() is called.
 * Defined in constructor.
 * @method groupChange
 */
DGE.Sprite.prototype.groupChange = function(){};

/**
 * Hides this Sprite.
 * @param {Number} delay (optional) If delay is set, suspends the hide until the passed milliseconds.
 * @return {Object} this (for chaining).
 * @mthod hide
 */
DGE.Sprite.prototype.hide = function(delay) {

	var that = this;

	if (delay) {
		setTimeout(function() {
			that._visible = false;
			that.setCSS('display', 'none');
		}, delay);
	} else {
		this._visible = false;
		this.setCSS('display', 'none');
	}

	this.onHide();

	return this;

};

/**
 * Sets the background image on this Sprite's DOM Object.
 * Defined in constructor.
 * @param {String} src The image source/URL.
 * @return {Object} this (for chaining).
 * @method image
 */
DGE.Sprite.prototype.image = function(){};

/**
 * Detects if this Sprite is intersected with another Sprite.
 * @param {Sprite} sprite The other Sprite to check the boundaries of.
 * @return {Boolean} True if the Sprites are touching, false if they're not.
 * @method isTouching
 */
DGE.Sprite.prototype.isTouching = function(sprite) {

	var ax1 = this._x;
	var ax2 = (this._x + this._width);
	var ay1 = this._y;
	var ay2 = (this._y + this._height);
	var bx1 = sprite._x;
	var bx2 = (sprite._x + sprite._width);
	var by1 = sprite._y;
	var by2 = (sprite._y + sprite._height);

	return (
		(ax1 < bx2)
		&& (ax2 > bx1)
		&& (ay1 < by2)
		&& (ay2 > by1)
	);

/*
	wtf was i doing ...
	return (
		(
			(ax1 >= bx1) && (ax1 <= bx2)
			&& (ay1 >= by1) && (ay1 <= by2)
		) || (
			(ax2 >= bx1) && (ax2 <= bx2)
			&& (ay2 >= by1) && (ay2 <= by2)
		)
	);
*/

};

/**
 * Fires or sets the function to call when this Sprite is requested to move.
 * Defined in constructor.
 * @param {Function | undefined} fn The function to call to move the Sprite (scope: this) or undefined to fire said function.
 * @return {Object} this (for chaining).
 * @method move
 */
DGE.Sprite.prototype.move = function(){};

/**
 * Check if a Sprite is out of the viewport.
 * @param {Boolean} entirely When set to true, will check if the Sprite is entirely out of bounds. False just checks if any part is out.
 * @return {Boolean} True if the Sprite has any regions outside of the stage's bounds.
 * @method isOutOfBounds
 */
DGE.Sprite.prototype.isOutOfBounds = function(entirely) {

	if (entirely) return (
		(this._x < -this._width)
		|| (this._x > DGE.STAGE_WIDTH)
		|| (this._y < -this._height)
		|| (this._y > DGE.STAGE_HEIGHT)
	);

	return (
		(this._x < 0)
		|| (this._x > (DGE.STAGE_WIDTH - this._width))
		|| (this._y < 0)
		|| (this._y > (DGE.STAGE_HEIGHT - this._height))
	);

};

/**
 * TODO: attrMethod
 * Set the opacity on the DOM Sprite's element
 * @param {Number} opacity The opacity (0 = transparent, 1 = opaque)
 * @return {Object} this (for chaining)
 */
DGE.Sprite.prototype.opacity = function(opacity) {
	return this.setCSS('opacity', opacity);
};

/**
 * Set or fire the mouse over event listener
 * TODO needs eventMethod
 * @param {Function} fn The function to call when the mouse goes over this Sprite
 * @return {Object} this (for chaining)
 */
DGE.Sprite.prototype.over = function(fn) {

	var that = this;

	this._node.onmouseover = function() {
		fn.apply(that);
	};

	return this;

};

/**
 * Set or fire the mouse over event listener
 * TODO needs eventMethod
 * @return {Object} this (for chaining)
 */
DGE.Sprite.prototype.out = function(fn) {

	var that = this;

	this._node.onmouseout = function() {
		fn.apply(that);
	};

	return this;

};

/**
 * Represent the x/y coordinates in the DOM.
 * Positions this Sprite's DOM Object based on this._x and this._y.
 * @return {Object} this (for chaining).
 * @method plot
 */
DGE.Sprite.prototype.plot = function() {
	return this.setCSS({
		left : (this._x + 'px'),
		top : (this._y + 'px')
	});
};

/**
 * Removes this Sprite from the sprites handler and the DOM.
 * @param {Number} delay (optional) The number of ms to wait before removing.
 * @method remove
 * @final
 * @static
 */
DGE.Sprite.prototype.remove = function(delay) {
	var that = this;

	if (delay) {
		setTimeout(function() {
			DGE.Sprite.removeById(that);
		}, delay);
	} else {
		DGE.Sprite.removeById(this);
	}

};

/**
 * Sets multiple styles on this Sprite's DOM Object.
 * @param {String | Object} id Either the string to get/set or an Object of key/values to set.
 * @param {String | undefined} value Either a string for the key's value or undefined if id is an Object.
 * @return {Object} this (for chaining).
 * @mthod setCSS
 */
DGE.Sprite.prototype.setCSS = function(key, value) {
	DGE.setCSS(this._node, key, value);
	return this;
};

/**
 * Sets the X and Y coordinates of this Sprite's DOM Object.
 * @param {Number} x The x coordinate to set.
 * @param {Number} y The y coordinate to set.
 * @return {Object} this (for chaining).
 * @method setXY
 */
DGE.Sprite.prototype.setXY = function(x, y) {

	if ((x === undefined) && (y === undefined)) {
		return this;
	}

	if (typeof(x) == 'object') {
		y = arguments[0].y; // Order is important
		x = arguments[0].x;
	}

	if (x !== undefined) {
		this._x = x;
	}

	if (y !== undefined) {
		this._y = y;
	}

	return this.plot();

};

/**
 * Shows this Sprite (under the hood: unhides it using CSS).
 * @return {Object} this (for chaining)
 * @method show
 */
DGE.Sprite.prototype.show = function() {
	this._visible = true;
	this.onShow();
	return this.setCSS('display', '');
};

/**
 * Toggles the display of this Object (calls show or hide accordingly). 
 * @return {Object} this (for chaining)
 * @method toggle
 */
DGE.Sprite.prototype.toggle = function() {
	if (this._visible) {
		return this.hide();
	} else {
		return this.show();
	}
};

/**
 * Sets the X coordinate of this Sprite.
 * @param {Number} x The x coordinate to set.
 * @return {Object} this (for chaining).
 * @method x
 */
DGE.Sprite.prototype.x = function(x) {

	this._x = x;
	return this.plot();

};

/**
 * Sets the Y coordinate of this Sprite.
 * @param {Number} y The y coordinate to set.
 * @return {Object} this (for chaining).
 * @method y
 */
DGE.Sprite.prototype.y = function(y) {

	this._y = y;
	return this.plot();

};


/**
TODO: zIndex -> z
 * Gets or sets the CSS z-index style on this Sprite's DOM Object.
 * Defined in constructor.
 * @param {Number | undefined} z The element's new z-index or undefined to get current zIndex.
 * @return {Object| Number} this (for chaining) or the current zIndex value.
 * @method zIndex
 */
DGE.Sprite.prototype.zIndex = function(){};

// Static properties DGE.Sprite (not within prototype) follow:

/**
 * An object comprised of the DGE.Sprite defaults, including:
 * <ul>
 *   <li>{String} nodeName The default DOM element name to use for the Sprite. (default: div)</li>
 *   <li>{Number} width The default width to use for a new Sprite. (default: 0)</li>
 *   <li>{Number} height The default height to use for a new Sprite. (default: 0)</li>
 * </ul>
 * @property defaults
 * @default Object
 * @type Object
 */
DGE.Sprite.defaults = {
	nodeName : 'div'
};

/**
 * An Object containing each Sprite with its id as its key.
 * @property _objects
 * @default Object
 * @type Object
 * @final
 * @static
 */
DGE.Sprite._objects = {};

/**
 * Executes commands on a batch of Sprites.
 * @param {Array} sprites An array of Sprite objects.
 * @param {String} method The name of the method to call on each Sprite.
 * @param {Object} arg The argument to pass to the method.
 * @method batch
 * @final
 * @static
 */
DGE.Sprite.batch = function(sprites, method, arg) {

	for (var i = 0, l = sprites.length; i < l; i++) {
		sprites[i][method](arg);
	}

};

/**
 * Calls the exec() method on each Sprite object.
 * @method main
 * @final
 * @static
 */
DGE.Sprite.main = function() {
	for (var i in DGE.Sprite._objects) {
		var sprite = DGE.Sprite._objects[i];
		if (sprite._active) sprite.exec();
	}
};

/**
 * Fetches all Sprites assigned to the passed group.
 * @param {String} group The group to look for.
 * @param {String} method (optional) The name of the method to call on each Sprite.
 * @param {Object} arg (optional) The argument to pass to the method.
 * @return {Array || null} An Array of found Sprites or null on failure.
 * @method getByGroup
 * @final
 * @static
 */
DGE.Sprite.getByGroup = function(group, method, arg) {

	var found = [],
		objs = DGE.Sprite._objects;

	for (var i in objs) {
		if (objs[i].group() == group) found.push(objs[i]);
	}

	if (method !== undefined) DGE.Sprite.batch(found, method, arg);

	return (found.length ? found : null);

};

/**
 * Gets a Sprite by its id.
 * @param {String} id The id of the Sprite to get.
 * @return {Object | null} Sprite if it exists or null on failure.
 * @method getById
 * @final
 * @static
 */
DGE.Sprite.getById = function(id) {
	return DGE.Sprite._objects[id];
};

/**
 * Removes a Sprite from memory.
 * @param {Object} sprite The Sprite to remove.
 * @method removeById
 * @final
 * @static
 */
DGE.Sprite.removeById = function(sprite) {
	delete sprite._parent._children[sprite._id];
	sprite._node.parentNode.removeChild(sprite._node);
	delete DGE.Sprite._objects[sprite._id];
};
