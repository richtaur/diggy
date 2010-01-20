// TODO

DGE.Data = (function() {

	var data = {};

	function empty() {
		data = {};
	};

	function get(key) {
		return data[key];
	};

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
