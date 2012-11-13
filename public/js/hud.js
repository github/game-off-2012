function HUD(game) {
	this.game = game
	this.score = 0
	this.multiplier = 4
	this.gameOver = false
	this.draw = function(ctx) {

	}
	this.physics = function(timeDelta) {
		var player = this.game.objects["player"]
		var lines = player.lines
		var branchState = player.branchStates[player.branchState]
		var dead = 0
		this.multiplier = 4
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].isDead)
				dead += 1
		}
		switch(dead) {
			case 0 :
				this.multiplier -= 0;
				break
			case 1 :
				this.multiplier -= 1;
				break
			case 2 :
				this.multiplier -= 2;
				break
			case 3 :
				this.multiplier -= 3;
				break
			case 4 :
				this.multiplier -= 4;
				this.gameOver = true;
				break
		}
		this.multiplier *= branchState
		this.score += Math.ceil(1 * this.multiplier * timeDelta / 100)
	}
	this.draw = function(ctx) {
		ctx.fillStyle = "#111"
		ctx.font = "16px sans-serif"
		ctx.fillText("Score: " + this.score, 10, 20)
		ctx.fillText("Multiplier: " + this.multiplier, 10, 40)
		if(this.game.objects['spawner'])
			ctx.fillText("Level: " + this.game.objects['spawner'].level, 10, 60)
		if (this.gameOver) {
			this.game.play = false
			var b = {
				w : 400,
				h : 400
			}
			ctx.fillRect(canvas.width / 2 - b.w / 2, canvas.height / 2 - b.h / 2, b.w, b.h)
			ctx.fillStyle = "#FFF"
			var fontSize = 30
			ctx.font = fontSize + "px bold sans-serif"
			var x = Math.floor(canvas.width / 2 - 150)
			var y = Math.floor(canvas.height / 2 - fontSize / 2)-50
			ctx.fillText("Game Over", x, y)
			ctx.fillText("Score: "+this.score, x, y+80)
			ctx.fillText("[Enter] for new game", x, y+180)
		}
		else if (this.game.paused){
			var b = {
				w : 400,
				h : 400
			}
			ctx.fillRect(canvas.width / 2 - b.w / 2, canvas.height / 2 - b.h / 2, b.w, b.h)
			ctx.fillStyle = "#FFF"
			var fontSize = 30
			ctx.font = fontSize + "px bold sans-serif"
			var x = Math.floor(canvas.width / 2 - 150)
			var y = Math.floor(canvas.height / 2 - fontSize / 2)-50
			ctx.fillText("Paused", x, y)
			ctx.fillText("[p] to resume", x, y+80)
		}
	}
	keyListeners.push(['enter', function() {
		init()
	}.bind(this)])
	keyListeners.push(['p', function() {
		if(!this.game.paused && this.game.play){
			this.game.paused=true
			this.game.play=false
			this.game.draw()
		}
		else if(this.game.paused && !this.game.play){
			this.game.paused=false
			this.game.play=true
			this.game.update()
		}
	}.bind(this)])
	this.suspend=function(){
		if(document.webkitHidden && !this.game.paused && this.game.play){
			this.game.paused=true
			this.game.play=false
			this.game.draw()
		}
	}
	document.addEventListener("webkitvisibilitychange", this.suspend.bind(this), false);
}
