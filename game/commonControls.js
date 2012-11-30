function Button(pos, txt, context, functionName, callData, zorder) {
    this.tPos = pos;

    if (!zorder)
        zorder = 15;

    this.base = new BaseObj(this, zorder);
    this.base.type = "Button" + zorder;
	var textsize = 14;

	this.hover = false;
	this.down = false;
	
	this.context = context;
    this.functionName = functionName;
    this.callData = callData;

    txt = formatToDisplay(txt);

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
        //this.resize = Dock(this, "none", "center");
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

function Label(pos, text) {
    this.tPos = pos;
    this.base = new BaseObj(this, 15);
    this.color = "red";
    this.font = "12px arial";
    var textsize = 14;

    this.text = formatToDisplay(text);

    this.draw = function (pen) {
        //Draw text
        pen.fillStyle = this.color;
        pen.font = this.font;

        ink.text(this.tPos.x, this.tPos.y, this.text, pen);
        return;
    }

    this.mouseover = function () {
        this.hover = true;
    };

    this.mouseout = function () {
        this.hover = false;
    };

    this.mousedown = function () {
        this.down = true;
    };

    this.mouseup = function () {
        this.down = false;
    };
}

function RadioButton(pos, txt, context, functionName, callData, prevRadioButton){
    this.tPos = pos;
	this.base = new BaseObj(this, 15);
	var textsize = 14;

	this.hover = false;
	this.down = false;

	txt = formatToDisplay(txt);

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
        
    };
}

//Attributes should be an object, like targetStrategys
function AttributeChooser(tPos, attributes, attributeName) {
    this.base = new BaseObj(this, 15); //Should not hardcode zorder
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
            new TemporalPos(0, 0, 0, 0),
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