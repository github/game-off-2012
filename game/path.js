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
    
    this.update = function (dt) {
        if (this.nextPath && !this.pathLine) {
            var eng = getEng(this);

            this.pathLine = new Path_Line(this);
            eng.base.addChild(this.pathLine);
        }
    };
    
    this.draw = function (pen) {
        var p = this.tpos;
        pen.fillStyle = "yellow";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}


function Path_Line(pathBase) {
    this.path = pathBase;
    
    //Our shape is a lie! (its off, not that it really matters)
    this.tpos = pathBase.tpos;
    this.base = new BaseObj(this, 3);
    
    this.draw = function (pen) {
        if (pathBase.nextPath) {
            var t = pathBase.nextPath.tpos.center();
            var direction = new Vector(t.x, t.y);
            direction.sub(pathBase.tpos.center());

            var start = pathBase.tpos.center();

            var end = new Vector(start.x, start.y);
            direction.norm().mult(pathBase.tpos.w);
            end.add(direction);

            pen.strokeStyle = "blue";
            pen.lineWidth = 2;
            ink.arrow(start.x, start.y, end.x, end.y, pen);
        }
    };
}

function Path_Piece(x, y, w, h) {
    this.tpos = new Rect(x, y, w, h);
    this.base = new BaseObj(this, 3);
    this.pathLine = null;

    this.update = function (dt) {
        if (this.nextPath && !this.pathLine) {
            var eng = getEng(this);

            this.pathLine = new Path_Line(this);
            eng.base.addChild(this.pathLine);
        }
    };
}
