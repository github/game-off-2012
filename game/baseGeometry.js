function temporalPos(x, y, w, h, dx, dy) {
    this.x = x;
    this.y = y;

    this.dx = dx;
    this.dy = dy;

    this.w = w;
    this.h = h;

    this.update = function (dt) {
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    };
    this.getCenter = function () {
        return new Vector(this.x + this.w / 2, this.y + this.h / 2 );
    };
    this.boundingBox = function () {
        return this;
    };
}

var Vector = (function() {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    var p = Vector.prototype;
    p.magSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    p.mag = function() {
        return Math.sqrt(this.magSq());
    }
    p.norm = function() {
        var mag = this.mag();
        if (!mag) return this;
        this.x /= mag;
        this.y /= mag;
        return this;
    }
    p.mult = function(mag) {
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
    return Vector;
}());