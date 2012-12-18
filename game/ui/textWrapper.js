function TextWrapper(pos, text, zorder, scaleVertically) {
    this.tPos = pos;
    this.base = new BaseObj(this, zorder, true);
    
    this.scaleVertically = scaleVertically;
    
    this.text = text;
    this.color = "green";
    this.fontSize = 12;
    this.fontType = "Arial";
    this.textAlign = "left";
    this.lineSpacing = 1;
    
    this.lastHeight = null;
    
    this.draw = function (pen) {
        pen.fillStyle = this.color;
        pen.font = this.fontSize + "px " + this.fontType;
        pen.textAlign = this.textAlign;
        
        var pos = this.tPos;
        
        var lines = getLines(pen, this.text, pos.w);
        var textHeight = this.fontSize * this.lineSpacing;
        
        var curX = pos.x;
        var curY = pos.y;
        
        if (this.textAlign == "center") {
            curX += pos.w / 2;
        }
        
        var heightBuffer = this.getHeightBuffer(lines);
        
        curY += heightBuffer;
        
        for (var key in lines) {
            curY += textHeight;
            ink.text(curX, curY, lines[key], pen);
        }
        
        curY += heightBuffer;
        
        var curHeight = textHeight * (lines.length + 1);
        
        if(this.scaleVertically && curHeight != this.lastHeight) {
            this.lastHeight = curHeight;
            pos.h = curHeight;
            this.base.parent.tPos.h = curHeight;
        }
    }
    
    this.getHeightBuffer = function(lines) {
        var pos = this.tPos;
        
        var textHeight = this.fontSize * this.lineSpacing;
        
        var realHeightUsed = lines.length * textHeight;
        return (pos.h - realHeightUsed) / 2 - textHeight * 0.2;
    }
}