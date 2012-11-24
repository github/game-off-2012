function Button(pos, txt, onClick) {
	this.tPos = pos;
	this.base = new baseObj(this, 15);
	var textsize = 14;

	this.hover = false;
	this.down = false;
	
	this.onClick = onClick;

	this.draw = function(pen) {
		//Draw box
		if (this.down) {
			pen.fillStyle = "white";
		} 
		else if(this.hover){
			pen.fillStyle = "gray";
		} 
		else {
			pen.fillStyle = "dimgray";
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

	this.click = function()
	{
		this.onClick();
	};
	
	this.mouseover = function()
	{
        //console.log("mouseover");
		this.hover = true;
	};
	
	this.mouseout = function()
	{
        //console.log("out");
		this.hover = false;
	};
	
	this.mousedown = function()
	{
        //console.log("down");
		this.down = true;
	};
	
	this.mouseup = function()
	{
        //console.log("up");
		this.down = false;
	};
}

function Infobar() {
	//Make new tPos and offset it
	this.tPos = new temporalPos(bW, 0, 150, bH * 0.8, 0);
	this.base = new baseObj(this, 14);
	this.tattr = null;

	var buttonW = 100;


	//Std centered button position
	var posb = new temporalPos(((width-bW)/2)-(buttonW/2)+bW,200,buttonW,30,0);


	this.added = function()
    {
        //Upgrade button
	var root = this.base.rootNode;
        this.upgradeb = new Button(posb, "Upgrade!", root.upgradeSel.bind(root)) ;
        this.base.addObject(this.upgradeb);
    }
	
	this.updateAttr = function (obj) {
		this.tattr = obj.attr;
		return;
	}
		
        
    this.mouseout = function()
    {
        var breakHere = 2;
    }

	this.draw = function(pen) {
		pen.fillStyle = "#000";
		ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
        
		pen.fillStyle = "transparent";
		
		pen.strokeStyle = "orange";
        pen.lineWidth = 1;
		
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
}
