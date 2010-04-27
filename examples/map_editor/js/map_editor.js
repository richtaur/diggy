mapEditor = (function() {

  var BUFFER = 6;
  var UI_WIDTH = 30;
  var UI_HEIGHT = 30;
  var Z_UI = 3;
  var Z_SCRIPT = 3;
  var Z_ABOVE = 2;
  var Z_BELOW = 1;

  var brush = {
    script : 0,
    type : 'below',
    x : 0,
    y : 0
  };
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
    DGE.Text.defaults.font = editorConf.font;
    DGE.Text.defaults.size = editorConf.fontSize;

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

    initUI();

    ui.brushDialog = new DGE.Sprite({
      background : '#000',
      cursor : true,
      image : editorConf.imageSrc,
      opacity : 85,
      width : editorConf.imageWidth,
      height : editorConf.imageHeight,
      /*
      width : (DGE.stage.width - (BUFFER * 2)),
      height : (DGE.stage.height - (BUFFER * 3) - UI_HEIGHT),
      */
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
      .on('mouseOver', function() {
        isOverMap = false;
      })
      .on('mouseOut', function() {
        isOverMap = true;
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
      title : 'Save',
      width : UI_WIDTH,
      height : UI_HEIGHT,
      x : uiX,
      y : BUFFER,
      z : Z_UI
    })
      .on('click', function() {
        showSave();
      })
      .on('mouseOver', function() {
        isOverMap = false;
      })
      .on('mouseOut', function() {
        isOverMap = true;
      });

    uiX -= (BUFFER + UI_WIDTH);

    ui.newButton = new DGE.Sprite({
      cursor : true,
      sheet : sheets.ui,
      sheetX : 2,
      sheetY : 5,
      title : 'New',
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
      .on('mouseOver', function() {
        isOverMap = false;
      })
      .on('mouseOut', function() {
        isOverMap = true;
      });

    uiX -= (BUFFER + UI_WIDTH);

    ui.loadButton = new DGE.Sprite({
      cursor : true,
      sheet : sheets.ui,
      sheetX : 0,
      sheetY : 5,
      title : 'Load',
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
      .on('mouseOver', function() {
        isOverMap = false;
      })
      .on('mouseOut', function() {
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

    ui.scriptButton = new DGE.Text({
      align : 'center',
      cursor : true,
      sheet : sheets.ui,
      sheetX : 2,
      sheetY : 6,
      text : brush.script,
      title : 'Set script number',
      width : UI_WIDTH,
      height : UI_HEIGHT,
      x : uiX,
      y : BUFFER,
      z : Z_UI
    })
      .on('click', function() {

        var num = prompt('Input script number.\n(eg, 0 for blank, 1 for wall)');

        if (num) {
          brush.script = num;
          this.set('text', brush.script);
        }

      })
      .on('mouseOver', function() {
        isOverMap = false;
      })
      .on('mouseOut', function() {
        isOverMap = true;
      });

    uiX -= (BUFFER + UI_WIDTH);

    ui.typeButton = new DGE.Sprite({
      cursor : true,
      sheet : sheets.ui,
      sheetX : 4,
      sheetY : 3,
      title : 'Depth (above/below)',
      width : UI_WIDTH,
      height : UI_HEIGHT,
      x : uiX,
      y : BUFFER,
      z : Z_UI
    })
      .on('click', function() {

        if (brush.type == 'below') {
          brush.type = 'above';
          this.set('sheetX', 1);
          this.set('sheetY', 0);
        } else if (brush.type == 'above') {
          brush.type = 'script';
          this.set('sheetX', 1);
          this.set('sheetY', 6);
        } else {
          brush.type = 'below';
          this.set('sheetX', 4);
          this.set('sheetY', 3);
        }

      })
      .on('mouseOver', function() {
        isOverMap = false;
      })
      .on('mouseOut', function() {
        isOverMap = true;
      });

    uiX -= (BUFFER + UI_WIDTH);

    ui.brushDialogButton = new DGE.Sprite({
      cursor : true,
      sheet : sheets.ui,
      sheetX : 6,
      sheetY : 3,
      title : 'Tiles',
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
      .on('mouseOver', function() {
        isOverMap = false;
      })
      .on('mouseOut', function() {
        isOverMap = true;
      });

    ui.paintHistory = [];

    for (var i = 0; i < editorConf.paintHistory; i++) {

      uiX -= (BUFFER + UI_WIDTH);

      ui.paintHistory.push(new DGE.Sprite({
        cursor : true,
        opacity : ((i == 0) ? 100 : 50),
        sheet : sheets.tiles,
        sheetX : 5,
        sheetY : 12,
        title : 'Paint history',
        width : editorConf.tileWidth,
        height : editorConf.tileHeight,
        x : uiX,
        y : BUFFER,
        z : Z_UI
      })
        .on('click', function() {
          drop(this.get('sheetX'), this.get('sheetY'));
        })
        .on('mouseOver', function() {
          isOverMap = false;
        })
        .on('mouseOut', function() {
          isOverMap = true;
        })
        .setCSS('border', DGE.sprintf('1px solid %s', editorConf.fgColor))
      );

    }

    ui.paintHistory[0]
      .set('sheetX', 0)
      .set('sheetY', 0);

  };

  function drop(tx, ty) {

    brush.x = tx;
    brush.y = ty;

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

    var tx = Math.floor((x / editorConf.tileWidth) - (map.x / editorConf.tileWidth));
    var ty = Math.floor((y / editorConf.tileHeight) - (map.y / editorConf.tileHeight));

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

    if (coords in drawn[brush.type]) {
      if (brush.type == 'script') {
        drawn[brush.type][coords].set('text', brush.script);
      } else {
        drawn[brush.type][coords].set('sheetX', brush.x);
        drawn[brush.type][coords].set('sheetY', brush.y);
      }
    } else {

      if (brush.type == 'script') {
        drawn[brush.type][coords] = new DGE.Text({
          align : 'center',
          parent : map,
          text : brush.script,
          x : (tx * editorConf.tileWidth),
          y : (ty * editorConf.tileHeight),
          width : editorConf.tileWidth,
          height : editorConf.tileHeight,
          z : Z_SCRIPT
        });
      } else {
        drawn[brush.type][coords] = new DGE.Sprite({
          parent : map,
          sheet : sheets.tiles,
          sheetX : brush.x,
          sheetY : brush.y,
          x : (tx * editorConf.tileWidth),
          y : (ty * editorConf.tileHeight),
          width : editorConf.tileWidth,
          height : editorConf.tileHeight,
          z : ((brush.type == 'below') ? Z_BELOW : Z_ABOVE)
        });
      }

    }

  };

  // Sweet christ this function is ugly
  function setMap(data) {

    newMap();

    for (var depth in data) {
      for (var x = 0; x < data[depth].length; x++) {
        if (data[depth][x] !== null) {
          for (var y = 0; y < data[depth][x].length; y++) {
            if (data[depth][x][y] !== null) {

              var drawnKey = DGE.sprintf('%s,%s', x, y);

              if (depth == 'script') {

                var script = data[depth][x][y];

                drawn[depth][drawnKey] = new DGE.Text({
                  align : 'center',
                  parent : map,
                  text : script,
                  x : (x * editorConf.tileWidth),
                  y : (y * editorConf.tileHeight),
                  width : editorConf.tileWidth,
                  height : editorConf.tileHeight,
                  z : Z_SCRIPT
                });

              } else {

                var coords = data[depth][x][y].split(',');

                drawn[depth][drawnKey] = new DGE.Sprite({
                  parent : map,
                  sheet : sheets.tiles,
                  sheetX : coords[0],
                  sheetY : coords[1],
                  x : (x * editorConf.tileWidth),
                  y : (y * editorConf.tileHeight),
                  width : editorConf.tileWidth,
                  height : editorConf.tileHeight,
                  z : ((depth == 'below') ? Z_BELOW : Z_ABOVE)
                });

              }
            
            }
          }
        }
      }
    }

  };

  function showSave() {

    var win = window.open('', '_blank', 'width=750, height=400, location=0, resizable=1, menubar=0, scrollbars=1');

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

        if (!json[depth][tx]) json[depth][tx] = [];

        if (depth == 'script') {
          json[depth][tx][ty] = drawn[depth][key].get('text');
        } else {
          var sx = drawn[depth][key].get('sheetX');
          var sy = drawn[depth][key].get('sheetY');
          json[depth][tx][ty] = DGE.sprintf('%s,%s', sx, sy);
        }

      }
    }

    win.document.write(DGE.json.encode(json));

  };

  return init;

})();
