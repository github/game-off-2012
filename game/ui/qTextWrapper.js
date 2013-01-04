//This is slow but I don't care... it does what I want to and I will rewrite it if it becomes a problem
function QTextWrapper(pos, text, zorder, scaleVertically) {
    this.box = pos;
    this.base = new BaseObj(this, zorder, true);

    this.scaleVertically = scaleVertically;

    this.text = text;
    this.color = "green";
    this.fontSize = 12;
    this.fontType = "courier";
    this.textAlign = "left";
    this.lineSpacing = 1;

    this.lastHeight = null;

    this.draw = function (pen) {
        pen.fillStyle = this.color;
        pen.font = this.fontSize + "px " + this.fontType;
        pen.textAlign = this.textAlign;

        var pos = this.box;

        var lines = getWrappedLines(pen, this.text, pos.w);
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
            this.base.parent.box.h = curHeight;
        }
    }

    this.getHeightBuffer = function(lines) {
        var pos = this.box;

        var textHeight = this.fontSize * this.lineSpacing;

        var realHeightUsed = lines.length * textHeight;
        return (pos.h - realHeightUsed) / 2 - textHeight * 0.2;
    }
}