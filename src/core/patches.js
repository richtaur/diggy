// From MDC: Augment Array.indexOf if it's missing (harmless)
Array.prototype.indexOf = Array.prototype.indexOf || function(el/*, from*/) {

	var len = this.length >>> 0;
	var from = Number(arguments[1]) || 0;

	from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	if (from < 0) from += len;

	for (; from < len; from++) {
		if (from in this && (this[from] === el)) {
			return from;
		}
	}

	return -1;

};

// ' foo '.trim(); // returns "foo"
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};
