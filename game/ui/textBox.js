function TextBox(text, zorder) {
    this.box = new TemporalPos(0, 0, 0, 0);

    if (!zorder) zorder = 15;
    this.base = new BaseObj(this, zorder, true);

    var wrapper = new TextWrapper(text, zorder + 1);
    wrapper.textAlign = "center";
    this.base.addChild(wrapper);

    this.draw = function(pen) {
        pen.fillStyle = "black";
        pen.strokeStyle = "green";
        ink.rect(this.box.x, this.box.y, this.box.w, this.box.h, pen);
    };

    this.resize = function (rect) {
        wrapper.resize(rect);
        this.box = wrapper.box;
        return this;
    }
}