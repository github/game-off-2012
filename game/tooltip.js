function ToolTip(basetile) {
	var p = basetile.tPos;

	//Make new tPos and offset it
	this.tPos = new temporalPos(p.x, p.y, p.w, p.h, 0, 0);
	this.tPos.x += 10;
	this.tPos.y += 10;
	this.tPos.w = 40;
	this.tPos.h = 40


	this.baseTile = basetile;
	

	this.base = new baseObj(this, 10);

	this.update = function() {
		return;
	}	
	
	this.draw = function(pen) {
		pen.save();
		pen.fillStyle = "#ffffff";
		pen.strokeStyle = "lightblue";
		ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);        
		pen.restore();
		return;
	}
}

