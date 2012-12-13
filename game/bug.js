function Bug(startPath) {
    this.color = "yellow";
    var r = 8;

    this.attr = {
        //For balancing these need to be the same as the tower
        range:          TowerStats.range,
        damage:         TowerStats.damage,
        hp:             TowerStats.hp,
        currentHp:      TowerStats.currentHp,
        hpRegen:        TowerStats.hpRegen,
        attSpeed:       TowerStats.attSpeed,
        speed:          40,
        hitCount:       0,
        kills:          0,
        value:          5,
    };

    var cen = { x: startPath.tPos.x, y: startPath.tPos.y };
    cen.x += Math.floor((startPath.tPos.w - 2*r) * Math.random()) + r;
    cen.y += Math.floor((startPath.tPos.h - 2*r) * Math.random()) + r;

    this.tPos = new TemporalPos(cen.x - r, cen.y - r, r * 2, r * 2, this.attr.speed, 0);
    this.base = new BaseObj(this, 10);

    this.self = new Circle(cen, r, "blue", "black", 10);
    this.base.addObject(this.self);

    this.genes = new Genes();
    this.base.addObject(this.genes);

    //this.attr.target_Strategy = new targetStrategies.Closest();
    this.attr.attack_types = [];
    //this.attr.attack_types.push(new allAttackTypes.Bullet());

    this.base.addObject(new AttackCycle());

    this.base.addObject(new Selectable());

    this.curPath = startPath;

    this.added = function() {
        var game = getGame(this);

        this.bugRelPathPos = Math.floor(Math.random() * game.tileSize) +1;
        this.delay = this.bugRelPathPos + 1;

        this.constantOne = 1;
        this.base.addObject(new UpdateTicker(this, "constantOne", "regenTick"));
    };
    
    this.regenTick = function()
    {
        if(this.attr.hpRegen > 0)
            this.attr.currentHp += this.attr.hpRegen;
        if(this.attr.currentHp > this.attr.hp)
            this.attr.currentHp = this.attr.hp;
    }

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
        

        this.color = getInnerColorFromAttrs(this.attr);

        this.self.tPos.x = this.tPos.getCenter().x;
        this.self.tPos.y = this.tPos.getCenter().y;

        this.self.fillColor = getInnerColorFromAttrs(this.attr);
        this.self.color = getOuterColorFromAttrs(this.attr);

        //this.color = "#" + hexPair(Math.floor(255 -((this.attr.currentHp / this.attr.hp) * 255))) +  "0000";
    };

    this.destroyAtBase = function() {
        var game = this.base.rootNode.game;
        var eng = this.base.rootNode;
        game.health -= 5;

        if (game.health <= 0 && !eng.base.allLengths.GameOver) {
            eng.base.addObject(new GameOver());
        }

        this.base.destroySelf();
    };
}