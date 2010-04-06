mapEditor = (function() {

	var BUFFER = 6;
	var UI_WIDTH = 30;
	var UI_HEIGHT = 30;
	var Z_UI = 3;
	var Z_ABOVE = 2;
	var Z_BELOW = 1;

	var brush = {
		x : 0,
		y : 0
	};
	var depth = 'below';
	var drawn = {
		above : {},
		below : {},
		script : {}
	};
	var editorConf;
	var isOverMap = true;
	var map;
	var sheets = {};
	var ui = {};

	function init(conf) {

		editorConf = conf;

		DGE.init({
			id : 'map_editor',
			background : '#000',
			width : editorConf.width,
			height : editorConf.height
		});

		DGE.Text.defaults.color = editorConf.fgColor;
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

		sheets.tiles = new DGE.Sprite.Sheet({
			image : editorConf.imageSrc,
			spriteWidth : editorConf.tileWidth,
			spriteHeight : editorConf.tileHeight,
			width : DGE.stage.width,
			height : DGE.stage.height
		});

		sheets.ui = new DGE.Sprite.Sheet({
			image : 'gfx/ui.png',
			spriteWidth : UI_WIDTH,
			spriteHeight : UI_HEIGHT,
			width : DGE.stage.width,
			height : DGE.stage.height
		});

		/*
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
		*/

		initUI();

		ui.brushDialog = new DGE.Sprite({
			background : '#000',
			cursor : true,
			image : editorConf.imageSrc,
			opacity : 80,
			over : function() {
				isOverMap = false;
			},
			out : function() {
				isOverMap = true;
			},
			width : (DGE.stage.width - (BUFFER * 2)),
			height : (DGE.stage.height - (BUFFER * 3) - UI_HEIGHT),
			x : BUFFER,
			y : ((BUFFER * 2) + UI_HEIGHT),
			z : Z_UI
		})
			.hide()
			.on('click', function(x, y) {

				var tx = Math.floor((x - this.x) / editorConf.tileWidth);
				var ty = Math.floor((y - this.y) / editorConf.tileHeight);

				drop(tx, ty);

			})
			.setCSS('border', DGE.sprintf('1px solid %s', editorConf.fgColor));

/*
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
			z : Z_UI
		}).setCSS('border', DGE.sprintf('1px solid %s', editorConf.fgColor));
*/

		ui.saveDialog = new DGE.Text({
			background : editorConf.bgColor,
			font : 'Courier, Sans-Serif',
			opacity : 80,
			over : function() {
				isOverMap = false;
			},
			out : function() {
				isOverMap = true;
			},
			width : (DGE.stage.width - (BUFFER * 2)),
			height : (DGE.stage.height - (BUFFER * 3) - UI_HEIGHT),
			x : BUFFER,
			y : ((BUFFER * 2) + UI_HEIGHT),
			z : Z_UI
		})
			.hide()
			.setCSS('border', DGE.sprintf('1px solid %s', editorConf.fgColor));

		DGE.Keyboard.on('keyDown', keyDown);
		DGE.stage.on('mouseDown', function(x, y) {
			DGE.Mouse.down = true;
			move(x, y);
		});
		DGE.stage.on('mouseMove', move);
		move(0, 0);

	};

	function initUI() {

		var uiX = (DGE.stage.width - BUFFER - UI_WIDTH);

		ui.mouseCoords = new DGE.Text({
			id : 'mouse_coords',
			shadow : '0px 0px 3px #000',
			width : 200,
			height : 30,
			x : BUFFER,
			y : BUFFER,
			z : Z_UI
		});

		ui.saveButton = new DGE.Sprite({
			cursor : true,
			sheet : sheets.ui,
			sheetX : 1,
			sheetY : 5,
			width : UI_WIDTH,
			height : UI_HEIGHT,
			x : uiX,
			y : BUFFER,
			z : Z_UI
		})
			.on('click', function() {

				ui.saveDialog.toggleVisibility();

				if (ui.saveDialog.get('visible')) {
					showSave();
				}

			})
			.on('over', function() {
				isOverMap = false;
			})
			.on('out', function() {
				isOverMap = true;
			});

		uiX -= (BUFFER + UI_WIDTH);

		ui.newButton = new DGE.Sprite({
			cursor : true,
			sheet : sheets.ui,
			sheetX : 2,
			sheetY : 5,
			width : UI_WIDTH,
			height : UI_HEIGHT,
			x : uiX,
			y : BUFFER,
			z : Z_UI
		})
			.on('click', function() {
				if (confirm('Discard changes?')) {
					newMap();
				}
			})
			.on('over', function() {
				isOverMap = false;
			})
			.on('out', function() {
				isOverMap = true;
			});

		uiX -= (BUFFER + UI_WIDTH);

		ui.loadButton = new DGE.Sprite({
			cursor : true,
			sheet : sheets.ui,
			sheetX : 0,
			sheetY : 5,
			width : UI_WIDTH,
			height : UI_HEIGHT,
			x : uiX,
			y : BUFFER,
			z : Z_UI
		})
			.on('click', function() {

				var filename = prompt('Which map would you like to load?');

				if (filename) loadMap(filename);

			})
			.on('over', function() {
				isOverMap = false;
			})
			.on('out', function() {
				isOverMap = true;
			});

		uiX -= (BUFFER + UI_WIDTH);

/*
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
			z : Z_UI
		})
			.setSheet(sheets.ui)
			.setSheetCoords(6, 4);

		uiX -= (BUFFER + UI_WIDTH);
*/

		ui.depthButton = new DGE.Sprite({
			cursor : true,
			sheet : sheets.ui,
			sheetX : 4,
			sheetY : 3,
			width : UI_WIDTH,
			height : UI_HEIGHT,
			x : uiX,
			y : BUFFER,
			z : Z_UI
		})
			.on('click', function() {
				if (depth == 'below') {
					depth = 'above'
					this.set('sheetX', 1);
					this.set('sheetY', 0);
				} else {
					depth = 'below'
					this.set('sheetX', 4);
					this.set('sheetY', 3);
				}
			})
			.on('over', function() {
				isOverMap = false;
			})
			.on('out', function() {
				isOverMap = true;
			});

		uiX -= (BUFFER + UI_WIDTH);

		ui.brushDialogButton = new DGE.Sprite({
			cursor : true,
			sheet : sheets.ui,
			sheetX : 6,
			sheetY : 3,
			width : UI_WIDTH,
			height : UI_HEIGHT,
			x : uiX,
			y : BUFFER,
			z : Z_UI
		})
			.on('click', function() {

				ui.brushDialog.toggleVisibility();

				if (ui.brushDialog.get('visible')) {
					this.set('sheetX', 6);
					this.set('sheetY', 0);
				} else {
					this.set('sheetX', 6);
					this.set('sheetY', 3);
				}

			})
			.on('over', function() {
				isOverMap = false;
			})
			.on('out', function() {
				isOverMap = true;
			});

		ui.paintHistory = [];

		for (var i = 0; i < editorConf.paintHistory; i++) {

			uiX -= (BUFFER + UI_WIDTH);

			ui.paintHistory.push(new DGE.Sprite({
				cursor : true,
				sheet : sheets.tiles,
				sheetX : 5,
				sheetY : 12,
				width : editorConf.tileWidth,
				height : editorConf.tileHeight,
				x : uiX,
				y : BUFFER,
				z : Z_UI
			})
				.on('click', function() {
					drop(this.get('sheetX'), this.get('sheetY'));
				})
				.on('over', function() {
					isOverMap = false;
				})
				.on('out', function() {
					isOverMap = true;
				})
			);

		}

		ui.paintHistory[0]
			.set('sheetX', 0)
			.set('sheetY', 0)
			.setCSS('border', DGE.sprintf('1px solid %s', editorConf.fgColor));

	};

	function drop(tx, ty) {

		brush = {
			x : tx,
			y : ty
		};

		for (var i = (editorConf.paintHistory - 1); i > 0; i--) {
			ui.paintHistory[i].node.style.backgroundPosition = ui.paintHistory[i - 1].node.style.backgroundPosition;
			ui.paintHistory[i].set('sheetX', ui.paintHistory[i - 1].get('sheetX'));
			ui.paintHistory[i].set('sheetY', ui.paintHistory[i - 1].get('sheetY'));
		}

		ui.paintHistory[i].set('sheetX', brush.x);
		ui.paintHistory[i].set('sheetY', brush.y);

	};

	function keyDown(keyCode) {

		switch (keyCode) {
			case DGE.Keyboard.UP:
				map.y += editorConf.tileHeight;
				map.plot();
				break;
			case DGE.Keyboard.DOWN:
				map.y -= editorConf.tileHeight;
				map.plot();
				break;
			case DGE.Keyboard.LEFT:
				map.x += editorConf.tileWidth;
				map.plot();
				break;
			case DGE.Keyboard.RIGHT:
				map.x -= editorConf.tileWidth;
				map.plot();
				break;
		}

	};

	function loadMap(filename) {

		try {

			DGE.xhr(
				'GET',
				DGE.sprintf('maps/%s', filename), {
					error : function(e) {
						alert(DGE.sprintf('Error loading %s, sorry.', filename));
					},
					complete : function(data) {
						setMap(DGE.json.decode(data.responseText));
					}
				}
			);

		} catch(e) {
			alert(DGE.sprintf("Couldn't find %s, sorry.", filename));
		}

	};

	function move(x, y) {

		var tx = Math.floor(x / editorConf.tileWidth);
		var ty = Math.floor(y / editorConf.tileHeight);

		ui.mouseCoords.set(
			'text',
			DGE.sprintf('Actual: %s, %s<br>Tile: %s, %s', x, y, tx, ty)
		);

		if (!DGE.Mouse.down) return;
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
			below : {},
			script : {}
		};

		map.plot(0, 0);

	};

	function paint(x, y) {

		var tx = Math.floor((x - map.x) / editorConf.tileWidth);
		var ty = Math.floor((y - map.y) / editorConf.tileHeight);
		var coords = DGE.sprintf('%s,%s', tx, ty);

		if (coords in drawn[depth]) {
			drawn[depth][coords].set('sheetX', brush.x);
			drawn[depth][coords].set('sheetY', brush.y);
		} else {

			drawn[depth][coords] = new DGE.Sprite({
				parent : map,
				sheet : sheets.tiles,
				sheetX : brush.x,
				sheetY : brush.y,
				x : (tx * editorConf.tileWidth),
				y : (ty * editorConf.tileHeight),
				width : editorConf.tileWidth,
				height : editorConf.tileHeight,
				z : ((depth == 'below') ? Z_BELOW : Z_ABOVE)
			});

		}

	};

	// Sweet christ this function is ugly
	function setMap(data) {

		newMap();

		for (var key in data) {
			for (var x = 0; x < data[key].length; x++) {
				if (data[key][x] !== null) {
					for (var y = 0; y < data[key][x].length; y++) {
						if (data[key][x][y] !== null) {

							var coords = data[key][x][y].split(',');
							var drawnKey = DGE.sprintf('%s,%s', x, y);

							drawn[key][drawnKey] = new DGE.Sprite({
								parent : map,
								sheet : sheets.tiles,
								sheetX : coords[0],
								sheetY : coords[1],
								x : (x * editorConf.tileWidth),
								y : (y * editorConf.tileHeight),
								width : editorConf.tileWidth,
								height : editorConf.tileHeight,
								z : ((key == 'below') ? Z_BELOW : Z_ABOVE)
							});
						
						}
					}
				}
			}
		}

	};

	function showSave() {

		var json = {
			above : [],
			below : [],
			script : []
		};

		for (var depth in drawn) {
			for (var key in drawn[depth]) {

				var coords = key.split(',');
				var tx = coords[0];
				var ty = coords[1];
				var sx = drawn[depth][key].get('sheetX');
				var sy = drawn[depth][key].get('sheetY');

				if (!json[depth][tx]) json[depth][tx] = [];
				json[depth][tx][ty] = DGE.sprintf('%s,%s', sx, sy);

			}
		}

		ui.saveDialog.set('text', DGE.json.encode(json));

	};

	return init;

})();
