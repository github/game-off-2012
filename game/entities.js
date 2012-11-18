function Tile(x, y, w, h) {
    this.hover = false;

    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj(this, 1);

    this.update = function (dt) {
        this.tPos.update(dt);
    };

    this.draw = function (pen) {
        var p = this.tPos;

        pen.fillStyle = "transparent";
        if (this.hover) {
            pen.strokeStyle = "yellow";
        } else {
            pen.strokeStyle = "#123456";
            pen.lineWidth = 2;
        }
        ink.rect(p.x, p.y, p.w, p.h, pen);

        //Strange... but we can't set this during update!
        this.hover = false;
    };

    this.mouseover = function() {
        this.hover = true;
    };

    this.mouseout = function() {
        this.hover = false;
    };

    this.click = function(e) {
        var eng = this.base.rootNode;
        var towerOnTile = findClosest(eng, "Tower", e, 0);
        var pathOnTile = findClosest(eng, "Path", e, 0);

        if (!towerOnTile && !pathOnTile && eng.money - 50 >= 0) {
            eng.money -= 50;
            eng.base.addObject(new Tower(this));
        }
        else if(towerOnTile)
        {
            towerOnTile.tryUpgrade();
        }
    };
}


function Path_End(x, y, w, h) {
    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj(this, 1);

    this.update = function (dt) {
        this.tPos.update(dt);
    };

    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = "grey";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}

function Path_Start(x, y, w, h) {
    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj(this, 1);

    //This is set after we are made
    //this.nextPath

    this.update = function (dt) {
        this.tPos.update(dt);
    };

    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = "yellow";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}


function Path_Line(pathBase) {
    this.path = pathBase;

    //Our shape is a lie! (its off, not that it really matters)
    this.tPos = pathBase.tPos;
    this.base = new baseObj(this, 2);

    this.update = function (dt) {
        this.tPos.update(dt);
    };

    this.draw = function (pen) {
        if (pathBase.nextPath) {
            var t = pathBase.nextPath.tPos.getCenter();
            var direction = new Vector(t.x, t.y);
            direction.sub(pathBase.tPos.getCenter());

            var start = pathBase.tPos.getCenter();
            
            var end = new Vector(start.x, start.y);
            direction.norm().mult(pathBase.tPos.w);
            end.add(direction);

            pen.strokeStyle = "blue";
            ink.arrow(start.x, start.y, end.x, end.y, pen);
        }
    };
}
function Path(x, y, w, h) {
    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj(this, 1);
    this.pathLine = null;

    this.update = function (dt) {
        this.tPos.update(dt);

        var newObjs = [];

        if (this.nextPath && !this.pathLine) {
            this.pathLine = new Path_Line(this);
            newObjs.push(this.pathLine);
        }
        
        return newObjs;
    };

    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = "green";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}

function Tower_Range(baseTower) {
    this.baseTower = baseTower;
    this.tPos = baseTower.tPos;
    this.base = new baseObj(this, 11);

    this.draw = function (pen) {
        var p = this.tPos.getCenter();
        var range = this.baseTower.attr.range;
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

    this.base.addObject(new lifetime(duration));

    this.update = function (dt) {
        this.tPos.update(dt);
    };

    this.draw = function (pen) {
        var p = this.tPos;

        pen.strokeStyle = "purple";
        pen.save();
        pen.lineWidth = 2;
        ink.line(this.xs, this.ys, this.xe, this.ye, pen);
        pen.restore();
    };  
}

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
        coolDown:       Math.random() * 1   + 1,
        mutate:         Math.random() * 1   + 1,
        mutatestrength: Math.random() * 3   + 1,
    };

    this.hover = false;
    
    var laserTime = 0.1;
    var nextFireIn = this.attr.coolDown;
    var mutateCounter = this.attr.mutate;

    this.curTowerRange = new Tower_Range(this);
    this.base.addObject(this.curTowerRange);

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
        if (eng.money >= 100 && this.attr.coolDown >= (2 / 50)) {
            this.damage *= 2;
            this.attr.coolDown /= 2;
            eng.money -= 100;
        }
    }

    this.mutate = function() {
        var a = this.attr;
        
        for (at in a) {
            a[at] += (Math.random() - 0.5) * a.mutatestrength * a[at] * 0.30;
            a[at] = Math.floor(a[at] + 0.5);
        }
        
        if (a.mutatestrength < 1) {
            a.mutatestrength = 1;
        }
        // Make sure towers are at least barely functional
        if (a.range <= 20) {
            a.range = 20;
        }
        if (a.damage <= 1) {
            a.damage = 1;
        }
        if (a.coolDown >= 4) {
            a.range = 80;
        }        
        this.color = "#" + hexPair(255 - a.hp) + hexPair(a.range) + hexPair(a.damage);
    }

    this.attack = function() {
        var target = findClosest(eng, "Bug", this.tPos.getCenter(), this.attr.range + 0.01);        
        if (!target) {
            return;
        }
        
        target.hp -= this.attr.damage;
        
        var cent1 = this.tPos.getCenter();
        var cent2 = target.tPos.getCenter();
        
        return new Tower_Laser(cent1.x, cent1.y, cent2.x, cent2.y, laserTime);        
    }

    this.update = function (dt) {
        mutateCounter -= dt;
        if (mutateCounter < 0) {
            this.mutate();
            mutateCounter = this.attr.mutate;
        }
        
        var newObjs = [];
        nextFireIn -= dt;
        if (nextFireIn < 0) {
            mergeToArray(this.attack(), newObjs);
            nextFireIn = this.attr.coolDown;
        }        

        return newObjs;
    }

    this.curTowerRange = null;

    this.mouseover = function(e) {
        document.getElementById("towerinfo").innerHTML = JSON.stringify(this.attr);
    };

    this.dragged = function(e){
        var eng = this.base.rootNode;
        var curTile = findClosest(eng, "Tile", e, 0);
        if(curTile !== this.baseTile)
        {
            var towerOnCurTile = findClosest(eng, "Tower", e, 0);
            var pathOnCurTile = findClosest(eng, "Path", e, 0);
            if(!towerOnCurTile && !pathOnCurTile)
            {
                var p = curTile.tPos;
                this.baseTile = curTile;
                this.tPos = new temporalPos(p.x, p.y, p.w, p.h, 0, 0); //maybe I shouldn't new it
            }
        }
    };
    
    this.mutate();

}

function Bug(startPath, r) {
    this.maxHP = 20;
    this.hp = this.maxHP;
    this.value = 15;
    this.speed = 20;
    this.color = "yellow";

    var cen = { x: startPath.tPos.x, y: startPath.tPos.y };
    cen.x += Math.floor((startPath.tPos.w - 2*r) * Math.random()) + r;
    cen.y += Math.floor((startPath.tPos.h - 2*r) * Math.random()) + r;

    this.tPos = new temporalPos(cen.x - r, cen.y - r, r * 2, r * 2, this.speed, 0);
    this.base = new baseObj(this, 10);

    this.curPath = startPath;

    this.bugRelPathPos = Math.floor(Math.random()* tileSize) +1;
    this.delay = this.bugRelPathPos+1;

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

        if (this.hp < 0) {
            this.base.destroySelf();
            eng.money += this.value;
        }                        
        this.color = "#" + hexPair(Math.floor(255 -((this.hp / this.maxHP) * 255))) +  "0000";
    };

    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = this.color;
        pen.strokeStyle = "orange";
        pen.lineWidth = 1;
        ink.circ(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, pen);
    };

    this.destroyAtBase = function()
    {
        this.base.destroySelf();        

        eng.health -= 50;

        if (eng.health < 0)
        window.location.reload();
    };
}

function lifetime(timeLeft) {
    //this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj(this);

    var currentTimeLeft = timeLeft;

    this.update = function (dt) {
        currentTimeLeft -= dt;

        if (currentTimeLeft < 0) {
            this.base.parent.base.destroySelf();            
        }
    };

    this.draw = function (pen) {
        return 0;
    };
}
