function Text() {
    var fontSize = 14;
    var font = fontSize + "px courier";
    var element = document.createElement('canvas')
    var c = element.getContext('2d');
    c.font = font;
    var lines = [];
    
    // Should we word wrap long lines to fit within the width
    // of the bounding rect? If no, resize() will return the
    // width actually used by the text, which may be greater
    // than the width given.
    var wrap = true;
    this.wrap = function (newWrap) {
        if (newWrap === undefined) {
            return wrap;
        }
        wrap = newWrap;
        return this;
    }
    
    // When shrink == true, fontSize is the size we would ideally
    // line to achieve, and curFontSize is the size we are forced
    // to render at to meet the constraints of our bounding rect.
    var curFontSize = fontSize;
    
    // Should we shrink the text size as required to fit within
    // the bounding rect? If yes, the text is always garuenteed
    // to fit within the bounding rect, but isn't always
    // gaurenteed to be readable!
    var shrink = true;
    this.shrink = function (newShrink) {
        if (newShrink === undefined) {
            return shrink;
        }
        shrink = newShrink;
        return this;
    }
    
    // The amount of space allocated for each line, as a function
    // of the font size. As lines are positioned in the center of
    // the space allocted for them, the space is evenly distributed
    // above and below each line (which really only matters for
    // the first and last lines.)
    var lineSpacing = 1;
    this.lineSpacing = function (newLineSpacing) {
        if (newLineSpacing === undefined) {
            return lineSpacing;
        }
        lineSpacing = newLineSpacing;
        return this;
    }
    
    // How should we align the text within the box? Currently
    // supported values are "left", "right", and "center".
    // Justified support is not provided by canvas natively,
    // at least to my knowledge, and I don't have internet
    // right now to google it.
    var align = "left";
    this.align = function (newAlign) {
        if (newAlign === undefined) {
            return align;
        }
        // I wish I could do array.contains or something,
        // but javascript doesn't have that natively, and
        // this works for now.
        if (align == "left") {
            align = newAlign;
        } else if (align == "right") {
            align = newAlign;
        } else if (align == "center") {
            align = newAlign;
        } else {
            throw "Invalid or unsuppored value '" + newAlign + "' for Text.align given.";
        }
        return this;
    }
    
    this.apply = function (pen) {
        pen.font = font;
        pen.fillStyle = "green";
        pen.textAlign = align;
        pen.textBaseline = "middle";
        
        var pos = this.tPos;
        var lineHeight = lineHeight();
        var x = pos.x + pos.w / 2;
        var y = pos.y;
        
        if (align == "center") {
            x += pos.w / 2;
        } else if (align == "right") {
            x += pos.w;
        }
        
        for (var i = 0; i < lines.length; i++) {
            y += lineHeight;
            pen.text(lines[i], x, y);
        }
    }
    
    this.resize = function (rect) {
        this.tPos = rect;
        if (shrink) {
            while (true) {
                
            }
        }
    }
    
    function fitText () {
        if (wrap) {
            lines = getLines(myCanvas, text, rect.w);
            rect.h = lineHeight() * (lines.length + 1);
            return rect;
        } else {
            rect.h = lineHeight();
            rect.w = ctx.measureText(text).width;
            return rect;
        }
        
    }
    
    function lineHeight () {
        return curFontSize * lineSpacing;
    }
    
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
}