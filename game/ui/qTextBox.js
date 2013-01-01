function QTextBox(pos, text, zorder) {
    this.tPos = pos.clone();

    if (!zorder) zorder = 15;
    this.base = new BaseObj(this, zorder, true);

    var hover = false;
    var down = false;

    this.wrapper = new QTextWrapper(new Rect(pos.x + 5, pos.y, pos.w - 10, pos.h), text, zorder + 1, true);
    this.wrapper.textAlign = "center";
    this.base.addObject(this.wrapper);

    this.draw = function(pen) {
        pen.fillStyle = "black";
        pen.strokeStyle = "green";
        ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
    };

    this.resize = function (rect) {
        //Nothing
        return this;
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