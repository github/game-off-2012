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

function Vector(x, y) {
    this.x = x;
    this.y = y;

    this.magSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    this.mag = function() {
        return Math.sqrt(this.magSq());
    }
    this.norm = function() {
        var mag = this.mag();
        if (!mag) return this;
        this.x /= mag;
        this.y /= mag;
        return this;
    }
    this.mult = function(mag) {
        this.x *= mag;
        this.y *= mag;
        return this;
    }
    this.sub = function (otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
        return this;
    }
    this.add = function (otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
        return this;
    }
}