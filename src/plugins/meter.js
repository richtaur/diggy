/**
 * Creates a percentage meter.
 * @namespace DGE
 * @class Meter
 * @extends DGE.Sprite
 */
DGE.Meter = DGE.extend(DGE.Sprite, function(conf) {

	this.init(conf);

	this.meterSprite = new DGE.Sprite({
		height : conf.height,
		parent : this
	});

	this.refresh = function() {

		this.meterSprite.set(
			'width',
			(this.width * (this.get('value') / this.get('total')))
		);

		if (conf.text) {
			if (this.formatNumber) {
				this.labelText.set(
					'text',
					DGE.printf(
						conf.labelText,
						DGE.formatNumber(this.get('value')),
						DGE.formatNumber(this.get('total'))
					)
				);
			} else {
				this.labelText.set('text', DGE.printf(conf.text, this.get('value'), this.get('total'));
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
		this.labelText = new DGE.Text({
			parent : this
		});
		this.labelText.setCSS('position', 'relative');
	}

	if (conf.total !== undefined) this.total(conf.total);
	if (conf.value !== undefined) this.value(conf.value);

});

DGE.Meter.prototype.formatNumber = true;

/**
 * The Sprite object that represents the value of the meter.
 * @property meterSprite
 */
DGE.Meter.prototype.meterSprite = null;
