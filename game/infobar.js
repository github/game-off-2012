function Button(pos, txt, type, callback) {
	//Type indicates to draw button when selected object is of type type
	this.tPos = pos;
	this.base = new baseObj(this, 15);
	var textsize = 14;

	this.clicked = false;
	this.activated = false;

	this.draw = function(pen) {
		if (!this.drawMe) {
			return;
		}

		//Draw box
		if (this.clicked == true) {
			pen.fillStyle = "#eeeeee";
		} else {
			pen.fillStyle = "#cccccc";
		}
		ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
		
		//Draw text
		pen.fillStyle = "#000000";
		pen.font = textsize + "px arial";

		//How wide is text?
		var tW = pen.measureText(txt).width;

		ink.text(this.tPos.x+(this.tPos.w/2)-(tW/2), this.tPos.y+textsize+4, txt, pen);
		return;
	}

	this.update = function () {
		if (this.base.rootNode.getSelType() != type) {
			this.drawMe = false;
		} else {
			this.drawMe = true;
		}

		return;
	}

	this.reset = function() {
		//this.activated = false;
		return;
	}

	this.mousedown = function(e) {
		this.clicked = true;
		//this.activated = true;
		callback();

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
	this.tPos = new temporalPos(bW, 0, 150, bH/2, 0);
	this.base = new baseObj(this, 14);
	this.tattr = null;

	var buttonW = 100;


	//Std centered button position
	var posb = new temporalPos(((width-bW)/2)-(buttonW/2)+bW,200,buttonW,30,0);

	//Upgrade button
	this.upgradeb = new Button(posb, "Upgrade!", "Tower", upgradeTowerButtonClick) ;
	this.base.addObject(this.upgradeb);


	this.updateAttr = function (obj) {
		this.tattr = obj.attr;
		return;
	}
		

	this.draw = function(pen) {
		pen.fillStyle = "#000";
		ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
        
		pen.fillStyle = "#0f0";
		pen.font = "15px courier";
        
		var x = this.tPos.x + 10;
		var y = this.tPos.y + 15;
		
		if (this.tattr == null) {
		    ink.text(x, y, "[no selction]", pen);
		    return;
		}
		
		ink.text(x, y, "Tower", pen);
		var counter = 20;
		pen.font = "10px courier";
		for (i in this.tattr) {
		    txt = i + ": " + Math.round(this.tattr[i]*10)/10;
		    ink.text(x, y + counter, txt, pen);
		    counter += 15;
		}
	}

	this.update = function (dt) {
		if (this.upgradeb.activated == true) {
			this.base.parent.upgradeSel();
			this.upgradeb.reset();
		}
		return;
	}

}
