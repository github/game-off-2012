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
	this.clearGone = function(){
		for (var i = this.points.length - 1; i >= 0; i--) {
				if (this.points[i].y > canvas.height+this.r*2) {
					this.points.splice(0, i)
					break
				}
			}
	}
	this.revive=function(){
		var lines = this.game.objects['player'].lines
		for(var i=lines.length-1;i>=0;i--){
			if(!lines[i].isDead){
				this.x=lines[i].x+lines[i].r*2
				break
			}
		}
		
		this.isDead=false
	}
	this.physics = function(timeDelta) {
		if (this.points.length >= this.clearCount) {
			this.clearGone()
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
				if(collideRoundSquare(this,blocks[i])){
					this.isDead = true
					break
				}
			}
			var powerups = game.objects['power_spawn'].powerups
			for(var i =0;i<powerups.length;i++){
				if(!powerups[i].isDead && collideRoundRound(this,powerups[i])){
					powerups[i].act()
					powerups[i].isDead=true
					break
				}
			}
		}

	}
	this.draw = function(ctx) {
		var tail = this.points[0]
		var head = this.points[this.points.length-1]
		if(!tail || !head)
			return

		ctx.beginPath();
		ctx.lineWidth=head.r*2
		ctx.lineCap='round'
		ctx.lineJoin='round'
		ctx.moveTo(tail.x,tail.y);
		ctx.strokeStyle = tail.color
		
		for (var i = 1; i < this.points.length; i++) {
			var point = this.points[i]
			ctx.lineTo(point.x,point.y)
		}
		ctx.stroke();
		ctx.closePath()
		
	}
}