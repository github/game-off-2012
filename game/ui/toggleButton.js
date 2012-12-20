// Basically a checkbox/label combo
function ToggleButton(text, cb) {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this, 15);
    
    var hover = false;
    var down = false;
    
    this.toggled = false;
    this.toggle = function() {
        this.toggled = !this.toggled;
        cb();
    };
    
    this.resize = function(rect) {
        this.tPos = rect;
        return this;
    }
    
    this.draw = function(pen) {
        if (down) {
            pen.fillStyle = "#555";
        } else if (hover) {
            pen.fillStyle = "#222";
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
        
        // Draw checkbox
        if (this.toggled) {
            pen.fillStyle = "white";
        } else {
            pen.fillStyle = "black";
        }
        pen.strokeStyle = "green";
        ink.rect(this.tPos.x + 6, this.tPos.y + 6, this.tPos.h - 12, this.tPos.h - 12, pen);
        
        return;
    }
    
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
        this.toggle();
    };
}