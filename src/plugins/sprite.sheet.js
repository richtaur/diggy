// TODO: investigate DGE.Object.defaults and whatever else VS DGE.Object.set/on
/**
 * Creates a Sprite Sheet.
 * @param {Object} conf The configuration settings for this new Sprite Sheet object.
 * @namespace DGE
 * @class Sprite.Sheet
 * @constructor
 * @extends DGE.Object
 */
DGE.Sprite.Sheet = DGE.Object.make(function(conf) {
	this.initSheet(conf);
}, {
	image : null
}, {
	'change:image' : function(src) {
		if (src) this.node.src = src;
	}
});

DGE.Sprite.Sheet.prototype.initSheet = function(conf) {

	if (conf === undefined) return;
	this.node = document.createElement('img');

	return this.init(conf);

};

DGE.Sprite.on('change:sheet', function(sheet) {
	if (!sheet) return;
	this.set('image', sheet.get('image'));
});

DGE.Sprite.on('change:sheetIndex', function(sheetIndex) {
// TODO

	var sheet = this.get('sheet');
	if (!sheet) return;

	var spriteWidth = sheet.get('spriteWidth');
	var spriteHeight = sheet.get('spriteHeight');
	var width = sheet.get('width');
	var height = sheet.get('height');
	var tileX = (width / spriteWidth);
/*
	var tileY = ();
*/

// 240x48, 48x48
// 240 / 48 = 5

	var x = -((spriteWidth * sheetIndex) + sheet.get('x'));
	var y = -sheet.get('y');

	this.setCSS('background-position', DGE.sprintf('%spx %spx', x, y));

});

(function() {

	function position() {
// TODO: fucking. need to see if there's background-position-left, or -x, or whatever
// to separate this bullshit out

		var sheet = this.get('sheet');
		if (!sheet) return;

		var sheetX = this.get('sheetX');
		var sheetY = this.get('sheetY');
		var spriteWidth = sheet.get('spriteWidth');
		var spriteHeight = sheet.get('spriteHeight');
		var x = (sheet.get('x') + (sheetX * spriteWidth));
		var y = (sheet.get('y') + (sheetY * spriteHeight));

		this.setCSS('background-position', DGE.sprintf('-%spx -%spx', x, y));
DGE.log('background-position:', DGE.sprintf('-%spx -%spx', x, y));
		
	};

	DGE.Sprite.on('change:sheetX', position);
	DGE.Sprite.on('change:sheetY', position);

})();

DGE.Sprite.set('sheet', null);
DGE.Sprite.set('sheetIndex', 0);
DGE.Sprite.set('sheetX', 0);
DGE.Sprite.set('sheetY', 0);
