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