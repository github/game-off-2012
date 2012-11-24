function Bug(startPath, difficulty) {
    this.maxHP = Math.floor(20 * 3 * difficulty);
    this.hp = this.maxHP;
    this.value = Math.floor(5 * (1 + (difficulty / 16)));
    this.speed = 20; //Math.floor(20 * difficulty);
    this.color = "yellow";
    var r = 4;

    var sound = new Audio("snd/die.wav");

    var cen = { x: startPath.tPos.x, y: startPath.tPos.y };
    cen.x += Math.floor((startPath.tPos.w - 2*r) * Math.random()) + r;
    cen.y += Math.floor((startPath.tPos.h - 2*r) * Math.random()) + r;

    this.tPos = new temporalPos(cen.x - r, cen.y - r, r * 2, r * 2, this.speed, 0);
    this.base = new baseObj(this, 10);

    this.curPath = startPath;

    this.bugRelPathPos = Math.floor(Math.random()* tileSize) +1;
    this.delay = this.bugRelPathPos+1;
    var laserTime = 0.5;
    var cooldownfull = (Math.random() * 2) + 2;
    var cooldown = cooldownfull;
    var damage = Math.random() * 3;

    this.attack = function () {
	if (cooldown < 0) {
		var target = findClosest(eng, "Tower", this.tPos.getCenter(), 100);        
		if (!target) {
			return;
		}
		target.attr.hp -= damage;
		
		var cent1 = this.tPos.getCenter();
		var cent2 = target.tPos.getCenter();

		this.base.addObject(new Tower_Laser(cent1.x, cent1.y, cent2.x, cent2.y, laserTime, true));
		cooldown = cooldownfull;
	}
    }

    this.update = function (dt) {
        this.tPos.update(dt);
	cooldown -= dt;

        var cur = this.curPath;
        var next = this.curPath.nextPath;

        //Move towards the next rectangle.
        var vecToNext = minVecFullOverlapRects(this.tPos, next.tPos);
        if (this.delay > this.bugRelPathPos) {
            vecToNext.norm().mult(this.speed);
            this.tPos.dx = vecToNext.x;
            this.tPos.dy = vecToNext.y;            
            this.delay = 0;
        }

        //Once we reach our destination.
        if (vecToNext.magSq() == 0) {            
            this.delay += 50*dt;
            if (this.delay > this.bugRelPathPos) {
                this.curPath = next;
            }


            if (next instanceof Path_End) {
                this.destroyAtBase();
            }
        }

        if (this.hp < 0) {
	    sound.play();
            this.base.destroySelf();
            eng.money += this.value;
        }                        
        this.color = "#" + hexPair(Math.floor(255 -((this.hp / this.maxHP) * 255))) +  "0000";

	this.attack();
    };

    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = this.color;
        pen.strokeStyle = "orange";
        pen.lineWidth = 1;
        ink.circ(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, pen);
    };

    this.destroyAtBase = function() {
        this.base.destroySelf();        

        eng.health -= 5;

        if (eng.health < 0) {
            window.location.reload();
        }
    };
}
