function Button(text, callback, zorder) {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    
    if (!zorder)
        zorder = 15;
    
    this.base = new BaseObj(this, zorder, true);
    
    var hover = false;
    var down = false;
    var canvas = new Canvas();
    var dirty = true;
    
    this.draw = function(pen) {
        if (!dirty) {
            canvas.drawTo(pen);
            return;
        }
        
        //Draw box
        var fill = "black";
        if (hover) fill = "#222";
        if (down) fill = "#555";
        
        var p = new Path();
        var r = this.tPos.clone();
        r.x = r.y = 0.5;
        r.h -= 1;
        r.w -= 1;
        p.rect(r);
        canvas.stroke(p, "green", 1);
        canvas.fill(p, fill);
        
        // We should do this with a text object later.
        var c = canvas.ctx();
        c.fillStyle = "green";
        c.font = "14px courier";
        c.textBaseline = "middle";
        var cen = r.getCenter();
        ink.cenText(cen.x, cen.y, text, c);
        
        canvas.drawTo(pen);
        dirty = false;
        return;
    }
    
    this.resize = function(rect) {
        canvas.resize(rect);
        this.tPos = rect;
        dirty = true;
        return this;
    }
    
    this.click = function() {
        if (callback) callback();
    };
    
    this.mouseover = function() {
        hover = true;
        dirty = true;
    };
    
    this.mouseout = function() {
        hover = false;
        dirty = true;
    };
    
    this.mousedown = function() {
        down = true;
        dirty = true;
    };
    
    this.mouseup = function() {
        down = false;
        dirty = true;
    };
}