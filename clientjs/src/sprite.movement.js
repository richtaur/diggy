DGE.Sprite.move = {

	angle : function() {

		var a = this.angle();
		var speed = this.speed();

		if (a === undefined) return this;

		// What the fuck is wrong with me I used to know how to do this
		a = (270 - a);
		var r = ((a * Math.PI) / 180);

		this._x += (Math.sin(r) * speed);
		this._y += (Math.cos(r) * speed);

		return this.plot();

	}

};
