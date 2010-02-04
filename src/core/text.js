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
DGE.Text = DGE.Sprite.extend(function(conf) {
  this.initSprite(conf);
}, {
	color : '#FFF',
	font : 'Sans-Serif',
	size : 10
}, {
	'change:color' : function(color) {
		this.setCSS('color', color);
	},
	'change:font' : function(font) {
		this.setCSS('font-family', font);
	},
	'change:shadow' : function(rule) {
		this.setCSS('text-shadow', rule);
	},
	'change:size' : function(px) {
		return this.setCSS('font-size', px + 'px');
	},
	'change:text' : function(text) {
		this.node.innerHTML = text;
	}
});
