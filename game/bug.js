function Bug(startPath) {
    var r = 8;
    var cen = (function() {
        var p = startPath.tPos;
        var cen = p.center();
        cen.x += Math.floor((p.w - 2*r) * (Math.random() - 0.5));
        cen.y += Math.floor((p.h - 2*r) * (Math.random() - 0.5));
        return cen;
    }());

    this.attr = {};
    this.setBaseAttrs = function () {
        //Lol, prevCur...
        var prevCurHp = this.attr.hp || this.attr.currentHp;
        if(!prevCurHp)
            prevCurHp = 0;
        this.attr = {
            // For balancing these are now 0, we get everything from our alleles
            // (except speed, as we have to move, and value).
            // In the future tower will be like this.
            range:          0,
            damage:         0,
            hp:             0,
            currentHp:      0,
            hpRegen:        0,
            attSpeed:       0,
            speed:          0,
            hitCount:       0,
            kills:          0,
            value:          5,
        };
        this.attr.attack_types = [];
    }
    this.setBaseAttrs();

    this.tPos = new TemporalPos(cen.x - r, cen.y - r, r * 2, r * 2, this.attr.speed, 0);
    this.base = new BaseObj(this, 11);

    //Will be replaced
    this.color = "yellow";
    this.borderColor =  "red";

    this.lineWidth = 1;
    this.radius = r;


    this.genes = new Genes();
    this.base.addObject(this.genes);



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
    
    this.regenTick = function() {
        if (this.attr.hpRegen > 0) {
            this.attr.currentHp += this.attr.hpRegen;
        }
        if (this.attr.currentHp > this.attr.hp) {
            this.attr.currentHp = this.attr.hp;
        }
    }

    this.update = function(dt) {
        this.tPos.update(dt);

        var cur = this.curPath;
        var next = this.curPath.nextPath;

        //Move towards the next rectangle.
        var vecToCurrent = minVecBetweenRects(this.tPos, cur.tPos);        
        var vecToNext = minVecFullOverlapRects(this.tPos, next.tPos);

        var overshot = vecToCurrent.magSq() > 0 && vecToNext.magSq() > 0;

        if (overshot)
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
        this.borderColor = getOuterColorFromAttrs(this.attr);
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

    this.draw = function(pen) {
        var pos = this.tPos;
        var cen = pos.center();

        var hpPercent = this.attr.currentHp / this.attr.hp;
        var hue = hpPercent * 135;

        DRAW.arc(pen, cen, this.radius + this.lineWidth,
            0, Math.PI * 2 * hpPercent,
            new HSLColor().h(hue).s(50).l(50).a(0).str(), 3,
            new HSLColor().h(hue).s(90).l(60).a(1).str());

        DRAW.circle(pen, cen, this.radius,
                    this.color, 1, this.borderColor);

        DRAW.circle(pen, cen, this.attr.range,
                    setAlpha(this.color, 0.13));
    }
}