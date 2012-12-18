function Button(pos, text, context, functionName, callData, zorder) {
    this.tPos = pos;

    if (!zorder)
        zorder = 15;

    this.base = new BaseObj(this, zorder, true);
    
    this.hover = false;
    this.down = false;
    
    this.context = context;
    this.functionName = functionName;
    this.callData = callData;
    
    // What the fuck?
    text = formatToDisplay(text);

    this.textControl = new TextWrapper(pos, text, zorder + 1);
    this.textControl.textAlign = "center";
    this.base.addObject(this.textControl);

    this.update = function () {
        this.textControl.tPos = cloneObject(this.tPos);
        this.textControl.tPos.x += 10;
        this.textControl.tPos.w -= 20;

        if (this.textsize)
            this.textControl.fontSize = this.textsize;
        if (this.color)
            this.textControl.color = this.color;
    }

    this.draw = function(pen) {
        //Draw box
        if (this.down) {
            pen.fillStyle = "#333";
        } else if (this.hover) {
            pen.fillStyle = "#111";
        } else {
            pen.fillStyle = "black";
        }
        pen.strokeStyle = "green";
        
        ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
    }
    
    this.added = function() {
        //this.resize = Dock(this, "none", "center");
    }
    

    this.click = function() {
        if(this.context && this.context[this.functionName])
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

function TextBox(pos, text, color, fillColor, zorder) {
    this.tPos = pos;

    if (!zorder)
        zorder = 15;

    this.base = new BaseObj(this, zorder, true);

    this.hover = false;
    this.down = false;

    this.color = color;
    this.fillColor = fillColor;

    this.textControl = new TextWrapper(pos, text, zorder + 1);
    this.textControl.textAlign = "center";
    this.base.addObject(this.textControl);

    this.update = function () {
        this.textControl.tPos = cloneObject(this.tPos);
        this.textControl.tPos.x += 10;
        this.textControl.tPos.w -= 20;

        if (this.color)
            this.textControl.color = this.color;
    }

    this.draw = function(pen) {
        //Draw box
        if (this.down) {
            pen.fillStyle = "#333";
        } else if (this.hover) {
            pen.fillStyle = "#111";
        } else {
            pen.fillStyle = "black";
        }
        pen.fillStyle = this.fillColor;
        pen.strokeStyle = this.color;
        ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
    }

    this.added = function() {
        //this.resize = Dock(this, "none", "center");
    }


    this.click = function() {
        if(this.context && this.context[this.functionName])
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

function Label(pos, text, zorder) {
    if (!zorder)
        zorder = 15;

    this.tPos = pos;
    this.base = new BaseObj(this, zorder);
    this.type = "Label" + zorder;
    this.color = "red";
    this.font = "12px courier";

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

// Not sure if this works right now.
// Here be dragons.
function RadioButton(pos, txt, cb, prevRadioButton) {
    this.tPos = pos;
    this.base = new BaseObj(this, 15);
    var textsize = 14;

    this.hover = false;
    this.down = false;

    if (prevRadioButton) {
        this.radioGroup = prevRadioButton.radioGroup;
    } else {
        this.radioGroup = [];
    }
    this.radioGroup.push(this);
    
    this.toggled = false;
    
    this.toggle = function() {
        if (this.toggled) {
            this.unpressed();
            return;
        }
        
        this.pressed();
        
        for (var key in this.radioGroup) {
            if (this.radioGroup[key] != this) {
                this.radioGroup[key].unpressed();
            }
        }
    };
    
    this.pressed = function() {
        this.toggled = true;
        cb();
    };
    
    this.unpressed = function() {
        this.toggled = false;
    };

    this.addButtonToGroup = function(button) {
        this.radioGroup.push(button);
    };
    
    this.draw = function(pen) {
        if (this.down) {
            pen.fillStyle = "#333";
        } else if (this.hover) {
            pen.fillStyle = "#111";
        } else {
            pen.fillStyle = "black";
        }
        pen.strokeStyle = "green";
        
        ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
        
        //Draw text
        pen.fillStyle = "green";
        pen.font = textsize + "px arial";

        //How wide is text?
        var tW = pen.measureText(txt).width;

        ink.text(this.tPos.x+(this.tPos.w/2)-(tW/2), this.tPos.y+textsize+4, txt, pen);
        
        if (this.toggled) {
            pen.fillStyle = "white";
        } else {
            pen.fillStyle = "black";
        }
        pen.strokeStyle = "green";
        ink.circ(this.tPos.x + 6, this.tPos.y + 6, this.tPos.h - 12, pen);
        
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

// Will allow the creation of toggleable buttons
// Not functional currently.
function ToggleButton(pos, txt, cb) {
    this.tPos = pos;
    this.base = new BaseObj(this, 15);
    
    var textsize = 14;
    var hover = false;
    var down = false;
    
    this.toggled = false;
    this.toggle = function() {
        this.toggled = !this.toggled;
        cb();
    };
    
    this.mouseover = function() {
        hover = true;
    };
    
    this.mouseout = function() {
        hover = false;
    };
    
    this.mousedown = function() {
        down = true;
    };
    
    this.mouseup = function() {
        down = false;
        this.toggle();
    };
    
    this.draw = function(pen) {
        if (this.down) {
            pen.fillStyle = "#333";
        } else if (this.hover) {
            pen.fillStyle = "#111";
        } else {
            pen.fillStyle = "black";
        }
        pen.strokeStyle = "green";
        
        ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
        
        //Draw text
        pen.fillStyle = "green";
        pen.font = textsize + "px arial";

        //How wide is text?
        var tW = pen.measureText(txt).width;

        ink.text(this.tPos.x+(this.tPos.w/2)-(tW/2), this.tPos.y+textsize+4, txt, pen);
        
        if (this.toggled) {
            pen.fillStyle = "white";
        } else {
            pen.fillStyle = "black";
        }
        pen.strokeStyle = "green";
        ink.rect(this.tPos.x + 6, this.tPos.y + 6, this.tPos.h - 12, this.tPos.h - 12, pen);
        
        return;
    }
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
        var selected = getSel(this);
        if (!selected)
            return;
        selected.attr[attributeName] = new this.attributes[newValue]();
    };

    this.loadAttribute = function () {
        var selected = getSel(this);
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
