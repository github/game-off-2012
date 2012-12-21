function TextWrapper(text, zorder) {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    if (!zorder) zorder = 15;
    this.base = new BaseObj(this, zorder, true);
    
    var fontSize = 14;
    var font = fontSize + "px courier";
    var myCanvas = document.createElement('canvas').getContext('2d');
    myCanvas.font = font;
    var lines = [];
        
    //http://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
    //Set font before you call this.
    function getLines(ctx, phrase, maxPxLength) {
        var wa = phrase.split(" "),
        phraseArray = [],
        lastPhrase = wa[0],
        l = maxPxLength,
        measure = 0;
        
        for (var i = 1; i < wa.length; i++) {
            var w = wa[i];
            measure = ctx.measureText(lastPhrase + w).width;
            if (measure < l) {
                lastPhrase += (" " + w);
            } else {
                phraseArray.push(lastPhrase);
                lastPhrase = w;
            }
            if (i === wa.length - 1) {
                phraseArray.push(lastPhrase);
                break;
            }
        }
        return phraseArray;
    }
    
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
    }
    
    this.resize = function (rect) {
        this.tPos = rect;
        lines = getLines(myCanvas, text, rect.w);
        var lineHeight = fontSize;
        var h = lineHeight * (lines.length + 1);
        this.tPos.h = h;
    }
}