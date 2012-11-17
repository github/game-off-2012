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

    this.setMag = function (mag) {
        var curMag = Math.sqrt(this.x * this.x + this.y * this.y);
        if (curMag) {
            this.x /= curMag;
            this.y /= curMag;
        }

        this.x *= mag;
        this.y *= mag;
    }

    this.subtract = function (otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
    }
    this.add = function (otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
    }
}