function Tile(x, y, w, h) {
    this.hover = false;

    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj(this, 1);

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
            pen.lineWidth = 2;
        }
        ink.rect(p.x, p.y, p.w, p.h, pen);

        //Strange... but we can't set this during update!
        this.hover = false;
    };

    this.mouseover = function() {
        this.hover = true;
    };

    this.mouseout = function() {
        this.hover = false;
    };

    this.click = function(e) {
        var eng = this.base.rootNode;
        var towerOnTile = findClosest(eng, "Tower", e, 0);
        var pathOnTile = findClosest(eng, "Path", e, 0);

        if (!towerOnTile && !pathOnTile && eng.money - 50 >= 0) {
            eng.money -= 50;
            eng.base.addObject(new Tower(this));
        }
    };
}


function Path_End(x, y, w, h) {
    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj(this, 1);

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
    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj(this, 1);

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
    this.base = new baseObj(this, 2);

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
    this.tPos = new temporalPos(x, y, w, h, 0, 0);
    this.base = new baseObj(this, 1);
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
        pen.fillStyle = "green";
        pen.strokeStyle = "lightgreen";
        pen.lineWidth = 1.5;
        ink.rect(p.x, p.y, p.w, p.h, pen);
    };
}

function FancyBackground(pen) {
	this.base = new baseObj(this, 0);

	var txt = "";
	var possible = "01";
	for (var i = 0; i < 10; i++) {
		txt += possible.charAt(Math.round(Math.random()));
	}
	var textH = Math.floor(Math.random() * 5) + 10;
	var direction = "left";
	var speed = (Math.random() * 10)+ 50;
	
	this.tPos = new temporalPos(bW, Math.floor(Math.random()*bH), pen.measureText(txt), textH);
	

	this.update = function(dt) {
		if (direction == "left") {
			this.tPos.x -= dt*speed;
		}

		if (this.tPos.x < 0) {
			this.base.destroySelf();
		}
		return;
	}
	
	this.draw = function(pen) {
		pen.fillStyle = "rgba(0,255,0,0.3)";
		ink.text(this.tPos.x, this.tPos.y, txt, pen);


		return;
	}
}
