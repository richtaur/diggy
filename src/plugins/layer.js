// TODO: REWRITE
/**
 * Creates a layer which is essentially a fullscreen Sprite.
 */
DGE.Layer = DGE.extend(DGE.Sprite, function(conf) {

	conf = (conf || {});
	conf.width = DGE.stage.width;
	conf.height = DGE.stage.height;

	this.init(conf);

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
