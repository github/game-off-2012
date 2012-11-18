function BlockSpawner(game, speed, level) {
	this.game = game
	this.blocks = []
	this.speed = speed || 4
	this.clearCount = 200
	this.level = level || 1
	this.draw = function(ctx) {
		for (var i = 0; i < this.blocks.length; i++) {
			this.blocks[i].draw(ctx)
		}
	}
	this.physics = function(timeDelta) {
		if (this.blocks.length >= this.clearCount) {
			for (var i = this.blocks.length - 1; i >= 0; i--) {
				if (this.blocks[i].y > canvas.height) {
					this.blocks.splice(0, i)
					break
				}
			}
		}
		/* spawning algo
		 * level 1 block spawn chance = 1.5/100
		 * level increases by .5/100 chance for each level
		 * block size is random between 10x100 and 100x10
		 *
		 */
		if (Math.random() * 100 > 100 - this.level / 2 - 1) {
			var x = Math.random() * canvas.width
			var w = Math.random() * 90 + 10
			var h = Math.random() * 90 + 10
			var y = -h
			this.blocks.push(new Block(x, y, w, h, this.speed))
		}

		for (var i = 0; i < this.blocks.length; i++) {
			this.blocks[i].physics(timeDelta)
		}
	}
}

function Block(x, y, w, h, speed) {
	this.x = x || 0
	this.y = y || 0
	this.w = w || 20
	this.h = h || 20
	this.speed = speed || 4
	this.draw = function(ctx) {
		ctx.fillStyle = "#323232"
		ctx.fillRect(this.x, this.y, this.w, this.h)
	}
	this.physics = function(timeDelta) {
		this.y += this.speed * timeDelta * .05
	}
}
