function Path_End(x, y, w, h) {
    this.tPos = new Rect(x, y, w, h);
    this.base = new BaseObj(this, 2);
    
    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = "grey";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}

function Path_Start(x, y, w, h) {
    this.tPos = new Rect(x, y, w, h);
    this.base = new BaseObj(this, 2);
    
    this.update = function (dt) {
        if (this.nextPath && !this.pathLine) {
            var eng = getEng(this);

            this.pathLine = new Path_Line(this);
            eng.base.addObject(this.pathLine);
        }
    };
    
    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = "yellow";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}


function Path_Line(pathBase) {
    this.path = pathBase;
    
    //Our shape is a lie! (its off, not that it really matters)
    this.tPos = pathBase.tPos;
    this.base = new BaseObj(this, 3);
    
    this.draw = function (pen) {
        if (pathBase.nextPath) {
            var t = pathBase.nextPath.tPos.center();
            var direction = new Vector(t.x, t.y);
            direction.sub(pathBase.tPos.center());

            var start = pathBase.tPos.center();

            var end = new Vector(start.x, start.y);
            direction.norm().mult(pathBase.tPos.w);
            end.add(direction);

            pen.strokeStyle = "blue";
            pen.lineWidth = 2;
            ink.arrow(start.x, start.y, end.x, end.y, pen);
        }
    };
}

function Path_Piece(x, y, w, h) {
    this.tPos = new Rect(x, y, w, h);
    this.base = new BaseObj(this, 3);
    this.pathLine = null;

    this.update = function (dt) {
        if (this.nextPath && !this.pathLine) {
            var eng = getEng(this);

            this.pathLine = new Path_Line(this);
            eng.base.addObject(this.pathLine);
        }
    };
}
