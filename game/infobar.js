function Button(pos, txt) {
	this.tPos = pos;
	this.base = new baseObj(this, 15);

	this.clicked = false;
	this.activated = false;

	this.draw = function(pen) {
		//Draw box
		if (this.clicked == true) {
			pen.fillStyle = "#eeeeee";
		} else {
			pen.fillStyle = "#cccccc";
		}
		ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
		
		//Draw text
		pen.fillStyle = "#000000";
		ink.text(this.tPos.x+50, this.tPos.y+30, txt, pen);
		return;
	}

	this.update = function () {
		return;
	}

	this.reset = function() {
		this.activated = false;
		return;
	}

	this.mousedown = function(e) {
		this.clicked = true;
		this.activated = true;
	}

	this.mouseup = function (e) {
		this.clicked = false;
	}


	this.mouseout = function (e) {
		return;
	}

}

function Infobar() {
	//Make new tPos and offset it
	this.tPos = new temporalPos(bW, 0, 150, bH, 0);
	this.base = new baseObj(this, 14);
	this.tattr = null;

	var buttonW = 100;
	var pos = new temporalPos(((width-bW)/2)-(buttonW/2)+bW,400,buttonW,30,0);
	this.testb = new Button(pos, "Hello") ;
	this.base.addObject(this.testb);


	this.updateSelectedTower = function (tower) {
		this.tattr = tower.attr;
		return;
	}
		

	this.draw = function(pen) {
		pen.fillStyle = "#ffffff";
		ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
		var counter = 0;
		pen.fillStyle = "black";
		pen.font = "10px courier";
		if (this.tattr != null) {
			ink.text(this.tPos.x+2, this.tPos.y+10+counter, "Tower", pen);
			counter += 10;
			for (i in this.tattr) {
				txt = i + ": " + Math.round(this.tattr[i]*10)/10;
				ink.text(this.tPos.x+2, this.tPos.y+10+counter, txt, pen);
				counter += 10;
			}
		} else {
			ink.text(this.tPos.x+2, this.tPos.y+10+counter, "No tower selected!", pen);
		}


		return;
	}

	this.update = function (dt) {
		return;
	}

}
