function temporalPos(x, y, w, h, dx, dy) {
    this.x = x;
    this.y = y;

    this.dx = dx;
    this.dy = dy;

    this.w = w;
    this.h = h;

    if (w < 0) {
        this.x += w;
        this.w = -w;
    }
    if (h < 0) {
        this.y += h;
        this.h = -h;
    }

    this.update = function (dt) {
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    };
    this.getCenter = function () {
        return new Vector(this.x + this.w / 2, this.y + this.h / 2 );
    };

    this.setSpeed = function (speed) {
        var initialSpeedSq = this.dx * this.dx + this.dy * this.dy;

        if (initialSpeedSq == 0 || speed == 0) {
            this.dx = 0;
            this.dy = 0;
        }
        else {
            this.dx *= Math.sqrt((speed * speed) / initialSpeedSq);
            this.dy *= Math.sqrt((speed * speed) / initialSpeedSq);
        }
    };
}

var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    // We use prototype here because assigning
    // all of these functions in the constructor
    // is (realatively) extremely slow, given the
    // massive number of Vectors that are constructed
    // all over the code.
    var p = Vector.prototype;
    p.magSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    p.mag = function () {
        return Math.sqrt(this.magSq());
    }
    p.norm = function () {
        var mag = this.mag();
        if (!mag) return this;
        this.x /= mag;
        this.y /= mag;
        return this;
    }
    p.mult = function (mag) {
        this.x *= mag;
        this.y *= mag;
        return this;
    }
    p.sub = function (otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
        return this;
    }
    p.add = function (otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
        return this;
    }
    p.setMag = function (magnitude) {
        this.norm().mult(magnitude);
    }
    return Vector;
} ());
