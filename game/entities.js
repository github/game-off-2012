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

function FancyBackground(pen) {
	this.base = new baseObj(this, 0);

	var txt = "";
	var possible = "01";
	for (var i = 0; i < 10; i++) {
		txt += possible.charAt(Math.round(Math.random()));
	}
	var textH = Math.floor(Math.random() * 5) + 10;
	var direction = "left";
	var speed = (textH*8)+ 25;

	//Prerender text
	var subcanvas = document.createElement("canvas");
	subcanvas.setAttribute('width', 100);
	subcanvas.setAttribute('height', 20);

	var subcancon = subcanvas.getContext('2d');
	subcancon.font = textH + "px courier";
	subcancon.fillStyle = "rgba(0,255,0,0.3)";
	ink.text(0, textH, txt, subcancon);

	
	this.tPos = new temporalPos(bW, Math.floor(Math.random()*bH), pen.measureText(txt), textH);
	

	this.update = function(dt) {
		if (direction == "left") {
			this.tPos.x -= dt*speed;
		}

		if (this.tPos.x + this.tPos.w < 0) {
			this.base.destroySelf();
		}
		return;
	}
	
	this.draw = function(pen) {
		pen.drawImage(subcanvas, this.tPos.x, this.tPos.y);
		return;
	}
}
