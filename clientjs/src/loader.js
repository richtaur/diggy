// TODO: allow arrays and/or objects to be added via constructor, so like:
//new Loader({load : that}, thisIsAnArray, 'this too', 'and this');
// --- DOCS DONE
/**
 * Provides a Loader utility for fetching assets and reporting progress.
 * @param {Array} files An array of assets to fetch.
 * @param {Object} callbacks An Object containing the functions to call when certain events fire (change, complete, error).
 * @namespace DGE
 * @class Loader
 * @constructor
 */
DGE.Loader = function(files, callbacks) {

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

	callbacks = (callbacks || {});

	var dateStart = new Date(),
		dateStop,
		fetched = 0,
		img,
		total = files.length;

	var init = function() {

		for (var i = 0; i < total; i++) {

			img = new Image();
			img.onload = increment;
			img.onerror = function(e) {
				if (callbacks.error) callbacks.error(e);
				increment();
			};
			//img.src = files[i];
			img.src = (DGE.conf.baseUrl + files[i]);

		}

	};

	var increment = function() {

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
