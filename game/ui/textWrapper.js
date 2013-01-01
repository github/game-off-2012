function TextWrapper(text, zorder) {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    if (!zorder) zorder = 15;
    this.base = new BaseObj(this, zorder, true);
    
    var fontSize = 14;
    var font = fontSize + "px courier";
    var myCanvas = document.createElement('canvas').getContext('2d');
    myCanvas.font = font;
    var lines = [];

    this.draw = function (pen) {
        pen.font = font;
        pen.fillStyle = "green";
        pen.textAlign = "center";
        pen.textBaseline = "middle";
        
        var pos = this.tPos;
        var lineHeight = fontSize;
        var curX = pos.x + pos.w / 2;
        var curY = pos.y;
        
        for (var i = 0; i < lines.length; i++) {
            curY += lineHeight;
            ink.text(curX, curY, lines[i], pen);
        }
    };
    
    this.resize = function (rect) {
        this.tPos = rect;
        lines = getWrappedLines(myCanvas, text, rect.w);
        var lineHeight = fontSize;
        var h = lineHeight * (lines.length + 1);
        this.tPos.h = h;
    };
}