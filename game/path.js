function Path_End(x, y, w, h) {
    var self = this;
    self.tpos = new Rect(x, y, w, h);
    self.base = new BaseObj(self, 2);

    self.drawToGameboard = function (pen) {
        var p = self.tpos;
        pen.fillStyle = "grey";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}

function Path_Start(x, y, w, h) {
    var self = this;
    self.tpos = new Rect(x, y, w, h);
    self.base = new BaseObj(self, 2);

    self.drawToGameboard = function (pen) {
        var p = self.tpos;
        pen.fillStyle = "yellow";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}

function Path_Piece(x, y, w, h) {
    var self = this;
    self.tpos = new Rect(x, y, w, h);
    self.base = new BaseObj(self, 3);

    self.drawToGameboard = function (pen) {
        if (!self.nextPath) return;

        var t = self.nextPath.tpos.center();
        var direction = new Vector(t.x, t.y);
        direction.sub(self.tpos.center());

        var start = self.tpos.center();

        var end = new Vector(start.x, start.y);
        direction.norm().mult(self.tpos.w);
        end.add(direction);

        pen.strokeStyle = "blue";
        pen.lineWidth = 2;
        ink.arrow(start.x, start.y, end.x, end.y, pen);
    }
}
