function Player(game, x, y, speed, ySpeed) {
	this.game = game
	this.speed = speed || 4
	this.ySpeed = ySpeed || 4
	this.lineCount = 4
	this.lineRadius = 10
	this.x = x || canvas.width / 2 - this.lineRadius * this.lineCount
	this.y = y || canvas.height - canvas.height / 3
	this.colors = ["#E67373", "ECEC85", "#9DE970", "#708EE9"]//red, yellow, green, blue
	//this.keys=[['A','S'],['D','F'],['J','K'],['L',';']]
	this.branchState = 0
	this.branchStates = [1, 2, 4]
	this.keyMaps = {
		1 : [['A', 'F'], ['A', 'F'], ['A', 'F'], ['A', 'F']],
		2 : [['A', 'F'], ['A', 'F'], ['J', ';'], ['J', ';']],
		4 : [['A', 'S'], ['D', 'F'], ['J', 'K'], ['L', ';']]
	}
	this.lines = []
	for (var i = 0; i < this.lineCount; i++) {
		this.lines.push(new Line(this.game, this.colors[i], this.x + i * this.lineRadius * 2, this.y, this.lineRadius, this.keyMaps[this.branchStates[this.branchState]][i], this.speed, this.ySpeed))
	}

	this.physics = function(timeDelta) {
		this.lines.sort(function(a,b){
			if(a.isDead)
				return 1
			if(a.isDead && b.isDead)
				return 0
			return -1
		})
		var dead = 0
		for (var i = 0; i < this.lines.length; i++) {
			var line = this.lines[i]
			if(line.isDead){
				dead+=1
			}
		}
		if(dead==2){
			if(this.branchState>1)
				this.branchState=1
			this.branchStates=[1,4]
		}
		if(dead==3){
			if(this.branchState>0)
				this.branchState=0
			this.branchStates=[1]
		}
		for (var i = 0; i < this.lines.length; i++) {
			var line = this.lines[i]
			line.keys = this.keyMaps[this.branchStates[this.branchState]][i]
			line.physics(timeDelta)
		}
	}

	this.draw = function(ctx) {
		for (var i = 0; i < this.lines.length; i++) {
			var line = this.lines[i]
			line.draw(ctx)
		}
	}
	keyListeners.push([' ', function() {
		this.branchState += 1
		this.branchState = this.branchState % this.branchStates.length
		if (this.branchState == 0) {//bring pieces back together
			var sum = 0
			var cnt=0
			for (var i = 0; i < this.lines.length; i++) {
				var line = this.lines[i]
				if(!line.isDead){
					sum += line.x
					cnt+=1
				}
			}
			var avg = sum / cnt
			for (var i = 0; i < this.lines.length; i++) {
				var line = this.lines[i]
				if(!line.isDead){
					line.tarX = i * line.r * 2 + avg
				}
			}
		}

	}.bind(this)])
}