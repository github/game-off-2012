function Bug(startPath, difficulty) {
    this.maxHP = Math.floor(20 * 3 * difficulty);
    this.hp = this.maxHP;
    this.value = Math.floor(5 * (1 + (difficulty / 16)));
    //this.speed = 20; //Math.floor(20 * difficulty);
    this.color = "yellow";
    var r = 8;

    this.attr = {
        range:          100,
        damage:         (1 + difficulty/4) * 0.25,
        hp:             Math.floor(20 * 3 * difficulty),
        currentHp:     Math.floor(20 * 3 * difficulty),
        hpRegen:       0.1,
        attSpeed:       1,
        speed:          20,
        hitcount:       0,
        value:          5,
    };

    var cen = { x: startPath.tPos.x, y: startPath.tPos.y };
    cen.x += Math.floor((startPath.tPos.w - 2*r) * Math.random()) + r;
    cen.y += Math.floor((startPath.tPos.h - 2*r) * Math.random()) + r;

    this.tPos = new TemporalPos(cen.x - r, cen.y - r, r * 2, r * 2, this.attr.speed, 0);
    this.base = new BaseObj(this, 10);

    this.genes = new Genes();
    this.base.addObject(this.genes);

    this.attr.target_Strategy = new targetStrategies.Closest();
    this.attr.attack_types = [];
    this.attr.attack_types.push(new allAttackTypes.Bullet());

    this.base.addObject(new AttackCycle());

    this.base.addObject(new Selectable());

    this.curPath = startPath;

    this.bugRelPathPos = Math.floor(Math.random()* tileSize) +1;
    this.delay = this.bugRelPathPos + 1;

    this.update = function (dt) {
        this.tPos.update(dt);

        var cur = this.curPath;
        var next = this.curPath.nextPath;

        //Move towards the next rectangle.
        var vecToCurrent = minVecBetweenRects(this.tPos, cur.tPos);        
        var vecToNext = minVecFullOverlapRects(this.tPos, next.tPos);

        var overshot = vecToCurrent.magSq() > 0 && vecToNext.magSq() > 0;

        if(overshot)
            this.tPos.update(-dt);

        if (this.delay > this.bugRelPathPos) {
            this.tPos.dx = vecToNext.x;
            this.tPos.dy = vecToNext.y;            
            this.delay = 0;
        }

        //Once we reach our destination.
        if (vecToNext.magSq() == 0 || overshot) {            
            this.delay += 50*dt;
            if (this.delay > this.bugRelPathPos || overshot) {
                this.curPath = next;
                this.delay = this.bugRelPathPos + 1;
            }

            if (next instanceof Path_End) {
                this.destroyAtBase();
            }
        }
         
         this.tPos.setSpeed(this.attr.speed);
                     
        this.color = "#" + hexPair(Math.floor(255 -((this.attr.currentHp / this.attr.hp) * 255))) +  "0000";
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