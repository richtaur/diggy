// TODO: make autoAdjust account for padding?
// TODO: autoAdjust: width is not fucking working
/**
 * Extends DGE.Sprite with features helpful for rendering text.

 * <h3>Example usage:<h3>
 * <ol>
 *  <li>var text = new DGE.Text(conf);</li>
 *	<li></li>
 *	<li>text.set('color', 'orange')</li>
 *  <li>&nbsp;&nbsp;.set('text', 'Are those my birds? I need those.');</li>
 * </ol>
 * <br>
 * <p>
 * Supported values to set include: color, font, shadow, size, text.
 * </p>

 * @param {Object} conf The default configuration stuff.
 * @namespace DGE
 * @class Text
 * @constructor
 * @extends DGE.Sprite
 */
DGE.Text = DGE.Sprite.extend(function(conf) {
  this.initSprite(conf);
}, {
	align : 'left',
	autoAdjust : false,
	color : '#FFF',
	font : 'Sans-Serif',
	selectable : false,
	size : 10
}, {
	'change:align' : function(align) {
		this.setCSS('text-align', align);
	},
	'change:color' : function(color) {
		this.setCSS('color', color);
	},
	'change:font' : function(font) {
		this.setCSS('font-family', font);
	},
	'change:selectable' : function(selectable) {

		var value = (selectable ? 'text' : 'none');
		this.node.unselectable = (selectable ? 'off' : 'on');

		this.setCSS('-moz-user-select', value);
		this.setCSS('-webkit-user-select', value);

	},
	'change:shadow' : function(rule) {
		this.setCSS('text-shadow', rule);
	},
	'change:size' : function(px) {
		return this.setCSS('font-size', px + 'px');
	},
	'change:text' : function(text) {

		var autoAdjust = this.get('autoAdjust');

		if (autoAdjust) this.setCSS('width', 'auto');
		this.node.innerHTML = text;
		if (autoAdjust) this.adjust(autoAdjust);

	}
});

/**
 * Adjusts the width and height of the Text based on its contents.
 * @param {Object} type The type of adjusting to do ('width', 'height', or true for both).
 * @return {Object} this (for chaining).
 * @method adjust
 */
DGE.Text.prototype.adjust = function(type) {

	if (type === undefined) type = true;

	if ((type === true) || (type == 'width')) {
		this.setCSS('width', 'auto');
		this.node.innerHTML = this.node.innerHTML;
		this.set('width', this.node.offsetWidth);
	}

	if ((type === true) || (type == 'height')) {
		this.setCSS('height', 'auto');
		this.set('height', this.node.offsetHeight);
	}

	return this;

};
