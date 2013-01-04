var Rect = (function () {
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
    
    p.center = function () {
        return new Vector(this.x + this.w / 2, this.y + this.h / 2);
    };
    
    p.clone = function () {
        return new Rect(this.x, this.y, this.w, this.h);
    };
    
    //Takes a unit rectangle (so all values of it between 0 and 1) and scales it based on the given rect.
    p.scale = function (rect) {
        this.x = rect.x + this.x * rect.w;
        this.y = rect.y + this.y * rect.h;
        
        this.w = this.w * rect.w;
        this.h = this.h * rect.h;
        
        return this;
    }
    
    p.origin = function (newOrigin) {
        if (newOrigin === undefined) {
            return new Vector(this.x, this.y);
        }
        this.x = newOrigin.x;
        this.y = newOrigin.y;
        return this;
    }
    
    p.size = function (newSize) {
        if (newSize === undefined) {
            return new Vector(this.w, this.h);
        }
        this.w = newSize.x;
        this.h = newSize.y;
        return this;
    }
    
    // Shrinks a rectangle by amount in all directions.
    // used to add padding.
    p.shrink = function (amount) {
        this.x += amount;
        this.y += amount;
        this.w -= 2 * amount;
        this.h -= 2 * amount;
        return this;
    }
    
    return Rect;
}());