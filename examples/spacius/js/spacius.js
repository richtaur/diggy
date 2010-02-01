// Compatible with Diggy v0.1
(function() {

	var GROUP_UFOS = 'ufos';
	var NUM_SHOTS = 3;
	var NUM_STARS = 50;
	var SPEED_SHIP = 5;
	var SPEED_SHOT = 15;
	var SPEED_UFO = 3;

	var main;
	var music;
	var numUFOs;
	var score = {};
	var sfx;
	var ship;
	var shots = [];
	var stars = [];

	var Star = DGE.extend(DGE.Sprite, function(conf) {
		this.init(conf);
	});

	Star.prototype.reset = function() {

		var speed = DGE.rand(1, 3);
		var color = (speed * 3);

		this.fill(DGE.sprintf('#%s%s%s', color, color, color));
		this.plot(DGE.STAGE_WIDTH, DGE.rand(0, DGE.STAGE_HEIGHT));
		this.speed(speed);

		return this;

	};

	function init() {

		DGE.init({
			stage : {
				id : 'playground',
				background : '#000',
				width : 400,
				height : 300
			}
		});

		new DGE.Loader([
			'gfx/explode.gif',
			'gfx/ship.gif',
			'gfx/ship_moving.gif',
			'gfx/shot.gif',
			'gfx/ufo_ds.gif'
		]);

		score.text = new DGE.Text({
			color : '#FFF',
			font : 'verdana',
			size : 10,
			text : 'Score: 0',
			x : 5,
			y : 5,
			zIndex : 1
		});

		ship = new DGE.Sprite({
			image : 'gfx/ship.gif',
			width : 32,
			height : 16,
			zIndex : 1
		}).start();

		for (var i = 0; i < NUM_SHOTS; i++) {
			shots.push(new DGE.Sprite({
				_active : false,
				angle : 180,
				hide : true,
				image : 'gfx/shot.gif',
				move : DGE.Sprite.move.angle,
				ping : function() {
					if (this.isOutOfBounds(true)) this._active = false;
				},
				speed : SPEED_SHOT,
				width : 8,
				height : 8
			}).start());
		}

		for (var i = 0; i < NUM_STARS; i++) {

			stars.push(new Star({
				angle : 0,
				move : DGE.Sprite.move.angle,
				ping : function() {
					if (this.isOutOfBounds()) this.reset();
				},
				width : 1,
				height : 1
			})
				.reset()
				.plot(DGE.rand(0, DGE.STAGE_WIDTH), DGE.rand(0, DGE.STAGE_HEIGHT))
			);

		}

		var music = new DGE.Audio({
			file : 'audio/theme.mp3',
			loop : true
		});

		sfx = {
			shot : new DGE.Audio({
				file : 'audio/shot.mp3'
			}),
			ufoDeath : new DGE.Audio({
				file : 'audio/ufo_die.mp3'
			})
		};

		DGE.controls.down(keyDown);
		music.play();
		newGame();

	};

	function newGame() {

		numUFOs = 0;
		score.value = 0;
		score.text.text(DGE.sprintf('Score: %s', DGE.formatNumber(score.value)));
		ship.center().show();
		DGE.Sprite.getByGroup(GROUP_UFOS, 'remove');

	};

	function keyDown(keyCode) {

		if (keyCode == DGE.controls.SPACE) {

			for (var i = 0; i < NUM_SHOTS; i++) {
				if (!shots[i]._active) {

					sfx.shot.play();

					shots[i]._active = true;
					shots[i].plot((ship._x + ship._width), (ship._y + 2));
					shots[i].show();

					break;

				}
			}

		}

	};

	main = new DGE.Interval(function() {

		// Move the stars (doing it in one place gets better performance)
		for (var i = 0; i < NUM_STARS; i++) {
			stars[i].exec();
		}

		// Create a new enemy?
		// Always create one if there aren't any, otherwise a 1% chance.
		if ((numUFOs == 0) || (DGE.rand(1, 100) == 1)) {

			numUFOs++;

			new DGE.Sprite({
				angle : 0,
				image : 'gfx/ufo_ds.gif',
				group : GROUP_UFOS,
				move : DGE.Sprite.move.angle,
				ping : function() {

					if (!this._active) return;

					// Are we out of bounds?
					if (this.isOutOfBounds(true)) {
						numUFOs--;
						this.remove();
						return;
					}

					// Did we get shot?
					for (var i = 0; i < NUM_SHOTS; i++) {
					
						if (shots[i]._active && this.isTouching(shots[i])) {

							sfx.ufoDeath.play();

							score.value += 100;
							score.text.text(DGE.sprintf('Score: %s', DGE.formatNumber(score.value)));

							shots[i]._active = false;
							shots[i].hide();

							numUFOs--;
							this._active = false;
							this.image('gfx/explode.gif');
							this.remove(600);

							return;

						}
					}

					// Did we destroy the ship?
					if (this.isTouching(ship)) newGame();
					
				},
				speed : SPEED_UFO,
				x : DGE.STAGE_WIDTH,
				y : DGE.rand(0, (DGE.STAGE_HEIGHT - 32)),
				width : 32,
				height : 32,
				zIndex : 1
			}).start();

		}

		// Move the ship
		var c = DGE.controls;
		var x = ship._x;
		var y = ship._y;

		if (c.isDown(c.UP)) {
			ship._y -= SPEED_SHIP;
			if (ship._y <= 0) ship._y = 0;
		} else if (c.isDown(c.DOWN)) {
			ship._y += SPEED_SHIP;
			if (ship._y >= (DGE.STAGE_HEIGHT - ship._height)) ship._y = (DGE.STAGE_HEIGHT - ship._height);
			ship.plot();
		}

		if (c.isDown(c.LEFT)) {
			ship._x -= SPEED_SHIP;
			if (ship._x <= 0) ship._x = 0;
			ship.plot();
		} else if (c.isDown(c.RIGHT)) {
			ship._x += SPEED_SHIP;
			if (ship._x >= (DGE.STAGE_WIDTH - ship._width)) ship._x = (DGE.STAGE_WIDTH - ship._width);
		}

		if (c.isDown(c.RIGHT)) {
			ship.image('gfx/ship_moving.gif');
		} else {
			ship.image('gfx/ship.gif');
		}

		if (
			(ship._x != x)
			|| (ship._y != y)
		) ship.plot();

	}, DGE.Interval.formatFPS(30));

	init();
	main.start();

})();
