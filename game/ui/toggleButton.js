// Basically a checkbox/label combo
function ToggleButton(text, cb) {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this, 15);

    var hover = false;
    var down = false;

    var toggled = true;
    this.toggled = function () {
        return toggled;
    };

    this.toggle = function() {
        toggled = !toggled;
        if (cb) cb();
    };

    this.resize = function(rect) {
        this.tpos = rect;
        this.base.dirty();
        return this;
    }

    this.redraw = function(canvas) {
        var outline = new Path();
        var r = new Rect(1.5, 1.5, this.tpos.w - 3, this.tpos.h - 3);
        outline.rect(r);

        var fill = "black";
        if (hover) fill = "#222";
        if (down) fill = "#555";
        canvas.stroke(outline, "green", 1);
        canvas.fill(outline, fill);

        var t = new Text();
        t.text(text);
        t.resize(r);
        canvas.fill(t, "green");

        var box = new Path();
        var padding = 6;
        var size = r.h - 2 * padding;
        box.rect(new Rect(r.x + padding, r.y + padding, size, size));

        fill = toggled ? "green" : "black";
        canvas.stroke(box, "green", 1);
        canvas.fill(box, fill);
        return;
    }

    this.mousemove = function() {
        hover = true;
        this.base.dirty();
    };

    this.mouseout = function() {
        hover = false;
        this.base.dirty();
    };

    this.mousedown = function() {
        down = true;
        this.base.dirty();
    };

    this.mouseup = function() {
        down = false;
        this.base.dirty();
        this.toggle();
    };
}
