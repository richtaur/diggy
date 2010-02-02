/**
 * Modal class for fancy versions of alert(), confirm() and prompt().

 * <h3>Example usage:<h3>
 * <ol>
 *  <li>var modal = new DGE.Modal(conf);</li>
 *	<li></li>
 *	<li>modal.()</li>
 *  <li>&nbsp;&nbsp;.();</li>
 * </ol>

 * @param {Object} conf The default configuration stuff.
 * @namespace DGE
 * @class Modal
 * @extends DGE.Sprite
 * @constructor
 */
DGE.Modal = function(conf) {
};

/**
 * The public overlay Sprite.
 * @property overlay
 * @default null
 * @final
 * @static
 * @type Object
 */
DGE.Modal.overlay = null;
