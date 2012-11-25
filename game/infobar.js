function Button(pos, txt, context, functionName, callData) {
	this.tPos = pos;
	this.base = new baseObj(this, 15);
	var textsize = 14;

	this.hover = false;
	this.down = false;
	
	this.context = context;
    this.functionName = functionName;
    this.callData = callData;

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

	this.click = function() {
        if(this.context[this.functionName])
            this.context[this.functionName](this.callData);
	};
	
	this.mouseover = function() {
		this.hover = true;
	};
	
	this.mouseout = function() {
		this.hover = false;
	};
	
	this.mousedown = function() {
		this.down = true;
	};
	
	this.mouseup = function() {
		this.down = false;
	};
}

function RadioButton(pos, txt, context, functionName, callData, prevRadioButton){
    this.tPos = pos;
	this.base = new baseObj(this, 15);
	var textsize = 14;

	this.hover = false;
	this.down = false;
	
    this.radioGroup = [];
    if(prevRadioButton) {
        for(var key in prevRadioButton.radioGroup) {
            prevRadioButton.radioGroup[key].addButtonToGroup(this);
            this.radioGroup.push(prevRadioButton.radioGroup[key]);
        }
    }
    this.radioGroup.push(this);
    
	this.context = context;
    this.functionName = functionName;
    this.callData = callData;
    
    this.toggled = false;
    
    this.toggle = function() {
        if(!this.toggled)
            this.pressed();
        else
            this.unpressed();
        
        for(var key in this.radioGroup) {
            if(this.radioGroup[key] != this)
                this.radioGroup[key].unpressed();
        }
    };
    
    this.pressed = function() {
        this.toggled = true;
        if(this.context[this.functionName])
            this.context[this.functionName](this.callData);
    };
    //Might be called multiple times
    this.unpressed = function() {
        this.toggled = false;
    };

    this.addButtonToGroup = function(button) {
        this.radioGroup.push(button);
    };
    
	this.draw = function(pen) {
		//Draw box
		if (this.down || this.toggled) {
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
	
	this.mouseover = function() {
		this.hover = true;
	};
	
	this.mouseout = function() {
		this.hover = false;
	};
	
	this.mousedown = function() {
		this.down = true;
	};
	
	this.mouseup = function() {
		this.down = false;
        this.toggle();
	};
}

function Infobar() {
	this.base = new baseObj(this, 14);
	this.tattr = null;

    this.targetStrategyButtons = {};
    
	var buttonW = 100;
    
    this.resize = function(e) {
        console.log(e);
        this.tPos = new temporalPos(e.width - 150, 0, 150, e.height * 0.8, 0)
    }
    
    //Upgrade button
    this.added = function()
    {
        	//Std centered button position
        this.upgradeb = new Button(
            new temporalPos(((width-bW)/2)-(buttonW/2)+bW,200,buttonW,30,0), 
            "Upgrade!", this.base.rootNode, "upgradeSel");
            
        this.base.addObject(this.upgradeb);
            
        
        var radioButton = new RadioButton(
            new temporalPos(((width-bW)/2)-(buttonW/2)+bW,250,buttonW,30,0), 
            "+Range", this, "setType", "Range", radioButton);
        this.base.addObject(radioButton);
        this.targetStrategyButtons[radioButton.callData] = radioButton;
        
        var radioButton = new RadioButton(
            new temporalPos(((width-bW)/2)-(buttonW/2)+bW,300,buttonW,30,0), 
            "+Damage", this, "setType", "Damage", radioButton);
        this.base.addObject(radioButton);
        this.targetStrategyButtons[radioButton.callData] = radioButton;
        
        var radioButton = new RadioButton(
            new temporalPos(((width-bW)/2)-(buttonW/2)+bW,350,buttonW,30,0), 
            "+Mutate", this, "setType", "Mutate", radioButton);
        this.base.addObject(radioButton);
        this.targetStrategyButtons[radioButton.callData] = radioButton;
        
    };
	
	this.updateAttr = function (obj) {
		this.tattr = obj.attr;
        var newRadio = this.targetStrategyButtons[obj.targetStrategy];
        if(newRadio) {
            if(!newRadio.toggled)
                newRadio.toggle();
            this.setType(obj.targetStrategy);
        }
        else {
            for(var key in this.targetStrategyButtons)
                this.targetStrategyButtons[key].unpressed();
        }
		return;
	}
    
    this.setType = function(type) {
        var selected = this.base.rootNode.selectedObj;
        if(!selected)
            return;
        
        selected.targetStrategy = type;
        
        if(type == "Range") {
            selected.attr.range += 100;
            selected.attr.speed -= 1;
        } 
        else if (type == "Damage") {
            selected.attr.damage += 30;
            selected.attr.speed -= 1;
        }
        else if (type == "Mutate") {
            selected.attr.mutate += 50;
            selected.attr.mutatestrength += 50;
            selected.attr.speed -= 1;
            selected.attr.damage -= 30;
        }
    }

    var prefixes = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
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
            var val = this.tattr[i];
            var po = 0;
            while (val > 1000) {
                val = val/1000;
                po++;
            }
            var pre = prefixes[po];
            if (pre == undefined) pre = "???";
		    var txt = i + ": " + Math.round(val*10)/10 + pre;
		    ink.text(x, y + counter, txt, pen);
		    counter += 15;
		}
	}
}
