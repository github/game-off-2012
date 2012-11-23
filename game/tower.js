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

function Tower_Laser(xs, ys, xe, ye, duration) {
    this.xs = xs;
    this.ys = ys;
    this.xe = xe;
    this.ye = ye;

    this.tPos = new temporalPos(xs, ys, xe - xs, ye - ys, 0, 0);
    this.base = new baseObj(this, 12);

    var timeleft = duration;
    var color = "rgba(255,0,255,1)";
    this.sound = new Audio("snd/Laser_Shoot.wav");
    this.sound.play();

    this.update = function (dt) {
        timeleft -= dt;
        if (timeleft <= 0.00001) {
            this.base.destroySelf();
            return;
        }
        color = "rgba(255,0,255," + timeleft/duration + ")";
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
    this.hover = true;
    var color = "rgba(0, 0, 255, 0.1)";
    
    this.update = function(dt) {
        var a1 = t1.attr;
        var a2 = t2.attr;
        // Should have same properties; a1 vs a2 for loop should not matter.
        for (at in a1) {
            if (a1[at] > a2[at]) {
                a2[at] += (a1[at] - a2[at]) * Math.min(Math.min(a1.download, a2.upload), 1) * dt;
            } else if (a1[at] < a2[at]) {
                a1[at] += (a2[at] - a1[at]) * Math.min(Math.min(a1.upload, a2.download), 1) * dt;
            }
        }
        if (this.hover) {
            color = "rgba(0, 0, 255, 0.9)";
        } else {
            color = "rgba(0, 0, 255, 0.1)";
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
        mutate:         Math.random() * 1   + 1,
        mutatestrength: Math.random() * 1   + 1,
        upload:         Math.random(),
        download:       Math.random(),
        hitcount:       0,
    };
    this.connections = [];

    this.hover = false;
    this.selected = false;
    
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
        this.hover = false;
    };

    // WTF - yeah man, this code is the bomb
    this.tryUpgrade = function () {
        if (eng.money >= 100 ) {
            this.attr.damage *= 2;
	    this.attr.speed *= 2;
            //this.attr.coolDown /= 2;
            eng.money -= 100;
        }
    };

    this.mutate = function() {
        var a = this.attr;
        
        for (at in a) {
            if (at != "hitcount" && at != "coolDown") {
                a[at] += (Math.random() - 0.5) * a.mutatestrength * a[at] * 0.30;
            }
        }
        
        if (a.mutatestrength < 1) {
            a.mutatestrength = 1;
        }
        if (a.range < 1) {
            a.range = 1;
        }
        // Make sure towers are at least barely functional
/*        if (a.range <= 20) {
            a.range = 20;
        }
        if (a.damage <= 1) {
            a.damage = 1;
        }
        if (a.coolDown >= 4) {
            a.range = 80;
        }   */     
        this.color = "#" + hexPair(255 - a.hp) + hexPair(a.range) + hexPair(a.damage);
    };

    this.attack = function() {
        var target = findClosest(eng, "Bug", this.tPos.getCenter(), this.attr.range + 0.01);        
        if (!target) {
            return;
        }
        
        target.hp -= this.attr.damage;
        this.attr.hitcount += 1;
        
        var cent1 = this.tPos.getCenter();
        var cent2 = target.tPos.getCenter();


        
        return new Tower_Laser(cent1.x, cent1.y, cent2.x, cent2.y, laserTime);
    };

    this.update = function (dt) {
        mutateCounter -= dt;
        if (mutateCounter < 0) {
            this.mutate();
            mutateCounter = 1/this.attr.mutate;
        }
        
        var newObjs = [];
        nextFireIn -= dt;
        if (nextFireIn < 0) {
            mergeToArray(this.attack(), newObjs);
            nextFireIn = 1/this.attr.speed;
        }        

        return newObjs;
    };

    this.mouseover = function(e) {
        // Only required because of issue #29
        if (!added) {
            document.getElementById("towerinfo").innerHTML = JSON.stringify(this.attr);
            this.base.addObject(towerRange);
            //this.base.addObject(tooltip);
            added = true;
        }
    };
    
    this.mouseout = function(e) {
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
        this.base.addObject(new Tower_Connection(this, dst));
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

