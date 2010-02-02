// TODO: implement this. data needs to be persistent
// TODO: shouldn't this just be extending DGE.Object?
/**
 * A extremely simple persistent memory manager.
 * @namespace DGE
 * @class Data
 */
DGE.Data = (function() {

	var data = {};

	/**
	 * Empties the data.
	 * @method empty
	 * @final
	 * @public
	 * @static
	 */
	function empty() {
		data = {};
	};

	/**
	 * Gets the data assigned to a given key.
	 * @param {String} key The key of the data to fetch.
	 * @return {Object} The data associated with the passed key.
	 * @method get
	 * @final
	 * @public
	 * @static
	 */
	function get(key) {
		return data[key];
	};

	/**
	 * Sets the data assigned to a given key.
	 * @param {String} key The key of the data to set.
	 * @param {Object} value The value to set.
	 * @method set
	 * @final
	 * @public
	 * @static
	 */
	function set(key, value) {

		if (typeof(key) == 'object') {
			for (var k in key) {
				arguments.callee(k, key[k]);
			}
			return;
		}

		data[key] = value;

	};

	return {
		empty : empty,
		get : get,
		set : set
	};

})();
