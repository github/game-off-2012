function Tower_Range(baseTower) {
    this.baseTower = baseTower;
    this.tPos = baseTower.tPos;
    this.base = new baseObj(this, 11);

    this.draw = function (pen) {
        var p = this.baseTower.tPos.getCenter();
        var range = this.baseTower.attr.range;
        if (range < 1) range = 1;
        pen.lineWidth = 2;
        pen.fillStyle = "transparent";
        pen.strokeStyle = this.baseTower.color;
        ink.circ(p.x, p.y, range, pen);
    };
}

function Tower_Laser(xs, ys, xe, ye, duration, buglaser) {
    if (typeof(buglaser) === "undefined") {
	    buglaser = false;
    }

    this.xs = xs;
    this.ys = ys;
    this.xe = xe;
    this.ye = ye;

    this.tPos = new temporalPos(xs, ys, xe - xs, ye - ys, 0, 0);
    this.base = new baseObj(this, 12);

    var timeleft = duration;
    var color = "rgba(255,0,255,1)";
    this.sound = new Sound("snd/Laser_Shoot.wav");
    this.sound.play();

    this.update = function (dt) {
        timeleft -= dt;
        if (timeleft <= 0.00001) {
            this.base.destroySelf();
            return;
        }
	if (buglaser) {
		color = "rgba(255,0,0," + timeleft/duration + ")";
	} else {
		color = "rgba(0,0,255," + timeleft/duration + ")";
	}
    };

    this.draw = function (pen) {
        pen.strokeStyle = color;
        pen.lineWidth = 2;
        ink.line(this.xs, this.ys, this.xe, this.ye, pen);
    };  
}

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
    this.connections = [];

    this.hover = false;
    this.selected = false;
    
    this.targetStrategy = targetStrategies.Closest;

    var laserTime = 0.5;
    var nextFireIn = 1/this.attr.speed;
    var mutateCounter = 1/this.attr.mutate;
    var towerRange = new Tower_Range(this);
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

    this.attack = function() {
        var target = this.targetStrategy(this);
               
        if(!target)
            return;
                
        target.hp -= this.attr.damage;
        this.attr.hitcount += 1;
        
        var cent1 = this.tPos.getCenter();
        var cent2 = target.tPos.getCenter();

        this.base.addObject(new Tower_Laser(cent1.x, cent1.y, cent2.x, cent2.y, laserTime));
    };

    this.update = function (dt) {
        mutateCounter -= dt;
        if (mutateCounter < 0) {
            this.mutate();
            mutateCounter = 1000/this.attr.mutate;
        }
        
        nextFireIn -= dt;
        if (nextFireIn < 0) {
            this.attack();
            nextFireIn = 1/this.attr.speed;
        }
        if (this.attr.hp < 0) {
            this.die();
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

