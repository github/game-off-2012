
function Path_End(x, y, w, h) {
    this.tPos = new TemporalPos(x, y, w, h, 0, 0);
    this.base = new BaseObj(this, 2);
    
    this.update = function (dt) {
        this.tPos.update(dt);
    };
    
    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = "grey";
        pen.strokeStyle = "lightgreen";
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}

function Path_Start(x, y, w, h) {
    this.tPos = new TemporalPos(x, y, w, h, 0, 0);
    this.base = new BaseObj(this, 1);
    
    //This is set after we are made
    //this.nextPath
    
    this.update = function (dt) {
        this.tPos.update(dt);
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
    
    this.update = function (dt) {
        this.tPos.update(dt);
    };
    
    this.draw = function (pen) {
        if (pathBase.nextPath) {
            var t = pathBase.nextPath.tPos.getCenter();
            var direction = new Vector(t.x, t.y);
            direction.sub(pathBase.tPos.getCenter());
            
            var start = pathBase.tPos.getCenter();
            
            var end = new Vector(start.x, start.y);
            direction.norm().mult(pathBase.tPos.w);
            end.add(direction);
            
            pen.strokeStyle = "blue";
            ink.arrow(start.x, start.y, end.x, end.y, pen);
        }
    };
}

function Path(x, y, w, h) {
    this.tPos = new TemporalPos(x, y, w, h, 0, 0);
    this.base = new BaseObj(this, 2);
    this.pathLine = null;
    
    this.update = function (dt) {
        this.tPos.update(dt);
        
        var newObjs = [];
        
        if (this.nextPath && !this.pathLine) {
            this.pathLine = new Path_Line(this);
            newObjs.push(this.pathLine);
        }
        
        return newObjs;
    };

    this.draw = function (pen) {
        var p = this.tPos;
        pen.fillStyle = "transparent";
        pen.strokeStyle = "#123456";
        pen.lineWidth = 1;
    };
}
