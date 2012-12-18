// Basically a checkbox/label combo
function ToggleButton(text, cb) {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this, 15);
    
    var textsize = 14;
    var hover = false;
    var down = false;
    
    this.toggled = false;
    this.toggle = function() {
        this.toggled = !this.toggled;
        cb();
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
        this.toggle();
    };
    
    this.resize = function(rect) {
        this.tPos = rect;
        return this;
    }
    
    this.draw = function(pen) {
        if (this.down) {
            pen.fillStyle = "#333";
        } else if (this.hover) {
            pen.fillStyle = "#111";
        } else {
            pen.fillStyle = "black";
        }
        pen.strokeStyle = "green";
        
        ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
        
        //Draw text
        pen.fillStyle = "green";
        pen.font = textsize + "px arial";

        //How wide is text?
        var tW = pen.measureText(text).width;

        ink.text(this.tPos.x+(this.tPos.w/2)-(tW/2), this.tPos.y+textsize+4, text, pen);
        
        if (this.toggled) {
            pen.fillStyle = "white";
        } else {
            pen.fillStyle = "black";
        }
        pen.strokeStyle = "green";
        ink.rect(this.tPos.x + 6, this.tPos.y + 6, this.tPos.h - 12, this.tPos.h - 12, pen);
        
        return;
    }
}