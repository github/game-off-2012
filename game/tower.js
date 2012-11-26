
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

// FRIGGIN UGLY, waiting for mouseup fix...
//Don't wait, the time is now (fix it yourself, I am busy).
var towerDragStartMouseDown;
//All mutate stuff is copy-pasta from our mother project (for now)
function Tower(baseTile) {
    var p = baseTile.tPos;
    this.baseTile = baseTile;
    this.tPos = new temporalPos(p.x, p.y, p.w, p.h, 0, 0);
    this.base = new baseObj(this, 10);
    this.attr = {
        range:          Math.random() * 200 + 100,
        damage:         Math.random() * 30  + 1,
        hp:             Math.random() * 100 + 10,
        speed:          Math.random() * 1   + 1,        
        mutate:         Math.random() * 50,
        mutatestrength: Math.random() * 50,
        upload:         Math.random() * 50,
        download:       Math.random() * 50,
        hitcount:       0,
    };

    this.attr.target_Strategy = new targetStrategies.Closest();
    this.attr.attack_type = new attackTypes.Normal();

    this.connections = [];

    this.base.addObject(new AttackCycle());

    this.base.addObject(new UpdateTicker(this.attr, "mutate", "mutate", true));

    this.base.addObject(new Mortality());

    this.hover = false;
    this.selected = false;

    this.laserTime = 0.5;

    //Why are these local?

    var towerRange = new Circle(this.tPos.getCenter(), this.attr.range, this.color, "transparent", 11);
    //var tooltip = new ToolTip(this, this.attr);
    var added = false;
    
    this.draw = function (pen) {
        var p = this.tPos;
        pen.save();
        pen.fillStyle = this.color;
        pen.strokeStyle = "lightblue";
        ink.rect(p.x, p.y, p.w, p.h, pen);        
        pen.restore();
    };

    // WTF - yeah man, this code is the bomb
    this.tryUpgrade = function () {
        if (eng.money >= 100) {
            this.attr.damage *= 2;
            this.attr.speed *= 2;
            eng.money -= 100;
        }
    };
    
    this.die = function() {
        this.base.destroySelf();
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
        
        var a = this.attr;
        
        for (at in a) {
            if(typeof a[at] != "number")
                continue;
            if (invalid(a[at])) this.die();
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
        this.color = rgba(255 - a.hp, a.range, a.damage, 0.5)
    }

    this.update = function (dt) {        
        //Hmm... I wish hooking up values with other values was built into the
        //language (like pointers... but fitting both the case of constants and stuff).
        if(added) {
            towerRange.radius = this.attr.range;
            towerRange.color = this.color;
        }
    };

    this.click = function() {
        this.tryUpgrade();
    };

    this.mouseover = function(e) {
        // Only required because of issue #29
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].hover = true;
        }
        if (!added) {
            this.base.addObject(towerRange);
            //this.base.addObject(tooltip);
            this.base.rootNode.changeSel(this);
            added = true;
        }
    };
    
    this.mouseout = function(e) {
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].hover = false;
        }
        if (added) {
            this.base.removeObject(towerRange);
            //this.base.removeObject(tooltip);
            added = false;
        }
    };
    
    this.mousedown = function(e) {
        towerDragStartMouseDown = this;
        this.selected = true;
    };
    
    this.mouseup = function(e) {
        var dst = towerDragStartMouseDown;
        console.log("mouseup event! Found tower: ", this, dst, this == dst);
        if (!dst) return;
        if (eng.money < 50) return;
        eng.money -= 50;
        var conn = new Tower_Connection(this, dst);
        this.base.addObject(conn);
        this.connections.push(conn);
        dst.connections.push(conn);
    };
/*    this.dragged = function(e){
        var eng = this.base.rootNode;
        var dst = findClosest(eng, "Tower", e, 0);
        var curTile = findClosest(eng, "Tile", e, 0);
        if (curTile !== this.baseTile) {
            var towerOnCurTile = findClosest(eng, "Tower", e, 0);
            var pathOnCurTile = findClosest(eng, "Path", e, 0);
            if (!towerOnCurTile && !pathOnCurTile) {
                var p = curTile.tPos;
                this.baseTile = curTile;
                this.tPos = new temporalPos(p.x, p.y, p.w, p.h, 0, 0); //maybe I shouldn't new it
            }
        }
    };*/
    // Yes, this is supposed to be here.
    this.mutate();
}

