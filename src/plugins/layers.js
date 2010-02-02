/**
 * Creates an array of Sprites to be used as containers for other Sprites.
 * @namespace DGE
 * @class layers
 */
DGE.layers = (function() {

  var objs = {};

	/**
	 * Creates an Object of Sprites to be used as containers for other Sprites.
	 * Those Sprites are then accessible via DGE.layers[name].
	 * @param {Object} layers The layers, with keys as their names and optional values of conf (Object),
	 * 	init (Function) and show (Function)
	 * @return {Object} A key/value pair of the Sprites created.
	 * @method set
	 * @final
	 * @static
	 */
	var set = function(layers) {

		for (var k in layers) {

			var conf = (layers[k].conf || {});
			conf.id = k;
			// TODO: audit these, should they be onShow? should they be in conf??
			conf.onShow = (conf.onShow || layers[k].show);
			conf.onHide = (conf.onHide || layers[k].hide);
			conf.width = DGE.STAGE_WIDTH;
			conf.height = DGE.STAGE_HEIGHT;

			objs[k] = new DGE.Sprite(conf);

			objs[k].hide();
			objs[k].showOnly = (function(k) {
				return function() {
					show(k);
// TODO: audit
				};
			})(k);

// TODO: audit
			if (layers[k].init !== undefined) {
				layers[k].init.apply(objs[k]);
			}

		}

		return objs;

	};

	/**
	 * Shows the passed layer and hides the others.
	 * @param {String} key The key of the screen to show
	 * @method show
	 * @final
	 * @static
	 */
  var show = function(key) {

    for (var i in objs) {
      if (i == key) {
        objs[i].show();
      } else {
        objs[i].hide();
      }
    }

  };

  return {
		set : set,
		show : show
	};

})();
