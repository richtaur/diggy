// TODO: audit the use of new DGE.Object.init({stuff});
// because now that should work out of the box as just DGE.Object({stuff})
/**
 * An extremely simple persistent memory manager.
 * @namespace DGE
 * @class Data
 */
DGE.Data = new DGE.Object().init({
	id : 'DGE.Data'
});

DGE.Data.get = function(key) {
	return localStorage[key];
};

DGE.Data.set = function(key, value) {

	if (typeof(key) == 'object') {

		for (var k in key) {
			arguments.callee.apply(DGE.Data, [k, key[k]]);
		}

	} else {

		var previous = DGE.Data.data[key];
		this.data[key] = value;
		localStorage[key] = value;

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
	localStorage = {};

	return DGE.Data;

};
