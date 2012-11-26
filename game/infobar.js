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

//Doesn't work... basically should calculate offsets to sides
//and then insure they are kept when resize is called.

//Docks its parent in reference to its grandparent (its parent's parent).
//For not docking is absolute... but it could just as easily be made percentage based (like a hybrid).
function Docked(dockedLeft, dockedRight, dockedTop, dockedBottom) {
    this.base = new baseObj(this);

    this.enabled = false;
    this.dockedLeft = dockedLeft;
    this.dockedRight = dockedRight;
    this.dockedTop = dockedTop;
    this.dockedBottom = dockedBottom;

    this.added = function () {
        if (this.base.parent && this.base.parent.base.parent)
            this.parentAdded();
    };

    this.parentAdded = function () {
        //dockingObject docks in reference to dockReference
        var dockReference = this.base.parent.base.parent.tPos;
        var dockingObject = this.base.parent.tPos;

        //Get original distances to from every side (and store them)
        this.leftDistance = dockingObject.x - dockReference.x;
        this.topDistance = dockingObject.y - dockReference.y;

        this.rightDistance = dockReference.w - this.leftDistance - dockingObject.w;
        this.bottomDistance = dockReference.h - this.topDistance - dockingObject.h;

        this.enabled = true;
    };

    this.resize = function () {
        var dockReference = this.base.parent.base.parent.tPos;
        var dockingObject = this.base.parent.tPos;

        //Insure original distances to every side our parent is docked on remains the same
        if (this.enabled) {
            if (this.dockedLeft)
                dockingObject.x = dockReference.x + this.leftDistance;

            if (this.dockedTop)
                dockingObject.y = dockReference.y + this.topDistance;

            if (this.dockedRight)
                dockingObject.x = dockReference.x + dockReference.w - this.rightDistance - dockingObject.w;
                //dockingObject.w = dockReference.w - this.leftDistance - this.rightDistance;

            if (this.dockedBottom)
                dockingObject.y = dockReference.y + dockReference.h - this.bottomDistance - dockingObject.h;
                //dockingObject.h = dockReference.h - this.topDistance - this.bottomDistance;
        }
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
            if (key == getRealType(selected.attr[attributeName]))
                radioButtons[key].pressed();
            else
                radioButtons[key].unpressed();
        }
    }
}

function Infobar(pos) {
	this.base = new baseObj(this, 14);
	this.tattr = null;

	this.tPos = pos;

	var buttonW = 100;

	this.base.addObject(new Docked(0, 1, 0, 0));

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

	this.base.addObject(this.attributeChoosers.attack_type);

    //Add our buttons, should really be done just in the constructor with our given pos information
	this.added = function () {
	    //Std centered button position
	    this.upgradeb = new Button(
            new temporalPos(((width - bW) / 2) - (buttonW / 2) + bW, 200, buttonW, 30, 0),
            "Upgrade!", this.base.rootNode, "upgradeSel");
	    this.upgradeb.base.addObject(new Docked(0, 1, 1, 0));
	    this.base.addObject(this.upgradeb);
	};

	this.updateAttr = function (obj) {
	    this.tattr = obj.attr;
        for(var key in this.attributeChoosers)
            this.attributeChoosers[key].loadAttribute();
	    return;
	}


	this.draw = function (pen) {
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

	    ink.text(xs, y, "Tower", pen);
	    var yPos = y + 20;
	    var xPos = xs;

	    pen.font = "10px courier";
	    for (attrName in this.tattr) {
	        var val = this.tattr[attrName];

	        function tryPrintAsNumber(val, name) {
	            if (typeof val != "number")
	                return false;

	            val = Math.round(val * 10) / 10;
	            var valtxt = prefixNumber(val);

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
	            ink.text((xs + xe) / 2, yPos, formatToDisplay(attrName), pen);
	            yPos += 15;
	            xPos += 5;
	            for (var subAttr in val) {
	                tryPrintAsNumber(val[subAttr], subAttr);
	            }
	            xPos -= 5;

	            //See if its an attribute which we have a attribute chooser for
	            if (defined(this.attributeChoosers[attrName])) {
	                this.attributeChoosers[attrName].tPos.y = yPos;
	                this.attributeChoosers[attrName].resize();
	                yPos += this.attributeChoosers[attrName].tPos.h;
	                yPos += 20; //idk really why this is needed
	            }

	            //Even so we still need to position the attribute choosers
	        }

	    } //End of attribute loop

	    this.upgradeb.tPos.y = yPos;
	    yPos += 20;



	}          //End of draw
}
