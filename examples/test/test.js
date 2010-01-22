(function() {

function init() {

	DGE.init({
		stage : {
			id : 'playground',
			width : 400,
			height : 300
		}
	});

	DGE.Text.defaults.size = 12;

	say('DGE.Sprite: enabled');
	say('DGE.Text: enabled');
	say(DGE.printf('DGE.platform.name: %s', DGE.platform.name));

	if (DGE.stage instanceof DGE.Sprite) {
		say(DGE.printf('DGE.stage: %sx%s', DGE.STAGE_WIDTH, DGE.STAGE_HEIGHT));
	} else {
		say('DGE.stage: not found', {color : '#F00'});
	}

	if (DGE.Audio._available) {

		var audio = new DGE.Audio({
			file : 'unrest.ogg'
		});

		say('DGE.Audio: enabled');
		say('Click here to play()', {
			click : function() {
				audio.play();
			},
			cursor : true,
		});
		say('Click here to stop()', {
			click : function() {
				audio.stop();
			},
			cursor : true,
		});
		say('Click here to mute()', {
			click : function() {
				//audio.set('volume', 50);
				audio.mute();
			},
			cursor : true,
		});
		say('Click here to mute(false)', {
			click : function() {
				//audio.set('volume', 50);
				audio.mute(false);
			},
			cursor : true,
		});

	} else {
		say('DGE.Audio: unavailable', {color : '#F00'});
	}

};

var say = (function() {

	var y = 0;

	return function(msg, conf) {
		conf = (conf || {});
		conf.text = msg;
		conf.y = y;
		new DGE.Text(conf);
		y += DGE.Text.defaults.size;
	};

})();

init();

})();
