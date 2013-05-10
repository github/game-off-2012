// Not sure if this works right now.
// Here be dragons.
function RadioButton(pos, txt, cb, prevRadioButton) {
    this.tpos = pos;
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
        
        ink.rect(this.tpos.x, this.tpos.y, this.tpos.w, this.tpos.h, pen);
        
        //Draw text
        pen.fillStyle = "green";
        pen.font = textsize + "px arial";
        
        //How wide is text?
        var tW = pen.measureText(txt).width;
        
        ink.text(this.tpos.x+(this.tpos.w/2)-(tW/2), this.tpos.y+textsize+4, txt, pen);
        
        if (this.toggled) {
            pen.fillStyle = "white";
        } else {
            pen.fillStyle = "black";
        }
        pen.strokeStyle = "green";
        ink.circ(this.tpos.x + 6, this.tpos.y + 6, this.tpos.h - 12, pen);
        
        return;
    }
    
    this.mousemove = function() {
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