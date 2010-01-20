// TODO: audit while file, it's gross
// TODO: rename Bar to Meter (more semantic and less ambiguous)
/**
 * Creates a percentage bar
 * @namespace DGE
 * @class Bar
 * @extends DGE.Sprite
 */
DGE.Bar = DGE.extend(DGE.Sprite, function(conf) {

	this.init(conf);

	this.meter = new DGE.Sprite({
		addTo : this,
		height : conf.height
	});

	this.refresh = function() {

		this.meter.dimensions(this._width * (this.value() / this.total()));

		if (conf.text) {
			if (this.formatNumber) {
				this.text.text(DGE.printf(
					conf.text,
					DGE.formatNumber(this.value()),
					DGE.formatNumber(this.total()))
				);
			} else {
				this.text.text(DGE.printf(conf.text, this.value(), this.total()));
			}
		}

	};

	this.set = function() {
		this.total(total);
		this.value(value);
	};

	this.total = DGE.attrMethod(this, function() {
		this.refresh();
	});

	this.value = DGE.attrMethod(this, function(value) {
		this.refresh();
	});

	if (conf.text) {
		this.setCSS('text-align', 'center');
		this.text = new DGE.Text({
			addTo : this
		});
		this.text.setCSS('position', 'relative');
	}

	if (conf.total !== undefined) this.total(conf.total);
	if (conf.value !== undefined) this.value(conf.value);

});

DGE.Bar.prototype.formatNumber = true;

/**
 * 
 * @property text
 * @type {Object}
 */
DGE.Bar.prototype.text = {};

/**
 * 
 * @method meter
 */
DGE.Bar.prototype.meter = function(){};

/**
 * 
 * @method total
 */
DGE.Bar.prototype.total = function() {};

/**
 * 
 * @method value
 */
DGE.Bar.prototype.value = function(){};
