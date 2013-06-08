function HUD(game, pre) {
	this.game = game
	this.pre = pre || false
	this.score = 0
	this.multiplier = 4
	this.gameOver = false
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
		this.multiplier -= dead
		if (this.multiplier === 0)
			this.gameOver = true
		this.multiplier *= branchState
		this.score += Math.ceil(1 * this.multiplier * timeDelta / 100)
	}
	this.draw = function(ctx) {
		ctx.fillStyle = "#222"
		ctx.font = "16px sans-serif"
		ctx.fillText("Score: " + this.score, 10, 24)
		ctx.fillText("Multiplier: " + this.multiplier, 10, 48)
		if (this.game.objects['spawner'])
			ctx.fillText("Level: " + this.game.objects['spawner'].level, this.game.canvas.width - 100, 24)

		if (this.pre) {
			var b = {
				w : 200,
				h : 200
			}
			ctx.fillRect(canvas.width / 2 - b.w / 2, canvas.height / 2 - b.h / 2, b.w, b.h)
			ctx.fillStyle = "#FFF"
			var fontSize = 20
			ctx.font = fontSize + "px bold sans-serif"
			var x = Math.floor(canvas.width / 2 - 80)
			var y = Math.floor(canvas.height / 2 - fontSize / 2) - 50
			ctx.fillText("Avabranch", x, y)
			var best = localStorage.bestScore || this.score
			ctx.fillText("Best: " + best, x, y + 40)
			ctx.fillText("Tap to start game", x, y + 80)
			ctx.fillText("[Tap] to branch", x, y + 120)
		} else if (this.gameOver) {
			this.game.play = false
			var b = {
				w : 200,
				h : 200
			}
			ctx.fillRect(canvas.width / 2 - b.w / 2, canvas.height / 2 - b.h / 2, b.w, b.h)
			ctx.fillStyle = "#FFF"
			var fontSize = 20
			ctx.font = fontSize + "px bold sans-serif"
			var x = Math.floor(canvas.width / 2 - 80)
			var y = Math.floor(canvas.height / 2 - fontSize / 2) - 50
			ctx.fillText("Game Over", x, y)
			var best = localStorage.bestScore || 0
			if (this.score > best) {
				localStorage.bestScore = this.score
				best = this.score
			}

			ctx.fillText("Score: " + this.score, x, y + 40)
			ctx.fillText("Best: " + best, x, y + 80)
			ctx.fillText("Tap for new game", x, y + 120)
		} else if (this.game.paused) {
			var b = {
				w : 200,
				h : 200
			}
			ctx.fillRect(canvas.width / 2 - b.w / 2, canvas.height / 2 - b.h / 2, b.w, b.h)
			ctx.fillStyle = "#FFF"
			var fontSize = 20
			ctx.font = fontSize + "px bold sans-serif"
			var x = Math.floor(canvas.width / 2 - 150)
			var y = Math.floor(canvas.height / 2 - fontSize / 2) - 50
			ctx.fillText("Paused", x, y)
			ctx.fillText("[p] to resume", x, y + 80)
		} else if (this.game.objects['player']) {
			var player = this.game.objects['player']
			var sX = 10
			var sY = this.game.canvas.height - 50
			//ctx.fillText("controls ", sX, sY)
			sY += 10
			//need list of lines of diff controls, same controls are in list w/color
			var keys = {}
			for (var i = 0; i < player.lines.length; i++) {
				var line = player.lines[i]
				if (line.isDead)
					continue
				var k = line.keys[0]
				if (keys[k]) {
					keys[k].colors.push(line.color)
				} else {
					keys[k] = {
						controls : line.keys,
						colors : [line.color]
					}
				}
			}

			var keyAccess = Object.keys(keys)
            var left = document.getElementById('left-controls')
            var right = document.getElementById('right-controls')
            if(JSON.stringify(lastGlobalControls) !== JSON.stringify(keys)){
                lastGlobalControls = keys
                left.innerHTML=''
                right.innerHTML=''
                    
                for (var i = 0; i < keyAccess.length; i++) {
				    var k = keyAccess[i]
                    if(keyAccess.length===1 && keys[k].controls[1]==='F' && keys[k].controls[0]==='A'){//multi
                        var colors = keys[k].colors
                        var width = Math.floor(1/keys[k].colors.length*100)
                        for(var i =0;i<colors.length;i++){
                            left.innerHTML+='<div class="con multi" style="width:'+width+'%;background-color:'+keys[k].colors[i]+'" id="'+keys[k].controls[0]+'"></div>'
                            right.innerHTML+='<div class="con multi" style="width:'+width+'%;background-color:'+keys[k].colors[i]+'" id="'+keys[k].controls[1]+'"></div>'
                        }
                        
                    } else {
                        var height = Math.floor(1/keyAccess.length*100)
                        left.innerHTML+='<div class="con"\
                            style="height:'+height+'%;background-color:'+keys[k].colors[0]+'"\
                            id="'+keys[k].controls[0]+'"></div>'
                        right.innerHTML+='<div class="con"\
                            style="height:'+height+'%;background-color:'+keys[k].colors[0]+'"\
                            id="'+keys[k].controls[1]+'"></div>'
                    }
                }
                var lefts = Array.apply([],left.getElementsByTagName('div'))
                var rights = Array.apply([],right.getElementsByTagName('div'))
                lefts.concat(rights).forEach(function(el){
                    el.addEventListener('touchstart', function(e){
                        //triggerEvents(this.id.charCodeAt(0))
                        keyState[this.id] = this.id.charCodeAt(0)
                    })
                    el.addEventListener('touchend', function(e){
                        delete keyState[this.id]
                    })
                })
            }
			/*for (var i = 0; i < keyAccess.length; i++) {
				var k = keyAccess[i]

				this.drawKey(ctx, keys[k].controls[0], keys[k].colors, sX, sY)
				sX += 30
				this.drawKey(ctx, keys[k].controls[1], keys[k].colors, sX, sY)
				sX += 30
			}*/
		}
	}

	this.drawKey = function(ctx, key, colors, x, y) {
		var oldFont = ctx.font
		ctx.font="20px monospace"
		var oldFill = ctx.fillStyle
		for (var i = 0; i < colors.length; i++) {
			ctx.fillStyle = colors[i]
			this.coolBlock(ctx, x + i * 26 / colors.length, y, 26 / colors.length, 36)
		}
		ctx.fillStyle = oldFill
		ctx.fillText(key, x + 7 + (key === ';' ? 2 : 0), y + 23)
		ctx.font=oldFont
	}

	this.coolBlock = function(ctx, x, y, width, height) {
		var radius = 5;
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
		ctx.fill();

	}
	keyListeners.push(['enter', function() {
		startGame()
	}.bind(this)])
	this.suspend = function() {
		if (document.webkitHidden && !this.game.paused && this.game.play) {
			this.game.paused = true
			this.game.play = false
			this.game.draw()
		}
	}
	if (!this.pre) {
		keyListeners.push(['p', function() {
			if (!this.game.paused && this.game.play) {
				this.game.paused = true
				this.game.play = false
				this.game.draw()
			} else if (this.game.paused && !this.game.play) {
				this.game.paused = false
				this.game.play = true
				this.game.update()
			}
		}.bind(this)])
		document.addEventListener("webkitvisibilitychange", this.suspend.bind(this), false);
	}
}
