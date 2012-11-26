function Bug(startPath, difficulty) {
    this.maxHP = Math.floor(20 * 3 * difficulty);
    this.hp = this.maxHP;
    this.value = Math.floor(5 * (1 + (difficulty / 16)));
    this.speed = 20; //Math.floor(20 * difficulty);
    this.color = "yellow";
    var r = 4;


    var sound = new Sound("snd/die.wav");

    var cen = { x: startPath.tPos.x, y: startPath.tPos.y };
    cen.x += Math.floor((startPath.tPos.w - 2*r) * Math.random()) + r;
    cen.y += Math.floor((startPath.tPos.h - 2*r) * Math.random()) + r;

    this.tPos = new temporalPos(cen.x - r, cen.y - r, r * 2, r * 2, this.speed, 0);
    this.base = new baseObj(this, 10);


    this.attr = {
        range:          100,
        damage:         1 + difficulty/4,
        hp:             Math.floor(20 * 3 * difficulty),
        attSpeed:       2,
        hitcount:       0,
    };

    this.attr.target_Strategy = new targetStrategies.Closest();
    this.attr.attack_type = new attackTypes.Normal();

    this.base.addObject(new AttackCycle());

    this.base.addObject(new Mortality());

    this.base.addObject(new Selectable());

    this.curPath = startPath;

    this.bugRelPathPos = Math.floor(Math.random()* tileSize) +1;
    this.delay = this.bugRelPathPos + 1;
    this.laserTime = 0.5;

    this.update = function (dt) {
        this.tPos.update(dt);

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
                     
        this.color = "#" + hexPair(Math.floor(255 -((this.attr.hp / this.maxHP) * 255))) +  "0000";
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
