function Line(game, color, x, y, r, keys, xSpeed, ySpeed) {
	this.game = game
	this.x = x || canvas.width / 2
	this.y = y || canvas.height / 2
	this.r = r || 5
	this.color = color || "#E67373"
	this.points = []
	this.keys = keys || ['A', 'S']
	this.clearCount = 200
	this.tarX = -1
	this.tarXRate = -1
	this.tarXTime = 0
	this.speed = xSpeed || 4
	this.ySpeed = ySpeed || 4
	this.isDead = false
	this.physics = function(timeDelta) {
		if (this.points.length >= this.clearCount) {
			for (var i = this.points.length - 1; i >= 0; i--) {
				if (this.points[i].y > canvas.height+this.r*2) {
					this.points.splice(0, i)
					break
				}
			}
		}
		for (var i = 0; i < this.points.length; i++) {
			this.points[i].y += .05 * timeDelta * this.ySpeed
		}
		if (this.tarX == -1) {
			if (keyState[this.keys[0]]) {//left
				this.x -= this.speed * timeDelta * .05
			} else if (keyState[this.keys[1]]) {//right
				this.x += this.speed * timeDelta * .05
			}
		} else {
			if (this.tarXRate == -1) {
				this.tarXTime = 20
				var dist = Math.abs(this.x - this.tarX)
				this.tarXRate = dist / this.tarXTime
			}
			this.x += this.tarXRate * (this.x < this.tarX ? 1 : -1)
			this.tarXTime -= 1
			if (this.tarXTime <= 0) {
				this.x = this.tarX
				this.tarX = -1
				this.tarXRate = -1
			}
		}
		if (!this.isDead) {
			this.points.push({
				y : this.y,
				x : this.x,
				r : this.r,
				color : this.color
			})
		}
		
		

		//check collision
		if (game.objects["spawner"] && !this.isDead) {
			if (this.x - this.r < 0 || this.x + this.r > canvas.width) {
				this.isDead = true
				return
			}
			var blocks = game.objects["spawner"].blocks
			for (var i = 0; i < blocks.length; i++) {
				var o = this
				var b = blocks[i]
				var y1 = o.y - o.r
				var h1 = o.r * 2
				var y2 = b.y
				var h2 = b.h
				var x1 = o.x - o.r
				var w1 = o.r * 2
				var x2 = b.x
				var w2 = b.w
				if (y1 + h1 < y2 || y1 > y2 + h2 || x1 + w1 < x2 || x1 > x2 + w2)
					continue;
				this.isDead = true
				break
			}
		}

	}
	this.draw = function(ctx) {
		var tail = this.points[0]
		if(!tail)
			return
			
		
		ctx.beginPath();
		ctx.lineWidth=tail.r*2
		ctx.lineCap='round'
		ctx.moveTo(tail.x,tail.y);
		ctx.strokeStyle = tail.color
		
		
		for (var i = 1; i < this.points.length; i++) {
			var point = this.points[i]
			ctx.lineTo(point.x,point.y)
			//ctx.beginPath();
			//ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2, true);
			//ctx.closePath();
		}
		ctx.stroke();
		ctx.closePath()
		
	}
}