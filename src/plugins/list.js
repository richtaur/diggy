// TODO: REWRITE
/**
 * Creates a Sprite with a list of Sprites within.
 * @namespace DGE
 * @class List
 */
DGE.List = DGE.extend(DGE.Sprite, function(conf) {

	this.init(conf);

	this._rowHeight = conf.rowHeight;

});

/**
 * 
 * @property _rows
 */
DGE.List.prototype._rows = {};

/**
 * 
 * @property _rows
 */
DGE.List.prototype._numRows = 0;

/**
 * 
 * @property _rowHeight
 */
DGE.List.prototype._rowHeight = {};

/**
 * Adds a row to the list.
 * @method add
 */
DGE.List.prototype.add = function(conf, fn) {

	conf.addTo = this;
	conf.x = 0;
	conf.y = (this._numRows * this._rowHeight);
	conf.width = this._width;
	conf.height = this._rowHeight;

	var row = new DGE.Sprite(conf);

	fn.apply(row);

	this._rows[row._id] = row;
	this._numRows++;

};

/**
 * 
 * @method empty
 */
DGE.List.prototype.empty = function() {

	for (var k in this._rows) {
		this._rows[k].remove();
	}

	this._rows = {};
	this._numRows = 0;

};

/**
 * .
 * @method scrollY
 */
DGE.List.prototype.scrollY = function(doIt) {
	this._scrollY = doIt;
};
