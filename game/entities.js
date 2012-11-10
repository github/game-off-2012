function Tile(x, y, w, h) {
    this.hover = false;

    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj("Tile", 2);

    this.update = function (dt) {
        this.tPos.update(dt);
        
        if (this.base)
            return this.base.update(dt);
    };

    this.draw = function (pen) {        
        var p = this.tPos;
        
        pen.fillStyle = "transparent";
        if (this.hover) {
            pen.strokeStyle = "yellow";
        } else {
            pen.strokeStyle = "white";
        }
        ink.rect(p.x, p.y, p.w, p.h, pen);

        if(this.base)
            this.base.draw(pen);

        //Strange... but we can't set this during update!
        this.hover = false;
    };
}

function Path(x, y, w, h, end) {
    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj("Path", 1);

    this.end = end;

    this.update = function (dt) {
        this.tPos.update(dt);

        if (end) {
            //Okay this is kinda a hack, approximating a square with a circle :(
            var creepsAtBase = findAllWithin(eng, "Bug", this.tPos.getCenter(), this.tPos.w * 0.6);

            for (var i = 0; i < creepsAtBase.length; i++) {
                creepsAtBase[i].base.destroySelf = true;
                eng.health -= 50;

                if(eng.health < 0)
                    window.location.reload();
            }
        }

        if (this.base)
            return this.base.update(dt);
    };

    this.draw = function (pen) {
        var p = this.tPos;
        if (end)
            pen.fillStyle = "blue";
        else
            pen.fillStyle = "green";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);

        if(this.base)
            this.base.draw(pen);
    };
}

function Tower_Range(x, y, w, h) {
    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj("Tower_Range", 11);

    this.update = function (dt) {
        this.tPos.update(dt);

        if(this.base)
            return this.base.update(dt);
    };

    this.draw = function (pen) {
        var p = this.tPos;
        pen.lineWidth = 2;
        pen.fillStyle = "transparent";
        pen.strokeStyle = "blue";
        ink.circ(p.x + w / 2, p.y + h / 2, w / 2, pen);

        if(this.base)
            this.base.draw(pen);
    };
}

function Tower_Laser(xs, ys, xe, ye, duration) {
    this.tPos = new temporalPos(xs, ys, xe - xs, ye - ys, 0, 0);
    this.base = new baseObj("Tower_Laser", 12);

    this.base.addObject(new lifetime(duration));

    this.update = function (dt) {
        this.tPos.update(dt);

        if (this.base)
            return this.base.update(dt);
    };

    this.draw = function (pen) {
        var p = this.tPos;

        pen.strokeStyle = "purple";
        pen.save();
        pen.lineWidth = 5;
        ink.line(p.x, p.y, p.x + p.w, p.y + p.h, pen);
        pen.restore();

        if (this.base)
            this.base.draw(pen);
    };
}

function Tower(x, y, w, h) {
    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj("Tower", 10);

    this.range = 112;
    this.damage = 150;
    this.coolDown = 1;
    this.nextFireIn = this.coolDown;
    this.laserTime = 0.1;

    this.draw = function (pen) {
        var p = this.tPos;
        pen.save();
        pen.fillStyle = "blue";
        pen.strokeStyle = "lightblue";
        ink.rect(p.x, p.y, p.w, p.h, pen);
        pen.restore();

        if (this.base)
            this.base.draw(pen);
    };

    this.update = function (dt) {
        var newObjs = [];

        this.nextFireIn -= dt;

        if (this.nextFireIn < 0) {
            var searchBug = findClosest(eng, "Bug", this.tPos.getCenter(), this.range + 0.01);
            if (searchBug) {
                searchBug.hp -= this.damage;

                var cent1 = this.tPos.getCenter();
                var cent2 = searchBug.tPos.getCenter();

                newObjs.push(new Tower_Laser(cent1.x, cent1.y, cent2.x, cent2.y, this.laserTime));

                this.nextFireIn = this.coolDown;
            }            
        }

        if (this.base)
            newObjs = merge(newObjs, this.base.update(dt));

        return newObjs;
    }
}

function Bug(x, y, r) {        
    this.hp = 100;
    this.value = 15;
    this.speed = 20;

    this.base = new baseObj("Bug", 10);

    this.tPos = new temporalPos(x - r, y - r, r * 2, r * 2, this.speed, 0);

    this.update = function (dt) {
        this.tPos.update(dt);

        if(this.hp < 0)
        {            
            this.base.destroySelf = true;

            eng.money += this.value;
        }

        if (this.base)
            return this.base.update(dt);
    };
    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = "yellow";
        pen.strokeStyle = "orange";
        pen.save();
        pen.lineWidth = 1;
        ink.circ(p.x, p.y, p.w, pen);
        pen.restore();

        if (this.base)
            this.base.draw(pen);
    };
}

function lifetime(timeLeft) {
    //this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj("lifetime");

    var currentTimeLeft = timeLeft;

    this.update = function (dt) {
        currentTimeLeft -= dt;

        if (currentTimeLeft < 0) {
            this.base.parent.destroySelf = true;
            this.base.destroySelf = true;
        }

        return 0;
    };

    this.draw = function (pen) {
        return 0;
    };
}