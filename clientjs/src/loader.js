/**
 * Provides a Loader utility for fetching assets and reporting progress.
 * @param {Array} files An array of objects of filenames to fetch.
 * @param {Object} callbacks An Object containing the functions to call when certain events fire (change, complete, error).
 * @namespace DGE
 * @class Loader
 * @constructor
 */
DGE.Loader = function(assets, callbacks) {

	callbacks = (callbacks || {});

	var dateStart = new Date();
	var dateStop;
	var fetched = 0;
	var files = [];
	var img;
	var total = 0;

	function init() {

// Uncomment to make the Loader take 5-10 seconds
/*
files = [
'http://farm3.static.flickr.com/2569/3977585511_fc0b2c262e_b.jpg?' + DGE.rand(0, 99),
'http://farm3.static.flickr.com/2569/3977585511_fc0b2c262e_b.jpg?' + DGE.rand(0, 99),
'http://farm3.static.flickr.com/2517/3990450867_1595521b9f_b.jpg?' + DGE.rand(0, 99),
'http://farm3.static.flickr.com/2748/4021853160_8097f180c3_b.jpg?' + DGE.rand(0, 99),
'http://farm3.static.flickr.com/2569/3977585511_fc0b2c262e_b.jpg?' + DGE.rand(0, 99),
'http://farm3.static.flickr.com/2569/3977585511_fc0b2c262e_b.jpg?' + DGE.rand(0, 99),
'http://farm3.static.flickr.com/2517/3990450867_1595521b9f_b.jpg?' + DGE.rand(0, 99),
'http://farm3.static.flickr.com/2748/4021853160_8097f180c3_b.jpg?' + DGE.rand(0, 99)
];
*/

		for (var i = 0; i < assets.length; i++) {

			var asset = assets[i];

			if (typeof(asset) == 'string') {
				files.push(asset);
			} else if (asset.length === undefined) {
				for (var k in asset) {
					files.push(asset[k]);
				}
			} else {
				for (var n = 0; n < asset.length; n++) {
					files.push(asset[n]);
				}
			}

		}

		total = files.length;

		for (var i = 0; i < total; i++) {

			img = new Image();
			img.onload = increment;
			img.onerror = function(e) {
				if (callbacks.error) callbacks.error(e);
				increment();
			};
			img.src = (DGE.conf.baseUrl + files[i]);
console.log('just fetched ' + img.src);

		}

	};

	function increment() {

		fetched++;

		if (callbacks.change) callbacks.change(Math.round((fetched / total) * 100));

		if (fetched == total) {
			dateStop = new Date();
			if (callbacks.complete) callbacks.complete();
		}

	};

	/**
	 * Gets the number of milliseconds past since the Loader started.
	 * @return {Number} The number of ms since having started.
	 * @method time
	 */
	this.time = function() {
		return ((dateStop || new Date()).getTime() - dateStart.getTime());
	};

	init();

};
