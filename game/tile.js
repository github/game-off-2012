function Tile(x, y, w, h) {
    this.hover = false;

    this.tPos = new TemporalPos(x, y, w, h, 0, 0);
    this.base = new BaseObj(this, 1);

    this.base.addObject(new Selectable());

    this.update = function (dt) {
        this.tPos.update(dt);
    };

    this.draw = function (pen) {
        var p = this.tPos;

        pen.fillStyle = "transparent";
        if (this.hover) {
            pen.strokeStyle = "yellow";
        } else {
            pen.strokeStyle = "#123456";
        }
        pen.lineWidth = 1;
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };

    this.mouseover = function() {
        this.hover = true;
    };

    this.mouseout = function() {
        this.hover = false;
    };
}