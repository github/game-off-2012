function Game(canvas) {
	this.canvas = canvas
	this.ctx = canvas.getContext("2d")
	this.objects = []
	this.prevTime = Date.now()
	this.speed = 4
	this.play = true
	this.update = function(time) {
		if (!this.play)
			return;
		this.timeDelta = time - this.prevTime
		this.prevTime = time
		if (isNaN(this.timeDelta)) {
			requestAnimFrame(this.update.bind(this))
			return
		}
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.physics(this.timeDelta)
		this.draw()
		requestAnimFrame(this.update.bind(this))
	}
	this.physics = function(timeDelta) {
		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].physics(timeDelta)
		}
	}

	this.draw = function() {
		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].draw(this.ctx)
		}
	}

	this.addObject = function(name, o) {
		this.objects[name] = o
		this.objects.push(o)
	}
}