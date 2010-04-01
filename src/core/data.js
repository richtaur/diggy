// TODO: need to check if localStorage exists. It doesn't in IE and Titanium. Find solutions for those.
/**
 * An extremely simple persistent memory manager.
 * @namespace DGE
 * @class Data
 */
DGE.Data = new DGE.Object({
	id : 'DGE.Data'
});

DGE.Data.get = function(key) {

	if (typeof(localStorage) == 'undefined') {
		// TODO
		var value = null;
	} else {
		var value = localStorage[key];
	}

	if (value === 'true') {
		return true;
	} else if (value === 'false') {
		return false;
	}

	return value;

};

DGE.Data.set = function(key, value) {

	if (typeof(key) == 'object') {

		for (var k in key) {
			arguments.callee.apply(DGE.Data, [k, key[k]]);
		}

	} else {

		var previous = DGE.Data.data[key];
		this.data[key] = value;

		if (typeof(localStorage) == 'undefined') {
			// TODO
		} else {
			localStorage[key] = value;
		}

		if (value !== previous) {
			DGE.Data.fire(DGE.sprintf('change:%s', key), value);
		}

		DGE.Data.fire(DGE.sprintf('set:%s', key), value);

	}

};

/**
 * Empties the persistent memory.
 * @return {Object} this (for chaining).
 * @method add
 */
DGE.Data.empty = function() {

	DGE.Data.data = {};

	if (typeof(localStorage) == 'undefined') {
		// TODO
	} else {
		localStorage = {};
	}

	return DGE.Data;

};
