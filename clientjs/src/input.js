/**
TODO: what should this file be called?
input.keyboard.js?
what will mouse be called?
input.mouse.js?
input.controller.js?
does it make sense to combine them?

also this should be using the same format as whatever
DGE uses, so like maybe:
DGE.controls.on('keyDown', keyDownFn);

 */
DGE.controls = (function() {

var fnUp;
var fnDown;
var isDown = {};

DGE.addEvent(window, 'keydown', function(e) {
//console.log('keydown:', e.keyCode);
	isDown[e.keyCode] = true;
	if (fnDown) fnDown(e.keyCode);
});

DGE.addEvent(window, 'keyup', function(e) {
//console.log('keyup:', e.keyCode);
	delete isDown[e.keyCode];
	if (fnUp) fnUp(e.keyCode);
});

return {

	CONTROL : 17,
	ESCAPE : 27,
	SHIFT : 16,
	SPACE : 32,
	TAB : 9,

	UP : 38,
	DOWN : 40,
	LEFT : 37,
	RIGHT : 39,

	isDown : function(keyCode) {
		return !!isDown[keyCode];
	},
	up : function(fn) {
		fnUp = fn;
	},
	down : function(fn) {
		fnDown = fn;
	}

};

})();
