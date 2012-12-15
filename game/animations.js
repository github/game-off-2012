function MakeLaser(shooter, target, time) {
    var cent1 = shooter.tPos.getCenter();
    var cent2 = target.tPos.getCenter();

    var color = getRealType(shooter) == "Bug" ? "rgba(255,0,0,0)" : "rgba(0,0,255,0)";
    var laserTime = time;

    var line = new Line(cent1, cent2, color, 12);
    line.base.addObject(new AlphaDecay(laserTime, 1, 0));

    this.sound = new Sound("snd/Laser_Shoot.wav");
    this.sound.play();

    return line;
}

function Line(start, end, color, zorder, arrowHeadPercents) {
    this.start = start;
    this.end = end;

    //We do not maintain tPos!
    this.tPos = new TemporalPos(start.x, start.y, end.x - start.x, end.y - start.y, 0, 0);
    this.base = new BaseObj(this, zorder, true);

    //Positions on line we add arrow heads.
    this.arrowHeadPercents = arrowHeadPercents;

    this.color = color;

    this.draw = function (pen) {
        pen.strokeStyle = this.color;
        pen.lineWidth = 2;

        if (!this.color)
            fail("should not happen.");

        var s = this.start;
        var e = this.end;

        ink.line(s.x, s.y, e.x, e.y, pen);

        for (var key in this.arrowHeadPercents) {
            var percent = this.arrowHeadPercents[key];

            var result = new Vector(s.x, s.y);
            var delta = new Vector(e.x, e.y);
            delta.sub(s);
            delta.mult(percent);
            result.add(delta);

            ink.arrowHead(s.x, s.y, result.x, result.y, pen);
        }
    };
}

function PCircle(center, radius, color, fillColor, zorder) {
    this.pCenter = forcePointer(center);
    this.pRadius = forcePointer(radius);
    this.pColor = forcePointer(color);
    this.pFillColor = forcePointer(fillColor);

    this.tPos = {x:0, y:0, h:0, w:0};  //We lie about this because it doesn't matter
    this.base = new BaseObj(this, zorder, true);

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

function Circle(center, radius, color, fillColor, zorder) {    
    this.radius = radius;
    this.color = color;
    this.fillColor = fillColor;

    this.tPos = { x: center.x, y: center.y, h: 0, w: 0 };  //We lie about this because it doesn't matter

    this.base = new BaseObj(this, zorder, true);

    this.lineWidth = 2;

    this.draw = function (pen) {
        var p = this.tPos;
        var radius = this.radius;
        var color = this.color;
        var fillColor = this.fillColor;

        if (radius < 1) radius = 1;

        pen.lineWidth = this.lineWidth;
        pen.fillStyle = fillColor;
        pen.strokeStyle = color;

        ink.circ(p.x, p.y, radius, pen);
    };
}
function AlphaDecay(lifetime, startAlpha, endAlpha) {
    this.base = new BaseObj(this);

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

function AlphaDecayPointer(lifetime, startAlpha, endAlpha, pColor) {
    this.base = new BaseObj(this);

    this.lifetime = lifetime;
    this.startAlpha = startAlpha;
    this.endAlpha = endAlpha;

    this.currentTime = 0;

    this.update = function (dt) {
        this.currentTime += dt;

        var currentAlpha = startAlpha + (endAlpha - startAlpha) * (this.currentTime / this.lifetime);

        pColor.set(setAlpha(pColor.get(), currentAlpha));

        if (this.currentTime > this.lifetime) {
            this.base.parent.base.destroySelf();
        }
    }
}

function TextWrapper(pos, text, zorder) {
    this.tPos = pos;
    this.base = new BaseObj(this, zorder, true);

    this.text = text;
    this.color = "green";
    this.fontSize = 12;
    this.fontType = "Arial";
    this.textAlign = "left";
    this.lineSpacing = 1;

    this.draw = function (pen) {
        pen.fillStyle = this.color;
        pen.font = this.fontSize + "px " + this.fontType;
        pen.textAlign = this.textAlign;

        var pos = this.tPos;

        var lines = getLines(pen, this.text, pos.w);
        var textHeight = this.fontSize * this.lineSpacing;

        var curX = pos.x;
        var curY = pos.y;

        if (this.textAlign == "center") {
            curX += pos.w / 2;
        }

        var realHeightUsed = lines.length * textHeight;
        var heightBuffer = (pos.h - realHeightUsed) / 2 - textHeight * 0.1;
        curY += heightBuffer;

        for (var key in lines) {
            curY += textHeight;
            ink.text(curX, curY, lines[key], pen);
        }
    }
}