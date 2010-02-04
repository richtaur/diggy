// Compatible with Diggy v0.1
(function() {

	var GROUP_UFOS = 'ufos';
	var NUM_SHOTS = 3;
	var NUM_STARS = 50;
	var VELOCITY_SHIP = 5;
	var VELOCITY_SHOT = 15;
	var VELOCITY_UFO = 3;

	var main;
	var music;
	var numUFOs;
	var score = {};
	var sfx;
	var ship;
	var shots = [];
	var stars = [];

	var Star = DGE.extend(DGE.Sprite, function(conf) {
		this.initSprite(conf);
	});

	Star.prototype.reset = function() {

		var velocity = DGE.rand(1, 3);
		var color = (velocity * 3);

		this.plot(DGE.stage.width, DGE.rand(0, DGE.stage.height));
		this.fill(DGE.sprintf('#%s%s%s', color, color, color));
		this.set('velocity', velocity);

		return this;

	};

	function init() {

		DGE.init({
			id : 'playground',
			width : 400,
			height : 300
		}).fill('#000');

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
			width : 200,
			height : 20,
			x : 5,
			y : 5,
			z : 1
		});

		ship = new DGE.Sprite({
			image : 'gfx/ship.gif',
			width : 32,
			height : 16,
			z : 2
		});

		for (var i = 0; i < NUM_SHOTS; i++) {
			shots.push(new DGE.Sprite({
				angle : 180,
				image : 'gfx/shot.gif',
				velocity : VELOCITY_SHOT,
				width : 8,
				height : 8
			}).hide().on('ping', function() {
				if (this.isOutOfBounds(true)) {
					this.hide();
					this.stop();
				}
			}));
		}

		for (var i = 0; i < NUM_STARS; i++) {

			stars.push(new Star({
				width : 1,
				height : 1
			})
				.reset()
				.plot(DGE.rand(0, DGE.stage.width), DGE.rand(0, DGE.stage.height))
				.on('ping', function() {
					if (this.isOutOfBounds()) this.reset();
				})
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

		score.text.set('text', DGE.sprintf('Score: %s', DGE.formatNumber(score.value)));
		ship.center().show();
		//DGE.Sprite.getByGroup(GROUP_UFOS, 'remove');

	};

	function keyDown(keyCode) {

		if (keyCode == DGE.controls.SPACE) {

			for (var i = 0; i < NUM_SHOTS; i++) {
				if (!shots[i].get('active')) {

					sfx.shot.play();

					shots[i].plot((ship.x + ship.width), (ship.y + 2));
					shots[i].set('moving', true);
					shots[i].show();
					shots[i].start();

					break;

				}
			}

		}

	};

	main = new DGE.Interval(function() {

		// Move the stars (doing it in one place gets better performance)
		for (var i = 0; i < NUM_STARS; i++) {
			stars[i].move();
			stars[i].fire('ping');
		}

		// Always create one if there aren't any, otherwise a 1% chance.
		if ((numUFOs == 0) || (DGE.rand(1, 100) == 1)) {

			numUFOs++;

			new DGE.Sprite({
				image : 'gfx/ufo_ds.gif',
				//group : GROUP_UFOS,
				moving : true,
				velocity : VELOCITY_UFO,
				x : DGE.stage.width,
				y : DGE.rand(ship.height, (DGE.stage.height - 32)),
				z : 2,
				width : 32,
				height : 32
			})
				.on('ping', function() {

					if (!this.get('active')) return;

					// Are we out of bounds?
					if (this.isOutOfBounds(true)) {
						numUFOs--;
						this.remove();
						return;
					}

					// Did we get shot?
					for (var i = 0; i < NUM_SHOTS; i++) {
					
						if (shots[i].get('active') && this.isTouching(shots[i])) {

							sfx.ufoDeath.play();

							score.value += 100;
							score.text.set('text', DGE.sprintf('Score: %s', DGE.formatNumber(score.value)));

							shots[i].hide();
							shots[i].stop();

							numUFOs--;
							this.stop();
							this.set('image', 'gfx/explode.gif');
							this.remove(600);

							return;

						}
					}

					// Did we destroy the ship?
					if (this.isTouching(ship)) newGame();
					
				})
				.start();

		}

		// Move the ship
		var c = DGE.controls;
		var x = ship.x;
		var y = ship.y;

		if (c.isDown(c.UP)) {
			ship.y -= VELOCITY_SHIP;
			if (ship.y <= 0) ship.y = 0;
		} else if (c.isDown(c.DOWN)) {
			ship.y += VELOCITY_SHIP;
			if (ship.y >= (DGE.stage.height - ship.height)) ship.y = (DGE.stage.height - ship.height);
			ship.plot();
		}

		if (c.isDown(c.LEFT)) {
			ship.x -= VELOCITY_SHIP;
			if (ship.x <= 0) ship.x = 0;
			ship.plot();
		} else if (c.isDown(c.RIGHT)) {
			ship.x += VELOCITY_SHIP;
			if (ship.x >= (DGE.stage.width - ship.width)) ship.x = (DGE.stage.width - ship.width);
		}

		if (c.isDown(c.RIGHT)) {
			ship.set('image', 'gfx/ship_moving.gif');
		} else {
			ship.set('image', 'gfx/ship.gif');
		}

		if (
			(ship.x != x)
			|| (ship.y != y)
		) ship.plot();

	}, DGE.Interval.formatFPS(30));

	init();
	main.start();

})();
