/*
 * Diggy (DGE): DHTML Game Engine.<br>
 * http://diggy.sistertrain.com/
 */

/*
 * Formats the bulletin board text within a string.
 * @param {String} code The bulletin board code to parse. Supported code is:
 * <ul>
 *   <li>hi there</li>
 * </ul>
 * @namespace DGE
 * @module Diggy
 * @method formatBBCode
 * @return {String} The parsed code.
 * @static
 */
DGE.formatBBCode = function(code) {

	// Bolds the text.
	// Usage: [b]any text here[/b]
	// Output: <span style="font-weight: bold;">any text here</span>
	code = code.replace(/\[b](.*?)\[\/b\]/gi, '<span style="font-weight: bold;">$1</span>');

	// Colors the text.
	// Usage: [color=foo]any text here[/color]
	// Output: <span style="color: foo;">any text here</span>
	// foo can be any of: color-name (like "light-grey"), #888 (3-digit hex), #888888 (6-digit hex)
	code = code.replace(/\[color=(\#[0-9a-f]{3,6}|[a-z\-]+)\](.*?)\[\/color\]/gi, '<span style="color: $1;">$2</span>');

	// Sizes the text.
	// Usage: [font-family]any text here[/font]
	// Output: <span style="font-family: family;">any text here</span>
	code = code.replace(/\[font=(.*?)\](.*?)\[\/font\]/gi, '<span style="font-family: $1;">$2</span>');

	// Italicizes the text.
	// Usage: [i]any text here[/i]
	// Output: <span style="font-style: italic;">any text here</span>
	code = code.replace(/\[i](.*?)\[\/i\]/gi, '<span style="font-style: italic;">$1</span>');

	// Sizes the text.
	// Usage: [size=number]any text here[/size]
	// Output: <span style="font-size: {number}px;">any text here</span>
	code = code.replace(/\[size=(\d+)\](.*?)\[\/size\]/gi, '<span style="font-size: $1px;">$2</span>');

	// Underlines the text.
	// Usage: [u]any text here[/u]
	// Output: <span style="text-decoration: underline;">any text here</span>
	code = code.replace(/\[u](.*?)\[\/u\]/gi, '<span style="text-decoration: underline;">$1</span>');

	// Adds a hyperlink.
	// Usage: [url=anyurl]any text here[/url]
	// Output: <span style="text-decoration: underline;">any text here</span>
	code = code.replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, '<a href="$1" target="_new">$2</a>');

	return code;
	
};
