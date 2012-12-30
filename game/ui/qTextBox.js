function QTextBox(text, zorder) {
    this.tPos = new TemporalPos(0, 0, 0, 0);

    if (!zorder) zorder = 15;
    this.base = new BaseObj(this, zorder, true);

    var hover = false;
    var down = false;

    this.wrapper = new QTextWrapper(text, zorder + 1);
    this.wrapper.textAlign = "center";
    this.base.addObject(this.wrapper);

    this.draw = function(pen) {
        pen.fillStyle = "black";
        pen.strokeStyle = "green";
        ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
    };

    this.resize = function (rect) {
        this.wrapper.tPos = rect;
        this.tPos = this.rect;
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