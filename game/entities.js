function Tile(x, y, w, h) {
    this.hover = false;

    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj("Tile", -1);

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
            pen.strokeStyle = "black";
        }
        ink.rect(p.x, p.y, p.w, p.h, pen);

        if(this.base)
            this.base.draw(pen);
    };
}

function Path(x, y, w, h) {
    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj("Path");

    this.update = function (dt) {
        this.tPos.update(dt);

        if(this.base)
            return this.base.update(dt);
    };

    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = "green";
        pen.strokeStyle = "green";
        ink.rect(p.x, p.y, p.w, p.h, pen);

        if(this.base)
            this.base.draw(pen);
    };
}

function Tower_Range(x, y, w, h) {
    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj("Tower_Range", 1);

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
    this.base = new baseObj("Tower_Laser", 2);

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
    this.base = new baseObj("Tower");

    this.range = 112;
    this.damage = 150;
    this.nextFire = 0;
    this.coolDown = 1000;
    this.laserTime = 50;

    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = "red";
        pen.strokeStyle = "red";
        ink.rect(p.x, p.y, p.w, p.h, pen);

        if(this.base)
            this.base.draw(pen);
    };

    this.update = function (dt) {
        var newObjs = [];

        if (this.nextFire < new Date().getTime()) {
            var searchBug = findClosest(eng, "Bug", this.tPos.getCenter(), this.range + 0.01);
            if (searchBug) {
                this.nextFire += this.coolDown;
                searchBug.hp -= this.damage;

                var cent1 = this.tPos.getCenter();
                var cent2 = searchBug.tPos.getCenter();

                newObjs.push(new Tower_Laser(cent1.x, cent1.y, cent2.x, cent2.y,
                            new Date().getTime(), this.laserTime, this.id++));
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
    this.speed = 10;

    this.base = new baseObj("Bug", 1);

    this.tPos = new temporalPos(x - r, y - r, r * 2, r * 2, this.speed, 0);

    this.update = function (dt) {
        this.tPos.update(dt);

        if(this.health < 0)
        {
            this.destroySelf = true;
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
        currentTimeLeft -= timeLeft;

        if (currentTimeLeft < 0)
            this.parent.destroySelf = true;

        this.destroySelf = true;

        return 0;
    };

    this.draw = function (pen) {
        return 0;
    };
}