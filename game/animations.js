function MakeBugLaser(tower, bug) {
    var cent1 = tower.tPos.getCenter();
    var cent2 = bug.tPos.getCenter();

    var line = new Line(cent1, cent2, "rgba(255,0,0,0)", 12);
    line.base.addObject(new AlphaDecay(bug.laserTime, 1, 0));

    this.sound = new Sound("snd/Laser_Shoot.wav");
    this.sound.play();

    return line;
}

function MakeTowerLaser(tower, bug) {
    var cent1 = tower.tPos.getCenter();
    var cent2 = bug.tPos.getCenter();

    var line = new Line(cent1, cent2, "rgba(0,0,255,0)", 12);
    line.base.addObject(new AlphaDecay(tower.laserTime, 1, 0));

    this.sound = new Sound("snd/Laser_Shoot.wav");
    this.sound.play();

    return line;
}

function Line(start, end, color, zorder) {
    this.pStart = forcePointer(start);
    this.pEnd = forcePointer(end);

    //We do not maintain tPos!
    this.tPos = new temporalPos(start.x, start.y, end.x - start.x, end.y - start.y, 0, 0);
    this.base = new baseObj(this, zorder);

    this.color = color;

    this.draw = function (pen) {
        pen.strokeStyle = this.color;
        pen.lineWidth = 2;

        var s = this.pStart.get();
        var e = this.pEnd.get();

        ink.line(s.x, s.y, e.x, e.y, pen);
    };
}

function Circle(center, radius, color, fillColor, zorder) {
    this.pCenter = forcePointer(center);
    this.pRadius = forcePointer(radius);
    this.pColor = forcePointer(color);
    this.pFillColor = forcePointer(fillColor);

    this.tPos = {x:0, y:0, h:0, w:0};  //We lie about this because it doesn't matter
    this.base = new baseObj(this, zorder);    

    this.draw = function (pen) {
        var p = this.pCenter.get();
        var radius = this.pRadius.get();
        var color = this.pColor.get();
        var fillColor = this.pFillColor.get();

        if (radius < 1) radius = 1;

        pen.lineWidth = 2;
        pen.fillStyle = fillColor;
        pen.strokeStyle = color;

        ink.circ(p.x, p.y, radius, pen);
    };
}

function AlphaDecay(lifetime, startAlpha, endAlpha) {
    this.base = new baseObj(this);

    this.lifetime = lifetime;
    this.startAlpha = startAlpha;
    this.endAlpha = endAlpha;

    this.currentTime = 0;

    this.update = function (dt) {
        this.currentTime += dt;

        var currentAlpha = startAlpha + (endAlpha - startAlpha) * (this.currentTime / this.lifetime);

        this.base.parent.color = setAlpha(this.base.parent.color, currentAlpha);

        if (this.currentTime > this.lifetime) {
            this.base.parent.base.destroySelf();
        }
    }
}