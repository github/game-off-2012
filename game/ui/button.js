function Button(text, callback, zorder) {
    this.tPos = new Rect(0, 0, 0, 0);
    
    if (!zorder)
        zorder = 15;
    
    this.base = new BaseObj(this, zorder, true);
    
    var hover = false;
    var down = false;
    
    this.redraw = function (canvas) {
        var p = new Path();
        var r = new Rect(1.5, 1.5, this.tPos.w - 3, this.tPos.h - 3);
        p.rect(r);
        
        var fill = "black";
        if (hover) fill = "#222";
        if (down) fill = "#555";
        canvas.stroke(p, "green", 1);
        canvas.fill(p, fill);
        
        var t = new Text();
        t.text(text);
        t.resize(r);
        canvas.fill(t, "green");
        return;
    }
    
    this.resize = function (rect) {
        this.tPos = rect;
        this.base.dirty();
        return this;
    }
    
    this.click = function () {
        if (callback) callback();
    };
    
    this.mouseover = function () {
        hover = true;
        this.base.dirty();
    };
    
    this.mouseout = function () {
        hover = false;
        this.base.dirty();
    };
    
    this.mousedown = function () {
        down = true;
        this.base.dirty();
    };
    
    this.mouseup = function () {
        down = false;
        this.base.dirty();
    };
}