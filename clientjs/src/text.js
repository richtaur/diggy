// --- DOCS DONE
/**
 * Extends DGE.Sprite with features helpful for rendering text.

 * <h3>Example usage:<h3>
 * <ol>
 *  <li>var text = new DGE.Text(conf);</li>
 *	<li></li>
 *	<li>text.color('orange')</li>
 *  <li>&nbsp;&nbsp;.text('Are those my birds? I need those.');</li>
 * </ol>

 * @param {Object} conf The default configuration stuff.
 * @namespace DGE
 * @class Text
 * @constructor
 * @extends DGE.Sprite
 */
DGE.Text = DGE.extend(DGE.Sprite, function(conf) {

  this.init(conf);

	// YUI Doc below
	this.text = DGE.attrMethod(this, function(text, format) {

		switch (format) {
			case 'bbCode':
				text = DGE.formatBBCode(text);
				break;
			case 'number':
				text = DGE.formatNumber(text);
				break;
		}

		this._node.innerHTML = text;
		this._width = this._node.offsetWidth;
		this._height = this._node.offsetHeight;

		return this;

	});

	// YUI Doc below
	this.wrap = DGE.attrMethod(this, function(wrap) {
		return this.setCSS('white-space', (wrap ? 'normal' : 'nowrap'));
	});

	for (var k in DGE.Text.defaults) {
		conf[k] = ((k in conf) ? conf[k] : DGE.Text.defaults[k]);
		this[k](conf[k]);
	}

	// Could these be added into an additional conf parameter?
	if (conf.text !== undefined) this.text(conf.text);
	if (conf.wrap !== undefined) this.wrap(conf.wrap);

});

/**
 * Sets the text color.
 * @param {String} color The color to use.
 * @return {Object} this (for chaining).
 * @method color
 */
DGE.Text.prototype.color = function(color) {
	return this.setCSS('color', color);
};

/**
 * Sets the font family.
 * @param {String} font The CSS font-family to use.
 * @return {Object} this (for chaining).
 * @method font
 */
DGE.Text.prototype.font = function(font) {
	return this.setCSS('font-family', font);
};

/**
 * Sets the font shadow.
 * @param {String} rule The CSS rule to apply to text-shadow.
 * @return {Object} this (for chaining).
 * @method shadow
 */
DGE.Text.prototype.shadow = function(rule) {
	return this.setCSS('text-shadow', rule);
};

/**
 * Sets the font size.
 * @param {Number} px The pixel size to use.
 * @return {Object} this (for chaining).
 * @method size
 */
DGE.Text.prototype.size = function(px) {
	this._width = this._node.offsetWidth;
	this._height = this._node.offsetHeight;
	return this.setCSS('font-size', px + 'px');
};

/**
 * Sets the text to display.
 * Gets set in constructor.
 * @param {String} text The text to display.
 * @param {String} format The extra format to apply [bbCode, number]
 * @return {Object} this (for chaining).
 * @method text
 */
DGE.Text.prototype.text = function(){};

/**
 * Sets the wrapping style on the text.
 * @param {Boolean} wrap True to wrap the content.
 * @return {Object} this (for chaining).
 * @method wrap
 */
DGE.Text.prototype.wrap = function(){}; // Gets set in constructor

/**
 * An object comprised of the DGE.Text defaults, including:
 * <ul>
 *   <li>{String} color The default color to use. (default: #FFF)</li>
 *   <li>{String} font The font to user. (default: Sans-Serif)</li>
 *   <li>{Number} size The size of the text. (default: 10)</li>
 * </ul>
 * @property defaults
 * @default Object
 * @type Object
 */
DGE.Text.defaults = {
	color : '#FFF',
	font : 'Sans-Serif',
	size : 10
};
