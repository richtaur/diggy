/**
 * A core object class to extend for use in other meanginful ways.
 * @namespace DGE
 * @class Object
 */
DGE.Object = function(conf) {
	this.init(conf);
};

/**
 * Initializes the object and its properties.
 * @param {String} conf A key/value pair of values to set.
 * @return {Object} this (for chaining).
 * @method init
 */
DGE.Object.prototype.init = function(conf) {
	this._events = (this._events || {});
	this._values = (this._values || {});
	this.set(conf);
};

/**
 * Fires off a key change event.
 * @param {String} key The key of the value to fetch.
 * @param {String} value The value that was set.
 * @return {Object} this (for chaining).
 * @method fire
 */
DGE.Object.prototype.fire = function(key, value) {
//DGE.debug('fire(', key, ')', value, this._events);
	if (key in this._events) this._events[key].apply(this, [value]);
	return this;
};

/**
 * Gets a stored value.
 * @param {String} key The key of the value to fetch.
 * @return {Object} The stored value
 * @method get
 */
DGE.Object.prototype.get = function(key) {
	return this._values[key];
};

/**
 * Sets a stored value.
 * @param {String} key The key of the value to set.
 * @param {String} key The value of the key to set.
 * @return {Object} this (for chaining).
 */
DGE.Object.prototype.set = function(key, value) {

	if (key === undefined) return;

	if (typeof(key) == 'object') {
		for (var i in key) {
			arguments.callee.apply(this, [i, key[i]]);
		}
	} else {
//DGE.debug('set(', key, ')', value);
		if (key == 'id') this._id = value;
		this._values[key] = value;
		this.fire(key, value);
	}

	return this;

};

/**
 * Attaches a listener to when the passed key changes.
 * @param {String} key The key of the value to fetch.
 * @param {Function} e The function to fire.
 * @return {Object} this (for chaining).
 * @method on
 */
DGE.Object.prototype.on = function(key, e) {
//DGE.debug('on(', key, ')', e);
	this._events[key] = e;
//DGE.debug('and now _events: ', this._events);
	return this;
};

/**
 * This audio object's identifier.
 * @default null
 * @property _id
 * @type Object
 */
DGE.Object.prototype._id = null;

/**
 * A container for the listeners.
 * @default null
 * @property _events
 * @type Object
 */
DGE.Object.prototype._events = null;

/**
 * The values themselves, stored by key.
 * @property _values
 * @type Object
 */
DGE.Object.prototype._values = null;
