// TODO: REWRITE
/**
 * A Tile class to provide helper methods when dealing within a tiled environment.
 * @param {Object} conf The configuration settings for this new Tile object.
 * @namespace DGE
 * @class Tile
 * @constructor
 * @extends DGE.Sprite
 */
DGE.Tile = DGE.extend(DGE.Sprite, function(conf) {
  if (conf) this.init.apply(this, [conf]);
});

/**
 * The X coordinate of this Sprite based on tiles.
 * @property _tileX
 * @default 0
 * @type Number
 */
DGE.Tile.prototype._tileX = 0;

/**
 * The Y coordinate of this Sprite based on tiles.
 * @property _tileY
 * @default 0
 * @type Number
 */
DGE.Tile.prototype._tileY = 0;

/**
 * Checks if this Tile is adjacent to another Tile.
 * @param {Object} tile The other Tile.
 * @return {Boolean} True if the Tiles are adjacent.
 * @method isAdjacentTo
 */
DGE.Tile.prototype.isAdjacentTo = function(tile) {
  return (
    ((tile._tileX == this._tileX)
      && (
        (tile._tileY == (this._tileY - 1))
        || (tile._tileY == (this._tileY + 1))
    )) || (
      (tile._tileY == this._tileY)
      && (
        (tile._tileX == (this._tileX - 1))
        || (tile._tileX == (this._tileX + 1))
    ))
  );
};

/**
 * Set the coordinates of this Tile based on tile sizes.
 * @param {Number} tx The X tile position.
 * @param {Number} ty The Y tile position.
 * @param {Number} x (optional) The X offset.
 * @param {Number} y (optional) The Y offset.
 * @return {Object} this (for chaining).
 * @member setTileXY
 */
// TODO: audit, having the Object override on tx might be needlessly complex
DGE.Sprite.prototype.setTileXY = function(tx, ty, x, y) {

	// Allow for an object-based parameter override
	if (typeof tx == 'object') {
    x = arguments[0]._x;
    y = arguments[0]._y;
    ty = arguments[0]._tileY; // Order is important
    tx = arguments[0]._tileX;
  }

  this._x = ((tx * this.tWidth) + (x || 0));
  this._tileX = tx;

  this._y = ((ty * this.tHeight) + (y || 0));
  this._tileY = ty;

  return this.plot();

};

/**
 * Fetches all Tiles assigned to the passed tileX and tileY values.
 * @param {String} group The group to look for.
 * @return {Array | null} An Array of found Tiles or null on failure.
 * @method getByGroup
 * @final
 * @static
 */
DGE.Tile.getByTXY = function(tx, ty, first) {

	var found = [],
		objs = DGE.Sprite._objects;

	for (var i in objs) {
		if ((objs[i]._tileX == tx) && (objs[i]._tileY == ty)) {
			if (first) return objs[i];
			found.push(objs[i]);
		}
	}

	return (found.length ? found : null);

};

/**
 * Creates and positions a matrix of Tiles.
 * @param {Object} Obj The type of objects to instantiate (default: DGE.Tile).
 * @param {Number} width The number of columns to generate.
 * @param {Number} height The number of rows to generate.
 * @param {Object} conf An object literal of additional conf settings to pass into Obj.
 * @return {Array} An array [x, y] of Obj objects.
 * @method makeTileMap
 * @final
 * @static
 */
DGE.Tile.makeTileMap = function(Obj, width, height, conf) {

	Obj = (Obj || DGE.Tile);

	var tiles = [],
		row,
		tx, ty;

	for (tx = 0; tx < width; tx++) {

		row = [];

		for (ty = 0; ty < height; ty++) {
			conf.tx = tx;
			conf.ty = ty;
			conf.width = (conf.width || DGE.TILE_WIDTH);
			conf.height = (conf.height || DGE.TILE_HEIGHT);
			row.push(new Obj(conf));
		}

		tiles.push(row);

	}

	return tiles;

};

/**
 * The default width to use for a new tiled Sprite.
 * @property TILE_WIDTH
 * @default 0
 * @type Number
 */
DGE.Tile.TILE_WIDTH = 0;

/**
 * The default height to use for a new tiled Sprite.
 * @property TILE_HEIGHT
 * @default 0
 * @type Number
 */
DGE.Tile.TILE_HEIGHT = 0;
