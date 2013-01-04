function Button(text, callback, zorder) {
    this.box = new Rect(0, 0, 0, 0);
    
    if (!zorder)
        zorder = 15;
    
    this.base = new BaseObj(this, zorder, true);
    
    var hover = false;
    var down = false;
    var textWrapper = new Text();
    textWrapper.text(text);
    
    this.redraw = function (canvas) {
        var p = new Path();
        var r = this.box.clone().origin(new Vector(0, 0)).shrink(1.5);
        p.rect(r);
        
        var fill = "black";
        if (hover) fill = "#222";
        if (down) fill = "#555";
        canvas.stroke(p, "green", 1);
        canvas.fill(p, fill);
        
        canvas.fill(textWrapper, "green");
        return;
    }
    
    this.resize = function (rect) {
        this.box = rect;
        var r = rect.clone().origin(new Vector(0, 0)).shrink(1.5);
        textWrapper.resize(r);
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