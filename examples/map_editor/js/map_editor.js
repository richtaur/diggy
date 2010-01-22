mapEditor = (function() {

	var BUFFER = 6;
	var UI_WIDTH = 30;
	var UI_HEIGHT = 30;
	var Z_INDEX_UI = 3;
	var Z_INDEX_ABOVE = 2;
	var Z_INDEX_BELOW = 1;

	var brush = {
		x : 0,
		y : 0
	};
	var depth = 'below';
	var drawn = {
		above : {},
		below : {}
	};
	var editorConf;
	var isOverMap = true;
	var map;
	var sheets = {};
	var ui = {};

	function init(conf) {

		editorConf = conf;

		DGE.init({
			stage : {
				id : 'map_editor',
				background : '#000',
				width : editorConf.width,
				height : editorConf.height
			}
		});

		DGE.Text.defaults.font = 'Verdana';

		map = new DGE.Sprite({
			image : 'gfx/empty.png',
			width : (editorConf.tilesX * editorConf.tileWidth),
			height : (editorConf.tilesY * editorConf.tileHeight),
/*
			x : -((editorConf.tilesX * editorConf.tileWidth) / 2),
			y : -((editorConf.tilesY * editorConf.tileHeight) / 2)
*/
		});

		sheets.tiles = new DGE.SpriteSheet(
			editorConf.imageSrc,
			editorConf.tileWidth,
			editorConf.tileHeight
		);

		sheets.ui = new DGE.SpriteSheet(
			'gfx/ui.png',
			UI_WIDTH,
			UI_HEIGHT
		);

		initUI();

		ui.brushDialog = new DGE.Sprite({
			click : function(x, y) {

				var tx = Math.floor((x - this._x) / editorConf.tileWidth);
				var ty = Math.floor((y - this._y) / editorConf.tileHeight);

				drop(tx, ty);

			},
			cursor : true,
			fill : '#000',
			hide : true,
			image : editorConf.imageSrc,
			opacity : 0.8,
			over : function() {
				isOverMap = false;
			},
			out : function() {
				isOverMap = true;
			},
			width : (DGE.STAGE_WIDTH - (BUFFER * 2)),
			height : (DGE.STAGE_HEIGHT - (BUFFER * 3) - UI_HEIGHT),
			x : BUFFER,
			y : ((BUFFER * 2) + UI_HEIGHT),
			zIndex : Z_INDEX_UI
		}).setCSS('border', DGE.printf('1px solid %s', editorConf.fgColor));

		ui.mapDialog = new DGE.Sprite({
			click : function(x, y) {

			},
			cursor : true,
			fill : '#000',
			hide : true,
			opacity : 0.75,
			over : function() {
				isOverMap = false;
			},
			out : function() {
				isOverMap = true;
			},
			width : (DGE.STAGE_WIDTH - (BUFFER * 2)),
			height : (DGE.STAGE_HEIGHT - (BUFFER * 3) - UI_HEIGHT),
			x : BUFFER,
			y : ((BUFFER * 2) + UI_HEIGHT),
			zIndex : Z_INDEX_UI
		}).setCSS('border', DGE.printf('1px solid %s', editorConf.fgColor));

		DGE.controls.down(keyDown);
		DGE.Mouse.down(move);
		DGE.Mouse.move(move);
		move(0, 0);

	};

	function initUI() {

		var uiX = (DGE.STAGE_WIDTH - BUFFER - UI_WIDTH);

		ui.mouseCoords = new DGE.Text({
			id : 'mouse_coords',
			color : editorConf.fgColor,
			x : BUFFER,
			y : BUFFER,
			zIndex : Z_INDEX_UI
		}).shadow('0px 0px 3px #000');

		ui.saveButton = new DGE.Sprite({
			click : function() {

				ui.saveDialog.toggle();

				if (ui.saveDialog._visible) {
					showSave();
				}

			},
			cursor : true,
			over : function() {
				isOverMap = false;
			},
			out : function() {
				isOverMap = true;
			},
			x : uiX,
			y : BUFFER,
			zIndex : Z_INDEX_UI
		})
			.setSheet(sheets.ui)
			.setSheetCoords(1, 5);

		uiX -= (BUFFER + UI_WIDTH);

		ui.newButton = new DGE.Sprite({
			click : function() {
				if (confirm('Discard changes?')) {
					newMap();
				}
			},
			cursor : true,
			over : function() {
				isOverMap = false;
			},
			out : function() {
				isOverMap = true;
			},
			x : uiX,
			y : BUFFER,
			zIndex : Z_INDEX_UI
		})
			.setSheet(sheets.ui)
			.setSheetCoords(2, 5);

		uiX -= (BUFFER + UI_WIDTH);

		ui.loadButton = new DGE.Sprite({
			click : function() {
DGE.debug('load()');
			},
			cursor : true,
			over : function() {
				isOverMap = false;
			},
			out : function() {
				isOverMap = true;
			},
			x : uiX,
			y : BUFFER,
			zIndex : Z_INDEX_UI
		})
			.setSheet(sheets.ui)
			.setSheetCoords(0, 5);

		uiX -= (BUFFER + UI_WIDTH);

		ui.mapButton = new DGE.Sprite({
			click : function() {

				ui.mapDialog.toggle();

				if (ui.mapDialog._visible) {
					this.setSheetCoords(0, 6);
				} else {
					this.setSheetCoords(6, 4);
				}

			},
			cursor : true,
			over : function() {
				isOverMap = false;
			},
			out : function() {
				isOverMap = true;
			},
			x : uiX,
			y : BUFFER,
			zIndex : Z_INDEX_UI
		})
			.setSheet(sheets.ui)
			.setSheetCoords(6, 4);

		uiX -= (BUFFER + UI_WIDTH);

		ui.depthButton = new DGE.Sprite({
			click : function() {
				if (depth == 'below') {
					depth = 'above'
					this.setSheetCoords(1, 0);
				} else {
					depth = 'below'
					this.setSheetCoords(4, 3);
				}
			},
			cursor : true,
			over : function() {
				isOverMap = false;
			},
			out : function() {
				isOverMap = true;
			},
			x : uiX,
			y : BUFFER,
			zIndex : Z_INDEX_UI
		})
			.setSheet(sheets.ui)
			.setSheetCoords(4, 3);

		uiX -= (BUFFER + UI_WIDTH);

		ui.brushDialogButton = new DGE.Sprite({
			click : function() {

				ui.brushDialog.toggle();

				if (ui.brushDialog._visible) {
					this.setSheetCoords(6, 0);
				} else {
					this.setSheetCoords(6, 3);
				}

			},
			cursor : true,
			over : function() {
				isOverMap = false;
			},
			out : function() {
				isOverMap = true;
			},
			x : uiX,
			y : BUFFER,
			zIndex : Z_INDEX_UI
		})
			.setSheet(sheets.ui)
			.setSheetCoords(6, 3);

		ui.paintHistory = [];

		for (var i = 0; i < editorConf.paintHistory; i++) {

			uiX -= (BUFFER + UI_WIDTH);

			ui.paintHistory.push(new DGE.Sprite({
				click : function() {
					drop(this._sheetX, this._sheetY);
				},
				cursor : true,
				over : function() {
					isOverMap = false;
				},
				out : function() {
					isOverMap = true;
				},
				x : uiX,
				y : BUFFER,
				zIndex : Z_INDEX_UI
			})
				.setSheet(sheets.tiles)
				.setSheetCoords(5, 12));

		}

		ui.paintHistory[0]
			.setSheetCoords(0, 0)
			.setCSS('border', DGE.printf('1px solid %s', editorConf.fgColor));

	};

	function drop(tx, ty) {

		brush = {
			x : tx,
			y : ty
		};

		for (var i = (editorConf.paintHistory - 1); i > 0; i--) {
			ui.paintHistory[i]._node.style.backgroundPosition = ui.paintHistory[i - 1]._node.style.backgroundPosition;
			ui.paintHistory[i].setSheetCoords(
				ui.paintHistory[i - 1]._sheetX,
				ui.paintHistory[i - 1]._sheetY
			);
		}

		ui.paintHistory[0].setSheetCoords(brush.x, brush.y);

	};

	function keyDown(keyCode) {

		switch (keyCode) {
			case DGE.controls.UP:
				map._y -= editorConf.tileHeight;
				map.plot();
				break;
			case DGE.controls.DOWN:
				map._y += editorConf.tileHeight;
				map.plot();
				break;
			case DGE.controls.LEFT:
				map._x -= editorConf.tileWidth;
				map.plot();
				break;
			case DGE.controls.RIGHT:
				map._x += editorConf.tileWidth;
				map.plot();
				break;
		}

	};

	function move(x, y) {

		var tx = Math.floor(x / editorConf.tileWidth);
		var ty = Math.floor(y / editorConf.tileHeight);

		ui.mouseCoords.text(
			DGE.printf('Actual: %s, %s<br>Tile: %s, %s', x, y, tx, ty)
		);

		if (!DGE.Mouse.isDown()) return;
		if (!isOverMap) return;

		paint(x, y);

	};

	function newMap() {

		for (var depth in drawn) {
			for (var key in drawn[depth]) {
				drawn[depth][key].remove();
			}
		}

		drawn = {
			above : {},
			below : {}
		};

	};

	function paint(x, y) {

		var tx = Math.floor((x - map._x) / editorConf.tileWidth);
		var ty = Math.floor((y - map._y) / editorConf.tileHeight);
		var coords = DGE.printf('%s,%s', tx, ty);

		if (coords in drawn[depth]) {
			drawn[depth][coords].setSheetCoords(brush.x, brush.y);
		} else {

			drawn[depth][coords] = new DGE.Sprite({
				addTo : map,
				x : (tx * editorConf.tileWidth),
				y : (ty * editorConf.tileHeight),
				width : editorConf.tileWidth,
				height : editorConf.tileHeight,
				zIndex : ((depth == 'below') ? Z_INDEX_BELOW : Z_INDEX_ABOVE)
			}).setSheet(sheets.tiles).setSheetCoords(brush.x, brush.y);

		}

	};

	return init;

})();
