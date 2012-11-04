Crafty.sprite(32, "img/dungeon.png", {
	floor : [0, 0],
	wall1 : [2, 1],
	turret1 : [26, 0]
})

Crafty.sprite(32, "img/characters.png", {
	hero1 : [5, 3],
	bullet1 : [4, 7],
	enemy1 : [0, 2]
})

Crafty.c("Player", {
	init : function() {
		
	}
})

Crafty.c("Shooter", {
	init : function() {
		this.rate = 10
		this.bind("EnterFrame", function(e) {
			if (this.firing && e.frame % this.rate == 0) {
				this.shoot()
			}
		})
	},
	shoot : function() {
		var bullet = Crafty.e("2D, Canvas, bullet1, Bullet, Collision").attr({
			x : this.x,
			y : this.y
		}).angleSet(this.fireAngle).onHit("Enemy1",function(hit) {
               hit[0].obj.spawner.destroyEnemy(hit[0].obj);
               this.destroy()
               
        });
        return this
	},
	setRate: function(rate){
		this.rate=rate
		return this
	}
})

Crafty.c("TurretAI", {
	init : function() {
		this.fireRate = 1
	},
	setSpawner: function(spawner){
		this.spawn = spawner
		this.bind("EnterFrame", function() {
			//search for closes bad guy
			var enemies = this.spawn.enemies
			var minDist=99999
			var minEnemy={x: 0, y:0}
			for(var i=0;i<enemies.length;i++){
				var dist = Crafty.math.distance(this.x, this.y, enemies[i].x, enemies[i].y)
				if (dist<minDist){
					minDist = dist
					minEnemy = enemies[i]
				}
			}
			if(minDist!=99999){
				this.firing=true
				this.fireAngle=(Math.atan2(minEnemy.y - this.y, minEnemy.x - this.x))
			}
			else{
				this.firing=false
			}
			//shoot at him
			
		})
		return this
	}
})

Crafty.c("Enemy1", {
	init : function() {
		this.spawner="aaa"
	},
	setTarget : function(target){
		this.target = target
		return this
	},
	setParent : function(spawner){
		this.spawner=spawner
		return this
	}
})

Crafty.c("EnemyAI", {
	init : function() {
		this.target={
			x:0,
			y:0
		}
		this.speed=2
		this.bind("EnterFrame", function() {
			//find player
			//run at him
			this.angle=(Math.atan2(this.target.y - this.y, this.target.x - this.x))
			this.x += Math.cos(this.angle) * this.speed
			this.y += Math.sin(this.angle) * this.speed
		})
	}
})

Crafty.c("EnemySpawner", {
	init : function() {
		this.enemies=[]
	},
	startLevel : function(player, level){
		this.level = level
		this.spawnRate  = 100/level
		this.bind("EnterFrame", function(e){
			if(e.frame%this.spawnRate==0){
				var enemy = Crafty.e("2D, Canvas, enemy1, Enemy1, EnemyAI").attr(this._randLoc()).setTarget(player).setParent(this)
				this.enemies.push(enemy)
			}
		})
		return this
	},
	_randLoc : function(){
		return {x:Crafty.math.randomInt(0,800),y:Crafty.math.randomInt(0,600)}
	},
	destroyEnemy : function(enemy){
		this.enemies.splice(this.enemies.indexOf(enemy),1)
		enemy.destroy()
	}
})

Crafty.c("Bullet", {
	init : function() {
		this.speed = 10
		this.bind("ExitFrame", function(e){
			this.destroy()
		})
	},
	angleSet : function(angle) {
		this.angle = angle
		this.bind("EnterFrame", function(e) {
			this.x += Math.cos(this.angle) * this.speed
			this.y += Math.sin(this.angle) * this.speed
			if (this.x<0 || this.x>800 || this.y<0 || this.y>600){
				this.destroy()
			}
		})

		return this
	}
})

Crafty.scene("main", function() {
	var player = Crafty.e("2D, Canvas, hero1, Fourway, Player, Shooter").attr({
		x : 400,
		y : 300,
		z : 10
	}).fourway(2).origin("center").setRate(4)

	Crafty.addEvent(this, "mousemove", function(e) {
		var pos = Crafty.DOM.translate(e.clientX, e.clientY)
		player.fireAngle = (Math.atan2(pos.y - player._y, pos.x - player._x))
	});

	Crafty.addEvent(this, "mousedown", function(e) {
		player.firing = true
	});

	Crafty.addEvent(this, "mouseup", function(e) {
		player.firing = false
	});

	var turret = Crafty.e("2D, Canvas, turret1, TurretAI, Shooter").attr({
		x : 300,
		y : 200,
		z : 0
	}).origin("center")

	var spawner = Crafty.e("EnemySpawner").startLevel(player, 8)
	
	turret.setSpawner(spawner)

});

Crafty.scene("loading", function() {

	Crafty.load(["img/dungeon.png", "img/characters.png"], function() {
		Crafty.scene("main")
	});

	Crafty.background("#000")

	Crafty.e("2D, DOM, Text").attr({
		w : 640,
		h : 20,
		x : 0,
		y : 120
	}).text("Loading").css({
		"text-align" : "center"
	});

});

Crafty.scene("loading")