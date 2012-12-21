function Tower_Packet(t1, t2, speed, allele) {
    this.base = new BaseObj(this, 12);
    // We don't really need it
    this.tpos = new TemporalPos(0, 0, 1, 1, 0, 0);
    var p1 = getRectCenter(t1.tPos);
    var p2 = getRectCenter(t2.tPos);
    
    var dis = p1.clone().sub(p2).mag();
    
    var packet = new Circle(p1, 3, allele.getOuterColor(), allele.getInnerColor(), 15);
    packet.lineWidth = 1;
    
    var motionDelay = new MotionDelay(p1, p2, dis / speed, apply);
    this.base.addObject(packet);
    packet.base.addObject(motionDelay);
    
    var that = this;
    function apply() {
        t2.genes.addAllele(allele);
        that.base.destroySelf();
    }
}

//Should probably use a Line to draw itself instead of doing it by itself
function Tower_Connection(t1, t2) {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this, 11);

    // Those fucking random numbers passed as the last argument? Those are positions along the line where arrows are drawn. Probably. I can't be sure.
    // What does 11 mean? Fuck if I know.
    //Spending some time looking at the constructor would be wise. The 11 is the zorder
    //(this is something that is done all over the place), and the numbers are the percentages
    //at which arrowheads are drawn).
    var line = new Line(t1.tPos.getCenter(), t2.tPos.getCenter(), "rgba(0, 255, 0, 0.2)", 11, {1: 0.1, 2: 0.3, 3: 0.5, 4: 0.7, 5: 0.9});
    this.base.addObject(line);
    
    var prevhitCount;
    var deleteButton;
    
    var that = this;
    
    function addDeleteButton() {
        var delta = t2.tPos.getCenter();
        delta.sub(t1.tPos.getCenter());
        delta.mult(1/2);
        
        var pos = t2.tPos.getCenter();
        pos.sub(delta);
        pos.w = 20;
        pos.h = 20;
        pos.sub(new Vector(pos.w * 0.5, pos.h * 0.5));
        pos = new TemporalPos(pos.x, pos.y, pos.w, pos.h);
        
        deleteButton = new Button("-", bind(that, "deleteSelf"), 50).resize(pos);
        
        that.base.addObject(deleteButton);
    }
    addDeleteButton();
    
    function dataTransfer(t1, t2) {
        function sendRandomPacket(t1, t2, speed) {
            var group = pickRandomKey(t1.genes.alleles);
            var al = t1.genes.alleles[group];

            that.base.addObject(new Tower_Packet(t1, t2, speed, al));
        }

        if (prevhitCount === undefined) {
            prevhitCount = t1.attr.kills;
            return;
        }
        
        var dis = cloneObject(t1.tPos.getCenter());
        dis.sub(t2.tPos.getCenter());
        dis = dis.mag() / 1000;

        var speed = Math.max(Math.min(t1.attr.upload, t2.attr.download) / dis, 0.00000001 /* should really be zero */);
        var killsRequired = 10 / speed;
        var killDelta = t1.attr.kills - prevhitCount;
        
        while (Math.floor(killDelta / killsRequired) > 0) {
            sendRandomPacket(t1, t2, speed);
            prevhitCount += killsRequired;
            killDelta = t1.attr.kills - prevhitCount;
        }
        prevhitCount = t1.attr.kills - killDelta;
    }
    
    this.deleteSelf = function() {
        var conns = this.base.parent.connections;

        for(var key in conns) {
            if(conns[key] == this) {
                conns.splice(key, 1);
                break;
            }
        }

        this.base.destroySelf();
    }

    this.update = function(dt) {
        dataTransfer(t1, t2);

        deleteButton.hidden = !this.base.parent.hover;

        // Wtf... setColorPart() should not be a thing.
        if (this.base.parent.hover) {
            line.color = setColorPart(line.color, 3, 0.9);            
        } else {
            line.color = setColorPart(line.color, 3, 0.2);
        }
    }
}

TowerStats = {
        range:          0,
        damage:         0,
        hp:             0,
        currentHp:      0,
        hpRegen:        1,
        attSpeed:       0,
        upload:         5,
        download:       5,
        hitCount:       0,
        kills:          0,
        value:          50,
    };

function Tower(baseTile, tPos) {    
    this.baseTile = baseTile;
    var p = tPos;
    this.tPos = new Rect(p.x, p.y, p.w, p.h);//new TemporalPos(p.x, p.y, p.w, p.h, 0, 0);
    this.base = new BaseObj(this, 10);

    this.attr = {};
    this.setBaseAttrs = function () {
        //Lol, prevCur...
        var prevCurHp = this.attr.hp || this.attr.currentHp;
        if(!prevCurHp)
            prevCurHp = 0;
        this.attr = {
            range:          TowerStats.range,
            damage:         TowerStats.damage,
            hp:             TowerStats.hp,
            currentHp:      TowerStats.currentHp,
            hpRegen:        TowerStats.hpRegen,
            attSpeed:       TowerStats.attSpeed,
            upload:         TowerStats.upload,
            download:       TowerStats.download,
            hitCount:       TowerStats.hitCount,
            kills:          0,
            value:          TowerStats.value,
        };
        this.attr.target_Strategy = new targetStrategies.Closest();
        this.attr.attack_types = [];
    };
    this.setBaseAttrs();

    //List of alleles
    this.allelesGenerated = [];

    this.genes = new Genes();
    this.base.addObject(this.genes);

    //For alleles.
    this.autoTrash = true;

    this.connections = [];

    this.base.addObject(new AttackCycle());
    //this.base.addObject(new UpdateTicker(this.attr, "mutate", "mutate", true));
    this.base.addObject(new Selectable());
    
    this.constantOne = 1;
    this.base.addObject(new UpdateTicker(this, "constantOne", "regenTick"));

    for (var alGroup in TowerAlleles) {
        if (!this.genes.alleles[alGroup]) {
            this.genes.addAllele(new Allele(alGroup, TowerAlleles[alGroup]()));
        }
    }

    this.added = function () {
        this.recalculateAppearance();
    }

    this.generateAllele = function() {
        var genAllGroup = pickRandomKey(AllAlleleGroups);

        var alleleGenerated = new Allele(genAllGroup, AllAlleleGroups[genAllGroup]());
        this.allelesGenerated.push(alleleGenerated);
    }

    this.regenTick = function()
    {
        if(this.attr.hpRegen > 0)
            this.attr.currentHp += this.attr.hpRegen;
        if(this.attr.currentHp > this.attr.hp)
            this.attr.currentHp = this.attr.hp;
    }

    this.update = function(dt) {
        this.recalculateAppearance(true);


    }

    //This may also change x, y, w and h.
    this.recalculateAppearance = function (changeSize) {
        this.color = getInnerColorFromAttrs(this.attr);
        this.borderColor = getOuterColorFromAttrs(this.attr);

        //Shows HP
        var outerWidth = Math.pow(this.attr.hp / 50, 0.9);

        //Show HP regen?
        var innerWidth = Math.pow(this.attr.hpRegen * 10, 0.9);

        var center = this.tPos.getCenter();

        var totalWidth = outerWidth + innerWidth;

        if(changeSize) {
            this.tPos.x = center.x - totalWidth;
            this.tPos.y = center.y - totalWidth;

            this.tPos.w = totalWidth * 2;
            this.tPos.h = totalWidth * 2;
        }

        this.lineWidth = outerWidth;
    }

    this.draw = function (pen) {
        var pos = this.tPos;
        var cen = pos.getCenter();

        DRAW.rect(pen, pos,
                  this.color,
                  this.lineWidth, this.borderColor);

        DRAW.circle(pen, cen, this.attr.range,
            setAlpha(this.color, 0.1));

        drawAttributes(this, pen);
    };

    this.tryUpgrade = function () {
        var game = getGame(this);

        if (game.money >= 100) {
            this.attr.damage *= 2;
            this.attr.attSpeed *= 2;
            game.money -= 100;
        }
    };
    
    this.die = function() {
        var c = this.connections;
        for (var i = 0; i < c.length; i++) {
            c[i].base.destroySelf();
        }
        new Sound("snd/Tower_Die.wav").play();
    };

    this.mutate = function() {
        function invalid(attr) {
            // NaN
            if (attr != attr) return true;
            if (attr == Infinity) return true;
            if (attr == -Infinity) return true;
            return false
        }
        
        //a and at are too small for proper variable names
        var a = this.attr;
        
        for (at in a) {
            if(typeof a[at] != "number")
                continue;
            //Seriously... WTF. This code used to mean if you did:
            //attr.daf += 1 it causes the object to be deleted.
            if (invalid(a[at])) {
                if(a[at] < 0) {
                    this.die();
                } else {
                    fail("Invalid attribute in attr of object (you likely have a typo).");
                }
            }
            if (at == "hitCount") continue;
            if (at == "mutate" || at == "mutatestrength") {
                // Avoid exponetial increase in all tower stats if mutate mutation was calculated just like all the other values.
                a[at] += (Math.random() - 0.5) * a.mutatestrength / 500;
            } else {
                a[at] += (Math.random() - 0.5) * a.mutatestrength / 500 * a[at];
            }
        }
        
        if (a.range < 1) {
            a.range = 1;
        }
        
        this.recolor();
    };
    
    this.mouseover = function(e) {
        // Only required because of issue #29
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].hover = true;
        }
    };
    
    this.mouseout = function(e) {
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].hover = false;
        }
    };

    this.startDrag = null;
    var tempIndicator = null;
    this.mousedown = function(e) {
        this.startDrag = e;
        tempIndicator = new Line(this.startDrag, e, "green", 15, {0: 1.0});
        this.base.addObject(tempIndicator);
        getGame(this).input.globalMouseMove[this.base.id] = this;
        getGame(this).input.globalMouseUp[this.base.id] = this;
    };

    this.mousemove = function(e)
    {
        var eng = getEng(this);

        tempIndicator.end = e;
        var towerSelected = findClosestToPoint(eng, "Tower", e, 0);
        var tileSelected = findClosestToPoint(eng, "Tile", e, 0);
        var path = findClosestToPoint(eng, "Path", e, 0);
        if(!towerSelected && tileSelected && !path)
        {
            this.tPos.x = e.x;
            this.tPos.y = e.y;
        }
    }

    this.mouseup = function(e){
        var eng = this.base.rootNode;
        var game = eng.game;

        if(tempIndicator)
            this.base.removeObject(tempIndicator);

        this.startDrag = null;

        /*
        var towerSelected = findClosestToPoint(eng, "Tower", e, 0);
        if(towerSelected && towerSelected != this)
        {
            for (var i = 0; i < this.connections.length; i++)
                if(this.connections[i].t2 == towerSelected)
                    return;
            
            var conn = new Tower_Connection(this, towerSelected);
            this.base.addObject(conn);
            this.connections.push(conn);
            towerSelected.connections.push(conn);

            game.changeSel(this);
            getAnElement(this.base.children.Selectable).ignoreNext = true;
        }
        */

        delete getGame(this).input.globalMouseMove[this.base.id];
        delete getGame(this).input.globalMouseUp[this.base.id];
    };
}

function canPlace(tower, pos, eng) {
    var game = eng.game;

    var originalPosX = tower.tPos.x;
    var originalPosY = tower.tPos.y;

    tower.recalculateAppearance(true);
    tower.tPos.x = pos.x;
    tower.tPos.y = pos.y;

    var towerRadius = tower.tPos.w / 2;

    var e = pos;
    var towerCollision = findClosestToRect(eng, "Tower", tower.tPos, 0);
    var pathOnTile = findClosestToPoint(eng, "Path", e, 0);
    var tileExist = findClosestToPoint(eng, "Tile", e, 0);

    tower.tPos.x = originalPosX;
    tower.tPos.y = originalPosY;

    if (!towerCollision && !pathOnTile && tileExist) {
        return true;
    }
    return false;
}

function tryPlaceTower(tower, pos, eng)
{
    var game = eng.game;

    tower.recalculateAppearance(true);
    tower.tPos.x = pos.x;
    tower.tPos.y = pos.y;

    var tileExist = findClosestToPoint(eng, "Tile", pos, 0);

    if (canPlace(tower, pos, eng)) {
        eng.base.addObject(tower);
        game.changeSel(tower);
        tower.value = game.currentCost;
        getAnElement(tileExist.base.children.Selectable).ignoreNext = true;
        return true;
    }
    return false;
};