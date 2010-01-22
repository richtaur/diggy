/**
 * Creates a Sprite sheet which is a compilation of sprites within a single file.
 * @param {String} filename The name of the file to use.
 * @param {Number} tileWidth The width of a single sprite in this sheet.
 * @param {Number} tileHeight The height of a single sprite in this sheet.
 * @param {Number} startX (optional) The starting X point of the grid.
 * @param {Number} startY (optional) The starting Y point of the grid.
 */
DGE.SpriteSheet = function(filename, tileWidth, tileHeight, startX, startY) {

	this._filename = filename;
	this._tileWidth = tileWidth;
	this._tileHeight = tileHeight;
	this._startX = (startX || 0);
	this._startY = (startY || 0);

};

/**
 * Sets the sheet to use with this sprite.
 * @param {Object} sheet The sheet to use.
 * @return {Object} this (for chaining).
 */
DGE.Sprite.prototype.setSheet = function(sheet) {

	this._sheet = sheet;

	this.dimensions(sheet._tileWidth, sheet._tileHeight);
	this.image(sheet._filename);

	return this;

};

/**
 * Sets the sheet coordinates to use.
 * @param {Number} tx The tile X to use.
 * @param {Number} ty The tile Y to use.
 * @return {Object} this (for chaining).
 */
DGE.Sprite.prototype.setSheetCoords = function(tx, ty) {

	var sheet = this._sheet;
	var x = (sheet._startX + (sheet._tileWidth * tx));
	var y = (sheet._startY + (sheet._tileHeight * ty));

	this._sheetX = tx;
	this._sheetY = ty;

	return this.setCSS(
		'background-position',
		DGE.printf('-%spx -%spx', x, y)
	);

};
