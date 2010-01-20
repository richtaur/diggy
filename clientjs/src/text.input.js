/**
 * 
 */
DGE.TextInput = DGE.extend(DGE.Sprite, function(conf) {

	conf.node = document.createElement('input');
	conf.node.type = 'text';

	this.init(conf);

	this.edit = DGE.eventMethod(this, function(fn) {
		var that = this;
		this._node.onkeyup = function() {
			that.value(that._node.value);
			fn.apply(that, [that.value()]);
		};
	});

	this.value = DGE.attrMethod(this, function(value) {
		this._node.value = value;
	});

	if (conf.edit) this.edit(conf.edit);
	if (conf.value) this.value(conf.value);

});

/**
 * 
 */
DGE.TextInput.prototype.edit = function(){};

/**
 * 
 */
DGE.TextInput.prototype.value = function(){};
