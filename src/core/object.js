// TODO: make events private, check DGE.Object for crap like .events and .listeners or whatever
// use privates within here intead as like var events[key]
// TODO: also, instead of hard-coding .node, .x, .y, .parent, etc., why not set an isEnumerable flag?
(function() {

	function makeObject(fn, defaultSet, defaultEvents) {

		fn = (fn || function() {});
		defaultSet = (defaultSet || {});
		defaultEvents = (defaultEvents || {});

		defaultEvents['set:id'] = function(id) {
			this.id = id;
		};

		defaultEvents['set:parent'] = function(obj) {
			this.parent = obj;
			obj.add(this);
		};

		/**
		 * A core object class to extend for use in other meangingful ways.
		 * @namespace DGE
		 * @class Object
		 */
		var Obj = fn;

		/**
		 * Initializes the object and its properties.
		 * @param {String} conf A key/value pair of values to set.
		 * @return {Object} this (for chaining).
		 * @method init
		 */
		Obj.prototype.init = function(conf) {

			conf = (conf || {});

			for (var k in Obj.defaults) {
				if (conf[k] === undefined) conf[k] = Obj.defaults[k];
			}

			if (conf.id === undefined) conf.id = DGE.makeId();

			Obj.children[conf.id] = this;
			this.children = (this.children || {});
			this.data = (this.data || {});
			this.events = (this.events || {});

			return this.set(conf);

		};

		/**
		 * This object's identifier.
		 * @default null
		 * @property id
		 * @type Object
		 */
		Obj.prototype.id = null;

		/**
		 * Any children attached to this object.
		 * @property children
		 * @type Object
		 */
		Obj.prototype.children = null;

		/**
		 * The data itself, stored by key.
		 * @property data
		 * @type Object
		 */
		Obj.prototype.data = null;

		/**
		 * A container for the listeners.
		 * @default null
		 * @property events
		 * @type Object
		 */
		Obj.prototype.events = null;

		/**
		 * A reference to the parent object.
		 * @default null
		 * @property parent
		 * @type Object
		 */
		Obj.prototype.parent = null;

		/**
		 * Adds an object as a child to this one.
		 * @param {Object} obj The object to add.
		 * @return {Object} this (for chaining).
		 * @method add
		 */
		Obj.prototype.add = function(obj) {
			this.children[obj.id] = obj;
			return this.fire('add');
		};

		/**
		 * Fires off a key change event.
		 * @param {String} key The key of the value to fetch.
		 * @param {String} value The value that was set.
		 * @return {Object} this (for chaining).
		 * @method fire
		 */
		Obj.prototype.fire = function(key, value) {
			if (key in this.events) this.events[key].apply(this, [value]);
			if (key in defaultEvents) defaultEvents[key].apply(this, [value]);
			return this;
		};

		/**
		 * Gets a stored value.
		 * @param {String} key The key of the value to fetch.
		 * @return {Object} The stored value
		 * @method get
		 */
		Obj.prototype.get = function(key) {
			this.fire(DGE.sprintf('get:%s', key), this.data[key]);
			return this.data[key];
		};

		/**
		 * Sets a stored value.
		 * @param {String} key The key of the value to set.
		 * @param {String} value The value to set.
		 * @return {Object} this (for chaining).
		 * @method set
		 */
		Obj.prototype.set = function(key, value) {

			if (key === undefined) return this;

			if (typeof(key) == 'object') {

				for (var k in key) {
					arguments.callee.apply(this, [k, key[k]]);
				}

			} else {

				var previous = this.data[key];
				this.data[key] = value;

				if (value !== previous) {
					this.fire(DGE.sprintf('change:%s', key), value);
				}

				this.fire(DGE.sprintf('set:%s', key), value);

			}

			return this;

		};

		/**
		 * Offsets a stored value.
		 * @param {String} key The key whose value to offset.
		 * @param {String} offset The amount to offset the value.
		 * @return {Object} this (for chaining).
		 * @method offset
		 */
		Obj.prototype.offset = function(key, offset) {
			return this.set(key, (this.get(key) + offset));
		};

		/**
		 * Attaches a listener to when the passed key changes.
		 * @param {String} key The key of the value to fetch.
		 * @param {Function} e The function to fire.
		 * @return {Object} this (for chaining).
		 * @method on
		 */
		Obj.prototype.on = function(key, e) {

			if (typeof(key) == 'object') {
				for (var k in key) {
					arguments.callee.apply(this, [k, key[k]]);
				}
			}

			this.events[key] = (e || function() {});

			var on = DGE.sprintf('on:%s', key);

			if (on in defaultEvents) {
				defaultEvents[on].apply(this, [e]);
			}

			return this;

		};

		/**
		 * Removes this object from memory.
		 * @method remove
		 */
		Obj.prototype.remove = function(delay) {
			this.fire('remove');
			Obj.removeById(this.id);
		};

		/**
		 * All created objects of this type.
		 * @default Object
		 * @property children
		 * @type Object
		 */
		Obj.children = {};

		/**
		 * All created objects of this type.
		 * @default Object
		 * @property children
		 * @type Object
		 */
		Obj.defaults = defaultSet;

		/**
		 * Extends this object.
		 * @param {Function} F The object to extend with.
		 * @param {Object} defaultSetNew The default key/values to set.
		 * @param {Object} defaultEventsNew The default key/values to listen for.
		 * @return {Function} The new, extended object.
		 * @method extend
		 * @static
		 */
		Obj.extend = function(F, defaultSetNew, defaultEventsNew) {

			var defaultSetExtended = {};
			var defaultEventsExtended = {};

			F.prototype = new Obj();

			for (var k in defaultSet) {
				defaultSetExtended[k] = defaultSet[k];
			}

			for (var k in defaultSetNew) {
				defaultSetExtended[k] = defaultSetNew[k];
			}

			for (var k in defaultEvents) {
				defaultEventsExtended[k] = defaultEvents[k];
			}

			for (var k in defaultEventsNew) {
				defaultEventsExtended[k] = defaultEventsNew[k];
			}

			return makeObject(F, defaultSetExtended, defaultEventsExtended);

		};

		/**
		 * Gets a child object by its id.
		 * @param {String} id The id of the object to get.
		 * @return {Object || null} The object if it exists or null on failure.
		 * @method getById
		 * @static
		 */
		Obj.getById = function(id) {
			return Obj.children[id];
		};

		/**
		 * Gets an array of children that have the passed value set.
		 * @param {String} key The key to look at.
		 * @param {String} value The value to check.
		 * @return {Array} An array of found objects.
		 * @method getByProperty
		 * @static
		 */
		Obj.getByProperty = function(key, value) {

			var children = [];

			for (var id in Obj.children) {
				if (Obj.children[id].get(key) == value) {
					children.push(Obj.children[id]);
				}
			}

			return children;

		};

		/**
		 * Appends to the default events.
		 * @param {String} key The the event to listen for.
		 * @param {Function} fn The function to fire on.
		 * @method on
		 * @static
		 */
		Obj.on = function(key, fn) {
			defaultEvents[key] = fn;
		};

		/**
		 * Removes an object from memory.
		 * @param {String} id The id of the object to remove.
		 * @method removeById
		 * @static
		 */
		Obj.removeById = function(id) {

			var obj = Obj.children[id];

			// Get rid of the object's children.
			for (var id in obj.children) {
DGE.log('[NOTICE] getting rid of a child:', obj.children[id].node);
				obj.children[id].remove();
			}

			// Remove from parent object.
			if (obj.parent) delete obj.parent.children[this.id];

			// Remove from this list.
			delete Obj.children[id];

		};

		/**
		 * Alters the default conf.
		 * @param {String} key The key of the value to fetch.
		 * @param {String} value The value that was set.
		 * @method set
		 * @static
		 */
		Obj.set = function(key, value) {
			defaultSet[key] = value;
		};

		return Obj;

	};

	DGE.Object = makeObject(function(conf) {
		this.init(conf);
	});

	DGE.Object.make = makeObject;

})();
