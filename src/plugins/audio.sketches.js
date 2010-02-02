/*
DGE.Audio
	get
	set
		file
		volume
	play
	pause
	mute
	stop
*/

/*
TODO: DGE.Audio.set('loop', true/false);
DGE.Audio.seek(seconds);

on:
	complete

*/

// Static methods
DGE.Audio.mute();
DGE.Audio.set('volume', 100);
DGE.Audio.get('volume');

levelTwo.on('complete', fn);
levelTwo.on('play', fn);
levelTwo.on('stop', fn);
