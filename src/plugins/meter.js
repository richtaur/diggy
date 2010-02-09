// TODO: audit whole file, it's gross
/**
 * Creates a percentage meter.
 * @namespace DGE
 * @class Meter
 * @extends DGE.Sprite
 */
DGE.Meter = DGE.extend(DGE.Sprite, function(conf) {

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

DGE.Meter.prototype.formatNumber = true;

/**
 * The Sprite object that represents the value of the meter.
 * @property meter
 */
DGE.Meter.prototype.meter = null;

/**
 * Sets the total.
 * @param {Number} total The new total.
 * @method total
 */
DGE.Meter.prototype.total = function() {};

/**
 * Sets the value.
 * @param {Number} value The new value.
 * @method value
 */
DGE.Meter.prototype.value = function(){};
