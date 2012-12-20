function Button(text, callback, zorder) {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    
    if (!zorder)
        zorder = 15;
    
    this.base = new BaseObj(this, zorder, true);
    
    var hover = false;
    var down = false;
    
    this.draw = function(pen) {
        //Draw box
        if (down) {
            pen.fillStyle = "#333";
        } else if (hover) {
            pen.fillStyle = "#111";
        } else {
            pen.fillStyle = "black";
        }
        pen.strokeStyle = "green";
        
        ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
        
        // Draw text
        pen.fillStyle = "green";
        pen.font = "14px courier";
        pen.textBaseline = "middle";
        var cen = this.tPos.getCenter();
        ink.cenText(cen.x, cen.y, text, pen);
    }
    
    this.resize = function(rect) {
        this.tPos = rect;
        return this;
    }
    
    this.click = function() {
        if (callback) callback();
    };
    
    this.mouseover = function() {
        hover = true;
    };
    
    this.mouseout = function() {
        hover = false;
    };
    
    this.mousedown = function() {
        down = true;
    };
    
    this.mouseup = function() {
        down = false;
    };
}