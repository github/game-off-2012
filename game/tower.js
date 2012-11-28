
//Should probably use a Line to draw itself instead of doing it by itself
function Tower_Connection(t1, t2) {
    var p1 = getRectCenter(t1.tPos);
    var p2 = getRectCenter(t2.tPos);
    this.tPos = new temporalPos(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y, 0, 0);
    this.base = new baseObj(this, 11);
    this.hover = false;
    var color = "rgba(0, 255, 0, 0.2)";
    
    this.update = function(dt) {
        var a1 = t1.attr;
        var a2 = t2.attr;
        // Should have same properties; a1 vs a2 for loop should not matter.
        for (at in a1) {
            if (a1[at] > a2[at]) {
                a2[at] += Math.min(a1[at] - a2[at], a1.download/10, a2.upload/10, a2[at]) * dt;
            } else if (a1[at] < a2[at]) {
                a1[at] += Math.min(a2[at] - a1[at], a1.upload/10, a2.download/10, a1[at]) * dt;
            }
        }
        if (this.hover) {
            color = "rgba(0, 255, 0, 0.9)";
        } else {
            color = "rgba(0, 255, 0, 0.2)";
        }
        var cost = 1 * dt;
        if (eng.money < cost) {
            this.base.destroySelf();
        } else {
            eng.money -= cost;
        }
    }
    
    this.draw = function(pen) {
        var p = this.tPos;
        pen.strokeStyle = color;
        pen.lineWidth = 2;
        ink.line(p1.x, p1.y, p2.x, p2.y, pen);
    }
}

TowerStats = {
        range:          100,
        damage:         1,
        hp:             10,
        attSpeed:       1,        
        mutate:         0,
        mutatestrength: 0,
        upload:         1,
        download:       1,
        hitcount:       0,
        value:          50,
    };

//All mutate stuff is copy-pasta from our mother project (for now)
function Tower(baseTile) {
    var p = baseTile ? baseTile.tPos : {x: 0, y: 0, w : tileSize, h: tileSize};
    this.baseTile = baseTile;
    this.tPos = new temporalPos(p.x, p.y, p.w, p.h, 0, 0);
    this.base = new baseObj(this, 10);
    this.attr = {
        range:          TowerStats.range,
        damage:         TowerStats.damage,
        hp:             TowerStats.hp,
        attSpeed:       TowerStats.attSpeed,
        mutate:         TowerStats.mutate,
        mutatestrength: TowerStats.mutatestrength,
        upload:         TowerStats.upload,
        download:       TowerStats.download,
        hitcount:       TowerStats.hitcount,
        value:          TowerStats.value,
    };

    this.genes = new Genes();
    this.base.addObject(this.genes);

    this.attr.target_Strategy = new targetStrategies.Closest();
    this.attr.attack_types = [];
    this.attr.attack_types.push(new allAttackTypes.Normal());

    this.connections = [];

    this.base.addObject(new AttackCycle());
    //this.base.addObject(new UpdateTicker(this.attr, "mutate", "mutate", true));
    this.base.addObject(new Selectable());
    
    this.added = function() {        
        // Yes, this is supposed to be here.
        this.recolor();        
    };


    //Hackish way to check if we are from breeder
    if(baseTile)
    {
        var fillChance = 0.5;
        for(var alGroup in AllAlleleGroups)
        {
            if(Math.random() < fillChance)
            {
                this.genes.addAllele(alGroup, new Allele(AllAlleleGroups[alGroup]()));
            }
        }
    }


    this.draw = function (pen) {
        var p = this.tPos;
        pen.save();
        pen.fillStyle = this.color;
        pen.strokeStyle = "lightblue";
        ink.rect(p.x, p.y, p.w, p.h, pen);        
        pen.restore();

        drawAttributes(this, pen);
    };

    // WTF - yeah man, this code is the bomb
    this.tryUpgrade = function () {
        if (eng.money >= 100) {
            this.attr.damage *= 2;
            this.attr.attSpeed *= 2;
            eng.money -= 100;
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
            if (invalid(a[at]))
            {
                if(a[at] < 0)
                    this.die();
                else
                    fail("Invalid attribute in attr of object (you likely have a typo).");
            }
            if (at == "hitcount") continue;
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
    
    this.recolor = function() {
        function rgba(r, g, b, a) {
            function color(n) {
                return Math.round(n);
            }
            return "rgba(" + color(r) + "," + color(g) + "," + color(b) + "," + Math.round(a * 100) / 100 + ")";
        }
        var a = this.attr;
        this.color = rgba(255 - a.hp, a.range, a.damage, 0.5);

        if(a.damage < 1)
            this.color = "blue";
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
        tempIndicator = new Line(this.startDrag, e, "green", 15);
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
            if (eng.money < 50) return;
            eng.money -= 50;
            var conn = new Tower_Connection(this, towerSelected);
            this.base.addObject(conn);
            this.connections.push(conn);
            towerSelected.connections.push(conn);
        }
    };
}

function tryPlaceTower(tower, tile)
{
    var eng = tile.base.rootNode;
    var e = tile.tPos.getCenter();
    var towerOnTile = findClosest(eng, "Tower", e, 0);
    var pathOnTile = findClosest(eng, "Path", e, 0);

    if (!towerOnTile && !pathOnTile && eng.money - tower.attr.value >= 0) {
        eng.money -= tower.attr.value;   
        tower.tPos = tile.tPos;         
        eng.base.addObject(tower);
        eng.changeSel(tower);
        getAnElement(tile.base.children.Selectable).ignoreNext = true;
    }
};