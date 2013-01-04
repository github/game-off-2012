function Label(text, zorder) {
    this.box = new Rect(0, 0, 0, 0);
    
    if(!assertDefined(text))
        return;

    if (!zorder) zorder = 15;
    
    this.base = new BaseObj(this, zorder);
    this.type = "Label" + zorder;
    
    this.redraw = function (canvas) {
        var t = new Text();
        t.text(text);
        t.resize(new Rect(0, 0, 0, 0).size(this.box.size()));
        canvas.fill(t, "green");
    }
    
    this.resize = function (rect) {
        this.box = rect;
        this.base.dirty();
        return this;
    }
    
    this.text = function (newText) {
        if (newText === undefined) {
            return text;
        } else {
            text = newText;
            this.base.dirty();
            return this;
        }
    }
}