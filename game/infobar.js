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
	
	this.added = function() {
        this.resize = Dock(this, "none", "center");
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
    
    this.added = function() {
        this.resize = Dock(this, "center", "none");
    }
    
    //May be called multiple times
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

function Dock(item, dockX, dockY) {
    var parent = item.base.parent.tPos;
    var obj = item.tPos;
    
    var left = obj.x - parent.x;
    var top = obj.y - parent.y;
    return function () {
        console.log(parent, obj);
        
        if (dockX == "left") {
            obj.x = parent.x;
        } else if (dockX == "right") {
            obj.x = parent.w - obj.w;
        } else if (dockX == "center") {
            obj.x = (parent.w - obj.w) / 2;
        } else {
            obj.x = parent.x + left;
        }
        
        if (dockY == "top") {
            obj.y = parent.y
        } else if (dockY == "bottom") {
            obj.y = parent.h - obj.h;
        } else if (dockY == "center") {
            obj.y = (parent.h - obj.h) / 2
        } else {
            obj.y = parent.y + top;
        }
        console.log(parent, obj);
    };
}

//Attributes should be an object, like targetStrategys
function AttributeChooser(tPos, attributes, attributeName) {
    this.base = new baseObj(this, 15); //Should not hardcode zorder
    this.tPos = tPos;
        
    this.attributes = attributes;
    this.attributeName = attributeName;

    this.radioButtons = {};
    
    var radioButtons = this.radioButtons;
    var currentButton = null;
    for (var key in attributes) {
        var typeName = attributes[key].name;
        //Initial position doesn't matter, as we resize right away
        currentButton = new RadioButton(
            new temporalPos(0, 0, 0, 0),
            key, this, "setAttribute", key, currentButton);
        radioButtons[typeName] = currentButton;        
        this.base.addObject(currentButton);
    }

    this.added = function () {
        this.resize();
    };

    this.resize = function () {
        var tPos = this.tPos;
        var numAttributes = countElements(attributes);

        var eachHeight = tPos.h / (numAttributes);
        var eachWidth = tPos.w * 0.8;
        var radioButtons = this.radioButtons;

        var yPos = tPos.y;
        var xPos = tPos.x + tPos.w * 0.1;

        for (var key in radioButtons) {
            radioButtons[key].tPos.y = yPos;
            radioButtons[key].tPos.x = xPos;
            radioButtons[key].tPos.w = eachWidth;
            radioButtons[key].tPos.h = eachHeight;
            yPos += eachHeight;
        }
    }

    this.setAttribute = function (newValue) {
        var selected = this.base.rootNode.selectedObj;
        if (!selected)
            return;
        selected.attr[attributeName] = new this.attributes[newValue]();
    };

    this.loadAttribute = function () {
        var selected = this.base.rootNode.selectedObj;
        var attributeName = this.attributeName;
        if (!selected)
            return;

        for (var key in radioButtons) {
            if (!defined(selected.attr[attributeName])) {
                radioButtons[key].hidden = true;
                continue;
            }
            radioButtons[key].hidden = false;

            if (key == getRealType(selected.attr[attributeName]))
                radioButtons[key].pressed();
            else
                radioButtons[key].unpressed();
        }
    }
}

function Infobar(pos) {
    console.log("Infobar;;;")
	this.base = new baseObj(this, 14);
	this.tattr = null;

	this.tPos = pos;

	var buttonW = 100;

// 	this.base.addObject(new Docked().dockX(-1));

	this.attributeChoosers = {};	

	this.attributeChoosers.target_Strategy = new AttributeChooser(
            new temporalPos(pos.x, pos.y + 250, pos.w, 
                countElements(targetStrategies) * 28),
            targetStrategies,
            "target_Strategy");
	this.base.addObject(this.attributeChoosers.target_Strategy);
    
	this.attributeChoosers.attack_type = new AttributeChooser(
            new temporalPos(pos.x, pos.y + 250, pos.w,
                countElements(attackTypes) * 28),
            attackTypes,
            "attack_type");            
    //We will soon no longer let them choose their attack strategy!
	this.base.addObject(this.attributeChoosers.attack_type);


	this.attributeChoosers.bug_attack_type = new AttributeChooser(
            new temporalPos(pos.x, pos.y + 250, pos.w,
                countElements(bugAttackTypes) * 28),
            bugAttackTypes,
            "bug_attack_type");
	//We will soon no longer let them choose their attack strategy!
	this.base.addObject(this.attributeChoosers.bug_attack_type);


    //Add our buttons, should really be done just in the constructor with our given pos information
	this.added = function () {
	    //Std centered button position
	    this.upgradeb = new Button(
            new temporalPos(((width - bW) / 2) - (buttonW / 2) + bW, 200, buttonW, 30, 0),
            "Upgrade!", this.base.rootNode, "upgradeSel");
// 	    this.upgradeb.base.addObject(new Docked(0, 1, 1, 0));
	    this.base.addObject(this.upgradeb);

        this.clearDisplay();
        this.resize = Dock(this, "right", "top");
	};

	this.obj = null;
	this.updateAttr = function (obj) {
	    this.base.setAttributeRecursive("hidden", false);
	    this.tattr = obj.attr;
	    this.obj = obj;
	    for (var key in this.attributeChoosers)
	        this.attributeChoosers[key].loadAttribute();
	    return;
	}

	this.clearDisplay = function () {
	    this.base.setAttributeRecursive("hidden", true);
	}

	this.draw = function (pen) {
        console.log(this.tPos);
	    pen.fillStyle = "#000";
	    ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);

	    pen.fillStyle = "transparent";

	    pen.strokeStyle = "orange";
	    pen.lineWidth = 1;

	    ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);

	    pen.fillStyle = "#0f0";
	    pen.font = "15px courier";

	    var xs = this.tPos.x + 10;
	    var xe = this.tPos.x + this.tPos.w - 10;
	    var y = this.tPos.y + 15;

	    if (this.tattr == null) {
	        ink.text(xs, y, "[no selction]", pen);
	        return;
	    }

	    ink.text(xs, y, formatToDisplay(getRealType(this.obj)), pen);
	    var yPos = y + 20;
	    var xPos = xs;

	    pen.font = "10px courier";
	    for (attrName in this.tattr) {
	        var val = this.tattr[attrName];

	        function tryPrintAsNumber(val, name) {
	            if (typeof val != "number")
	                return false;

	            var valtxt = prefixNumber(val, 1);

	            var nametxt = formatToDisplay(name);

	            pen.textAlign = 'left';
	            ink.text(xPos, yPos, nametxt, pen);
	            pen.textAlign = 'right';
	            ink.text(xe, yPos, valtxt, pen);
	            yPos += 15;
	            return true;
	        }

	        if (!tryPrintAsNumber(val, attrName)) {
	            yPos += 5;

	            pen.textAlign = 'center';
	            pen.font = "14px courier";
	            ink.text((xs + xe) / 2, yPos, formatToDisplay(attrName), pen);
	            pen.font = "10px courier";
	            yPos += 20;
	            xPos += 5;

	            if (!defined(this.attributeChoosers[attrName])) {
	                pen.textAlign = 'left';
	                ink.text(xPos, yPos, formatToDisplay(getRealType(val)), pen);
	                yPos += 15;
	            }

	            for (var subAttr in val) {
	                tryPrintAsNumber(val[subAttr], subAttr);
	            }

	            //See if its an attribute which we have a attribute chooser for
	            if (defined(this.attributeChoosers[attrName])) {
	                this.attributeChoosers[attrName].tPos.y = yPos;
	                this.attributeChoosers[attrName].resize();
	                yPos += this.attributeChoosers[attrName].tPos.h;
	                yPos += 20; //idk really why this is needed
	            }

	            xPos -= 5;

	            //Even so we still need to position the attribute choosers
	        }

	    } //End of attribute loop

	    this.upgradeb.tPos.y = yPos;
	    yPos += 20;



	}             //End of draw
	console.log("End of infobar", this, pos);
}
