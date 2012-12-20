function Label(text, zorder) {
    if(!assertDefined(text))
        return;

    if (!zorder) zorder = 15;
    
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this, zorder);
    this.type = "Label" + zorder;
    
    var color = "green";
    var font = "14px courier";
    
    this.draw = function (pen) {        
        pen.fillStyle = color;
        pen.font = font;
        
        var loc = this.tPos.getCenter();
        ink.cenText(loc.x, loc.y, text, pen);
        return;
    }
    
    this.resize = function (rect) {
        this.tPos = rect;
        return this;
    }
    
    this.text = function (newtext) {
        if (newtext === undefined) {
            return text;
        } else {
            text = newtext;
            return this;
        }
    }
    
    this.mouseover = function () {
        this.hover = true;
    };
    
    this.mouseout = function () {
        this.hover = false;
    };
    
    this.mousedown = function () {
        this.down = true;
    };
    
    this.mouseup = function () {
        this.down = false;
    };
}