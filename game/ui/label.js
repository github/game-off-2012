function Label(pos, text, zorder) {
    if (!zorder) zorder = 15;
    
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this, zorder);
    this.type = "Label" + zorder;
    
    this.draw = function (pen) {
        // Draw text
        pen.fillStyle = "green";
        pen.font = "14px courier";
        pen.textBaseline = "middle";
        var cen = this.tPos.getCenter();
        ink.cenText(cen.x, cen.y, text, pen);
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