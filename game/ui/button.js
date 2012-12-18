function Button(pos, text, callback, zorder) {
    if (!(pos instanceof TemporalPos)) {
        throw "Fuck you give me a REAL temporal postion!!";
    }
    this.tPos = pos;
    
    if (!zorder)
        zorder = 15;
    
    this.base = new BaseObj(this, zorder, true);
    
    hover = false;
    down = false;
    
    this.draw = function(pen) {
        //Draw box
        if (this.down) {
            pen.fillStyle = "#333";
        } else if (this.hover) {
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