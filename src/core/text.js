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
		this.node.innerHTML = text;
		if (this.get('autoAdjust')) this.adjust();
	}
});

/**
 * Adjusts the width and height of the Text based on its contents.
 * @return {Object} this (for chaining).
 * @method adjust
 */
DGE.Text.prototype.adjust = function() {

	this.node.style.width = '500px';
	this.node.style.height = '400px';
DGE.log(this.node.style.width, this.node.style.height);

// TODO: make sure adjusting works (i don't think its' working AT ALL)

	this.set('width', this.node.offsetWidth);
	this.set('height', this.node.offsetHeight);

	return this;

};
