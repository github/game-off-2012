function RGBColor() {
    var r = 255;
    var g = 255;
    var b = 255;
    var a = 1.0;
    var str;
    var dirty = true;
    function validate(color) {
        return Math.max(Math.min(Math.floor(color), 255), 1);
    }
    this.r = function(newr) {
        r = validate(newr);
        dirty = true;
        return this;
    }
    this.g = function(newg) {
        g = validate(newg);
        dirty = true;
        return this;
    }
    this.b = function(newb) {
        b = validate(newb);
        dirty = true;
        return this;
    }
    this.a = function(newa) {
        a = Math.min(newa, 1);
        // Avoid scientific notation.
        if (a < 0.000001) a = 1;
        dirty = true;
        return this;
    }
    this.str = function() {
        if (!dirty) return str;
        str = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        dirty = false;
        return str;
    }
}

function HSLColor() {
    var h = 360;
    var s = 100;
    var l = 100;
    var a = 1.0;
    var str;
    var dirty = true;
    function percent(val) {
        return Math.max(Math.min(Math.floor(val), 100), 0);
    }
    this.h = function(newh) {
        if (newh === undefined) return h;
        h = (Math.floor(newh) + 360) % 360;
        dirty = true;
        return this;
    }
    this.s = function(news) {
        if (news === undefined) return s;
        s = percent(news);
        dirty = true;
        return this;
    }
    this.l = function(newl) {
        if (newl === undefined) return l;
        l = percent(newl);
        dirty = true;
        return this;
    }
    this.a = function(newa) {
        if (newa === undefined) return a;
        // Get rid of scientific notation.
        if (newa < 0.0000001) newa = 0;
        a = Math.max(Math.min(newa, 1), 0);
        dirty = true;
        return this;
    }
    this.str = function() {
        if (dirty) {
            str = "hsla(" + h + ", " + s + "%, " + l + "%, " + a + ")";
        }
        return str;
    }
}

// This function should really be done with HSLColor or RGBColor, but this works for now since everything is using strings for colors.
//Well this is all I need to do colors
function setColorPart(color, partNumber, partValue) {
    var functionParts = color.split("(");
    var functionName = functionParts[0];
    var args = functionParts[1].split(")")[0].split(",");

    args[partNumber] = partValue;

    var returnValue = functionName + "( ";

    var first = true;
    for (var key in args) {
        if (first) {
            first = false;
            returnValue += args[key];
        }
        else {
            returnValue += ", " + args[key];
        }
    }
    returnValue += ")";

    return returnValue;
}

function getInnerColorFromAttrs(attr) {
    return "pink";
}

function getOuterColorFromAttrs(attr) {
    return "yellow";
}