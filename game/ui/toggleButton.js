// Basically a checkbox/label combo
function ToggleButton(text, cb) {
    this.tPos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this, 15);
    
    var hover = false;
    var down = false;
    var canvas = new Canvas();
    var dirty = true;
    
    this.toggled = false;
    this.toggle = function() {
        this.toggled = !this.toggled;
        cb();
    };
    
    this.resize = function(rect) {
        canvas.resize(rect);
        this.tPos = rect;
        dirty = true;
        return this;
    }
    
    this.draw = function(pen) {
        if (!dirty) {
            canvas.drawTo(pen);
            return;
        }
        
        var outline = new Path();
        var r = new Rect(1.5, 1.5, this.tPos.w - 3, this.tPos.h - 3);
        outline.rect(r);
        
        var fill = "black";
        if (hover) fill = "#222";
        if (down) fill = "#555";
        canvas.stroke(outline, "green", 1);
        canvas.fill(outline, fill);
        
        // Draw text
        var c = canvas.ctx();
        c.fillStyle = "green";
        c.font = "14px courier";
        c.textBaseline = "middle";
        var cen = r.getCenter();
        ink.cenText(cen.x, cen.y, text, c);
        
        var box = new Path();
        var padding = 6;
        var size = r.h - 2 * padding;
        box.rect(new Rect(r.x + padding, r.y + padding, size, size));
        
        if (this.toggled) {
            fill = "green";
        } else {
            fill = "black";
        }
        canvas.stroke(box, "green", 1);
        canvas.fill(box, fill);
        
        dirty = false;
        canvas.drawTo(pen);
        return;
    }
    
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
        this.toggle();
    };
}