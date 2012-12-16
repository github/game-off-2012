var Rect = (function() {
    function Rect(x, y, w, h) {
        this.x = x;
        this.y = y;
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
    }
    
    var p = Rect.prototype;
    
    p.getCenter = function() {
        return new Vector(this.x + this.w / 2, this.y + this.h / 2);
    };
    
    p.clone = function() {
        return new Rect(this.x, this.y, this.w, this.h);
    };
    
    return Rect;
}());

function TemporalPos(x, y, w, h, dx, dy) {
    Rect.call(this, x, y, w, h);
    this.dx = dx;
    this.dy = dy;

    this.update = function(dt) {
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    };

    this.setSpeed = function(speed) {
        var s = new Vector(this.dx, this.dy).setMag(speed);
        this.dx = s.x;
        this.dy = s.y;
        
        return this;
    };
    
    this.clone = function() {
        return new TemporalPos(this.x, this.y, this.w, this.h, this.dx, this.dy);
    };
}
TemporalPos.prototype = Rect.prototype;

var Vector = (function() {
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
    
    p.magSq = function() {
        return this.x * this.x + this.y * this.y;
    };
    
    p.mag = function() {
        return Math.sqrt(this.magSq());
    };
    
    p.norm = function() {
        var mag = this.mag();
        if (!mag) return this;
        this.x /= mag;
        this.y /= mag;
        return this;
    };
    
    p.mult = function(mag) {
        this.x *= mag;
        this.y *= mag;
        return this;
    };
    
    p.sub = function(otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
        return this;
    };
    
    p.add = function(otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
        return this;
    };
    
    p.setMag = function(magnitude) {
        this.norm().mult(magnitude);
        return this;
    };
    
    p.clone = function() {
        return new Vector(this.x, this.y);
    };
    
    return Vector;
}());