// TODO Audit these; there should be one MAYBE two ways to do something in DGE. Make sure all the components are
// acting independently, semantically, cohesively and sensically

/**
 * DGE is the single global utilizied by Diggy.
 * It contains all of Diggy's classes, properties and methods.
 * @namespace
 * @class DGE
 */

/**
 * A key/value Object containing DGE's configuration data.
 * @property conf
 * @type Object
 */
DGE.conf = {
	baseURL : '',
	interval : 34 // ~30 FPS
};

/* TODO: maybe make this:
DGE.platform = {
	name : 'browser',
	BROWSER : 'browser',
	TITANIUM : 'titanium'
};
*/

DGE.platform = {};

/**
 * The constant for any web browser.
 * @final
 * @property PLATFORM_BROWSER
 * @type String
 */
DGE.platform.BROWSER = 'browser';

/**
 * The constant for the Titanium platform.
 * @final
 * @property PLATFORM_TITANIUM
 * @type String
 */
DGE.platform.TITANIUM = 'titanium';

/**
 * A string representing the platform DGE is running on.
 * @final
 * @property _platform
 * @type String
 */
DGE.platform.name = (function() {

	var platform = DGE.platform.BROWSER;

	if (typeof(Titanium) == 'object') {
		platform = DGE.platform.TITANIUM;
	}

	return platform;

})();

/**
 * The width of the display.
 * @final
 * @property DISPLAY_WIDTH
 * @type Number
 */
(function() {

switch (DGE._platform) {
	case DGE.PLATFORM_BROWSER:
		// TODO verify which browsers this works on
		DGE.DISPLAY_WIDTH = window.innerWidth;
		DGE.DISPLAY_HEIGHT = window.innerHeight;
		break;
	case DGE.PLATFORM_TITANIUM:
		DGE.DISPLAY_WIDTH = Titanium.Platform.displayCaps.width;
		DGE.DISPLAY_HEIGHT = Titanium.Platform.displayCaps.height;
		break;
}

})();

/**
 * The width of the stage object.
 * @final
 * @property STAGE_WIDTH
 * @type Number
 */
DGE.STAGE_WIDTH = 0;

/**
 * The height of the stage object.
 * @final
 * @property STAGE_HEIGHT
 * @type Number
 */
DGE.STAGE_HEIGHT = 0;

/**
 * What version of the Diggy library this is.
 * @final
 * @property version
 * @type Object
 */
DGE.version = {
	name : 'alpha 0',
	number : 0
};
