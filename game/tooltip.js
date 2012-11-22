function ToolTip(basetile) {
	var p = basetile.tPos;

	//Make new tPos and offset it
	this.tPos = new temporalPos(p.x, p.y, p.w, p.h, 0, 0);
	this.tPos.x += tileSize-2;
	this.tPos.w = 40;
	this.tPos.h = 40;


	this.baseTile = basetile;

	this.hover = true;
	

	this.base = new baseObj(this, 10);

	this.update = function() {
		if (this.hover == false) {
			this.base.parent.base.removeObject(this);
		}

		return;
	}	
	
	this.draw = function(pen) {
		pen.save();
		pen.fillStyle = "rgba(255,255,255,0.5)";
		pen.strokeStyle = "lightblue";
		ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);        
		pen.restore();
		return;
	}

	this.mouseover = function (e) {
		this.hover = true;
		return;
	}

	this.mouseout = function (e) {
		this.hover = false;
		
		return;
	}
}

