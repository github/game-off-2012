function Label(pos, text, zorder) {
    if (!zorder)
        zorder = 15;
    
    this.tPos = pos;
    this.base = new BaseObj(this, zorder);
    this.type = "Label" + zorder;
    this.color = "red";
    this.font = "12px courier";
    
    this.text = formatToDisplay(text);
    
    this.draw = function (pen) {
        //Draw text
        pen.fillStyle = this.color;
        pen.font = this.font;
        
        ink.text(this.tPos.x, this.tPos.y, this.text, pen);
        return;
    }
    
    this.resize = function (rect) {
        this.tPos = rect;
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