function MakeBugLaser(tower, bug) {
    var cent1 = tower.tPos.getCenter();
    var cent2 = bug.tPos.getCenter();

    var line = new Line(cent1.x, cent1.y, cent2.x, cent2.y, "rgba(255,0,0,0)", 12);
    line.base.addObject(new AlphaDecay(bug.laserTime, 1, 0));

    return line;
}

function MakeTowerLaser(tower, bug) {
    var cent1 = tower.tPos.getCenter();
    var cent2 = bug.tPos.getCenter();

    var line = new Line(cent1.x, cent1.y, cent2.x, cent2.y, "rgba(0,0,255,0)", 12);
    line.base.addObject(new AlphaDecay(tower.laserTime, 1, 0));

    return line;
}

//Should really just break this into its components (line, which is faded and then a sound)
function Line(xs, ys, xe, ye, lasercolor, zorder) {    
    this.xs = xs;
    this.ys = ys;
    this.xe = xe;
    this.ye = ye;

    this.tPos = new temporalPos(xs, ys, xe - xs, ye - ys, 0, 0);    
    this.base = new baseObj(this, zorder);    
    
    this.color = lasercolor;

    this.sound = new Sound("snd/Laser_Shoot.wav");
    this.sound.play();
    
    this.draw = function (pen) {
        pen.strokeStyle = this.color;
        pen.lineWidth = 2;
        ink.line(this.xs, this.ys, this.xe, this.ye, pen);
    };
}

function Circle(center, radius, color, fillColor, zorder) {
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.fillColor = fillColor;

    //this.tPos = {x:0, y:0, h:0, y};  //We lie about this because it doesn't matter
    this.base = new baseObj(this, zorder);    

    this.draw = function (pen) {
        var p = this.center;
        var radius = this.radius;
        var color = this.color;

        if (radius < 1) radius = 1;

        pen.lineWidth = 2;
        pen.fillStyle = this.fillColor;
        pen.strokeStyle = this.color;

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