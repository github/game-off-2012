
// Nobody knows what this is or does or if it works at all.
// Probably just best you move along.
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
