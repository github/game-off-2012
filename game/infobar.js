function Button(pos) {
	this.tPos = pos;
	this.base = new baseObj(this, 15);

	this.draw = function() {
		return;
	}

	this.update = function () {
		return;
	}
}

function Infobar() {
	//Make new tPos and offset it
	this.tPos = new temporalPos(bW, 0, 150, bH, 0);
	this.base = new baseObj(this, 14);
	this.tattr = null;


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
				txt = i + ": " + this.tattr[i];
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
