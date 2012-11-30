
//Make list with lits of alleles to create default tower types.

function GameInfoBar(pos) {
    this.tPos = pos;
    this.base = new BaseObj(this, 14);

	this.tPos = pos;

	this.healthIndi = new Label(
        new TemporalPos(pos.x + 9, pos.y + 25, pos.w, pos.h), "");
	this.healthIndi.font = "20px arial";
	this.healthIndi.color = "white";
	this.base.addObject(this.healthIndi);

	this.moneyIndi = new Label(
        new TemporalPos(pos.x + 9, pos.y + 50, pos.w, pos.h), "");
	this.moneyIndi.font = "20px arial";
	this.moneyIndi.color = "white";
	this.base.addObject(this.moneyIndi);

	this.FPSIndi = new Label(
        new TemporalPos(pos.x + 200, pos.y + 25, pos.w, pos.h), "");
	this.FPSIndi.font = "20px arial";
	this.FPSIndi.color = "white";
	this.base.addObject(this.FPSIndi);

	this.bugIndi = new Label(
        new TemporalPos(pos.x + 200, pos.y + 50, pos.w, pos.h), "");
	this.bugIndi.font = "20px arial";
	this.bugIndi.color = "white";
	this.base.addObject(this.bugIndi);

	this.curLevelIndi = new Label(
        new TemporalPos(pos.x + 300, pos.y + 25, pos.w, pos.h), "");
	this.curLevelIndi.font = "20px arial";
	this.curLevelIndi.color = "white";
	this.base.addObject(this.curLevelIndi);

	this.nextLevelTimeIndi = new Label(
        new TemporalPos(pos.x + 300, pos.y + 50, pos.w, pos.h), "");
	this.nextLevelTimeIndi.font = "20px arial";
	this.nextLevelTimeIndi.color = "white";
	this.base.addObject(this.nextLevelTimeIndi);

	this.update = function () {
	    var eng = this.base.rootNode;
	    this.healthIndi.text = "User Health: " + roundToDecimal(eng.health, 1);
	    this.moneyIndi.text = "Money: $" + roundToDecimal(eng.money, 2);
	    this.FPSIndi.text = "FPS: " + roundToDecimal(eng.lastFPS, 2);
	    this.bugIndi.text = "Bugs: " + roundToDecimal(eng.base.allLengths.Bug, 2);

	    this.curLevelIndi.text = "Current Level: " + roundToDecimal(eng.lvMan.curLevel, 2);
	    this.nextLevelTimeIndi.text = "Seconds To Next Level: " + roundToDecimal(eng.lvMan.nwicounter, 0);
	    if (this.base.rootNode.health < 50) {
		 this.healthIndi.color = "yellow";
	    } else if (this.base.rootNode.health < 25) {
		 this.healthIndi.color = "red";
	    }

	}

	this.draw = function (pen) {
	    pen.fillStyle = "#000";
	    ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);

	    pen.fillStyle = "transparent";

	    pen.strokeStyle = "orange";
	    pen.lineWidth = 1;

	    ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
	}
}
