function Path_End(x, y, w, h) {
    this.tpos = new Rect(x, y, w, h);
    this.base = new BaseObj(this, 2);

    this.draw = function (pen) {
        var p = this.tpos;
        pen.fillStyle = "grey";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}

function Path_Start(x, y, w, h) {
    this.tpos = new Rect(x, y, w, h);
    this.base = new BaseObj(this, 2);

    this.draw = function (pen) {
        var p = this.tpos;
        pen.fillStyle = "yellow";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}

function Path_Piece(x, y, w, h) {
    this.tpos = new Rect(x, y, w, h);
    this.base = new BaseObj(this, 3);

    this.redraw = function (canvas) {
        if (!this.nextPath) return;

        var p = this.tpos;
        // tpos x/y give us the origin of our arrow, and w-h give us the
        // size of our arrow, However, I'm too lazy to figure out what
        // direction the arrow is going in and resize/translate the canvas
        // based on that, so instead I just make it twice as large as
        // necessary.
        canvas.resize(new Rect(p.x-p.w/2, p.y-p.h/2, p.w*2, p.h*2));
        var pen = canvas.ctx();
        pen.translate(p.w/2-p.x, p.h/2-p.y);

        var t = this.nextPath.tpos.center();
        var direction = new Vector(t.x, t.y);
        direction.sub(this.tpos.center());

        var start = this.tpos.center();

        var end = new Vector(start.x, start.y);
        direction.norm().mult(this.tpos.w);
        end.add(direction);

        pen.strokeStyle = "blue";
        pen.lineWidth = 2;
        ink.arrow(start.x, start.y, end.x, end.y, pen);
    };
}
