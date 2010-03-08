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

	var sheet = this.get('sheet');
	if (!sheet) return;

	var spriteWidth = sheet.get('spriteWidth');
	var spriteHeight = sheet.get('spriteHeight');
	var width = sheet.get('width');
	var height = sheet.get('height');

	var maxX = (width / spriteWidth);
	var maxY = (height / spriteHeight);
	var tileY = Math.floor(sheetIndex / maxX);
	var tileX = (sheetIndex - (tileY * maxX));
	var x = sheet.get('x') + (tileX * spriteWidth);
	var y = sheet.get('y') + (tileY * spriteHeight);

	this.setCSS('background-position', DGE.sprintf('-%spx -%spx', x, y));

});

(function() {

	function position() {

		var sheet = this.get('sheet');
		if (!sheet) return;

		var sheetX = (this.get('sheetX') || 0);
		var sheetY = (this.get('sheetY') || 0);
		var spriteWidth = sheet.get('spriteWidth');
		var spriteHeight = sheet.get('spriteHeight');
		var x = (sheet.get('x') + (sheetX * spriteWidth));
		var y = (sheet.get('y') + (sheetY * spriteHeight));

		this.setCSS('background-position', DGE.sprintf('-%spx -%spx', x, y));
		
	};

	DGE.Sprite.on('change:sheetX', position);
	DGE.Sprite.on('change:sheetY', position);

})();

// TODO: investigate DGE.Object.defaults and whatever else VS DGE.Object.set/on
DGE.Sprite.set('sheet', null);
DGE.Sprite.set('sheetIndex', 0);
DGE.Sprite.set('sheetX', 0);
DGE.Sprite.set('sheetY', 0);
