// TODO: REWRITE
/**
 * Creates a layer which is essentially a grouped, fullscreen Sprite.
 */
DGE.Layer = DGE.extend(DGE.Sprite, function(conf) {

	conf = (conf || {});
	conf.width = DGE.STAGE_WIDTH;
	conf.height = DGE.STAGE_HEIGHT;

	this.init(conf);

	DGE.Layer._layers[this._id] = this;

});

/**
 * Provides quick access to all Layer instances.
 * @property _layers
 * @default Object
 * @final
 * @static
 */
DGE.Layer._layers = {};

/**
 * Shows one Layer and hides the rest.
 * @param {String} show The Layer's key to show.
 * @return {Object} The Layer that was shown.
 * @static
 */
DGE.Layer.showOnly = function(show) {

	var layers = DGE.Layer._layers;

	for (var k in layers) {
		if (k != show) {
			layers[k].hide();
		}
	}

	return layers[show].show();

};
