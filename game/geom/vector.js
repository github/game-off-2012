var Vector = (function () {
    function Vector(x, y) {
        if (y === undefined) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
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
    
    p.mag = function (newMag) {
        if (newMag === undefined) {
            return Math.sqrt(this.magSq());
        }
        return this.norm().mult(newMag);
    };
    
    p.norm = function () {
        var mag = this.mag();
        if (!mag) return this;
              this.x /= mag;
        this.y /= mag;
        return this;
    };
    
    p.mult = function (mag) {
        this.x *= mag;
        this.y *= mag;
        return this;
    };
    
    p.sub = function (otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
        return this;
    };
    
    p.add = function (otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
        return this;
    };
    
    p.set = function (otherVec) {
        this.x = otherVec.x;
        this.y = otherVec.y;
        return this;
    };
    
    p.setMag = function (magnitude) {
        this.norm().mult(magnitude);
        return this;
    };
    
    p.neg = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    
    p.clone = function () {
        return new Vector(this.x, this.y);
    };
    
    return Vector;
}());