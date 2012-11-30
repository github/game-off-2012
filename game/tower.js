function Tower_Packet(t1, t2, group, allele) {
    this.base = new BaseObj(this, 12);
    // We don't really need it
    this.tpos = new TemporalPos(0, 0, 1, 1, 0, 0);
    var p1 = getRectCenter(t1.tPos);
    var p2 = getRectCenter(t2.tPos);
    var dis = p1.clone().sub(p2).mag();
    var packet = new Circle(p1, 2, "yellow", "yellow", 15);
    var motionDelay = new MotionDelay(p1, p2, dis / 10, apply);
    this.base.addObject(packet);
    packet.base.addObject(motionDelay);
    
    var that = this;
    function apply() {
        t2.genes.addAllele(group, allele);
        that.base.destroySelf();
    }
}

//Should probably use a Line to draw itself instead of doing it by itself
function Tower_Connection(t1, t2) {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this, 11);
    this.hover = false;

    var line = new Line(t1.tPos.getCenter(), t2.tPos.getCenter(), "rgba(0, 255, 0, 0.2)", 11, {1: 1.0});
    this.base.addObject(line);

    t1.prevhitCount = t1.attr.hitCount;
    t2.prevhitCount = t2.attr.hitCount;
    
    var that = this;
    function dataTransfer(t1, t2) {
        function sendRandomPacket(t1, t2) {
            var groups = [];
            for (var group in AllAlleleGroups)
                groups.push(group);

            var group = pickRandom(groups);
            var al = t1.genes.alleles[group];

            that.base.addObject(new Tower_Packet(t1, t2, group, al));
        }

        if (t1.prevhitCount === undefined) {
            t1.prevhitCount = t1.attr.hitCount;
            return;
        }
        var killDelta = t1.attr.hitCount - t1.prevhitCount;
        while (Math.floor(killDelta / 1) > 0) {
            sendRandomPacket(t1, t2);
            t1.prevhitCount += 10;
            killDelta = t1.attr.hitCount - t1.prevhitCount;
        }
        t1.prevhitCount = t1.attr.hitCount - killDelta;
    }
    
    this.update = function(dt) {
        dataTransfer(t1, t2);
        dataTransfer(t2, t1);
        
        if (this.hover) {
            line.color = setColorPart(line.color, 3, 0.9);
        } else {
            line.color = setColorPart(line.color, 3, 0.2);
        }
        var cost = 1 * dt;
        if (ENG.money < cost) {
            this.base.destroySelf();
        } else {
            ENG.money -= cost;
        }
    }
}

TowerStats = {
        range:          100,
        damage:         10,
        hp:             100,
        currentHp:      100,
        hpRegen:        1,
        attSpeed:       0.6,
        upload:         1,
        download:       1,
        hitCount:       0,
        kills:          0,
        value:          50,
    };

function Tower(baseTile) {
    var p = baseTile ? baseTile.tPos : {x: 0, y: 0, w : TILE_SIZE, h: TILE_SIZE};
    this.baseTile = baseTile;
    this.tPos = new TemporalPos(p.x, p.y, p.w, p.h, 0, 0);
    this.base = new BaseObj(this, 10);
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
        value:          TowerStats.value,
    };    

    //Each is an {group: alGroup, all: allele}
    this.allelesGenerated = [];

    this.genes = new Genes();
    this.base.addObject(this.genes);

    this.attr.target_Strategy = new targetStrategies.Closest();
    this.attr.attack_types = [];
    this.attr.attack_types.push(new allAttackTypes.Laser());

    this.connections = [];

    this.base.addObject(new AttackCycle());
    //this.base.addObject(new UpdateTicker(this.attr, "mutate", "mutate", true));
    this.base.addObject(new Selectable());
    
    this.constantOne = 1;
    this.base.addObject(new UpdateTicker(this, "constantOne", "regenTick"));

    for (var alGroup in AllAlleleGroups) {
        if (!this.genes.alleles[alGroup]) {
            this.genes.addAllele(alGroup, new Allele(AllAlleleGroups[alGroup]()));
        }
    }

    this.added = function() {
        this.recolor();        
    };
        
    this.generateAllele = function()
    {   
        var allAlls = [];
        for (var alGroup in AllAlleleGroups)
            allAlls.push(alGroup);

        var genAllGroup = pickRandom(allAlls);

        var allObj = {};
        allObj.group = genAllGroup;
        allObj.all = new Allele(AllAlleleGroups[genAllGroup]());
        this.allelesGenerated.push(allObj);
    }

    this.regenTick = function()
    {
        if(this.attr.hpRegen > 0)
            this.attr.currentHp += this.attr.hpRegen;
        if(this.attr.currentHp > this.attr.hp)
            this.attr.currentHp = this.attr.hp;
    }

    this.update = function()
    {
        this.color = this.rColor.str();
    }

    this.draw = function (pen) {
        var p = this.tPos;
        pen.save();
        pen.fillStyle = this.rColor.str();
        pen.strokeStyle = "lightblue";
        ink.rect(p.x, p.y, p.w, p.h, pen);        
        pen.restore();

        drawAttributes(this, pen);
    };

    // WTF - yeah man, this code is the bomb
    this.tryUpgrade = function () {
        if (ENG.money >= 100) {
            this.attr.damage *= 2;
            this.attr.attSpeed *= 2;
            ENG.money -= 100;
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
    
    this.rColor = new Color();
    this.recolor = function() {
        var a = this.attr;
        this.rColor = this.rColor.r(255 - a.currentHp).g(a.range).b(a.damage).a(0.5);
    }

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
    this.tempIndicator = null;
    this.mousedown = function(e) {
        this.startDrag = e;
        tempIndicator = new Line(this.startDrag, e, "green", 15, {0: 1.0});
        this.base.addObject(tempIndicator);
        this.base.rootNode.globalMouseMove[this.base.id] = this;
    };

    this.mousemove = function(e)
    {
        tempIndicator.end = e;
    }

    this.dragEnd = function(e){
        this.base.removeObject(tempIndicator);
        this.startDrag = null;

        var towerSelected = findClosest(this.base.rootNode, "Tower", e, 0);
        if(towerSelected && towerSelected != this)
        {
            if (ENG.money < 50) return;
            ENG.money -= 50;
            var conn = new Tower_Connection(this, towerSelected);
            this.base.addObject(conn);
            this.connections.push(conn);
            towerSelected.connections.push(conn);
        }
    };
}

function tryPlaceTower(tower, tile)
{
    var ENG = tile.base.rootNode;
    var e = tile.tPos.getCenter();
    var towerOnTile = findClosest(ENG, "Tower", e, 0);
    var pathOnTile = findClosest(ENG, "Path", e, 0);

    var curCost = tile.base.rootNode.currentCost;

    if (!towerOnTile && !pathOnTile && ENG.money - curCost >= 0) {
        ENG.money -= curCost;   

        tile.base.rootNode.currentCost *= 2;

        tower.tPos = tile.tPos;         
        ENG.base.addObject(tower);
        ENG.changeSel(tower);
        getAnElement(tile.base.children.Selectable).ignoreNext = true;
    }
};