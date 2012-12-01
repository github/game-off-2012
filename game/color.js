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
    // Someone should do this.
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

    //Range - logarithmic

    //Damage - gradient

    //Hp - gradient

    //Att speed - logarithmic

    var hue = 0;
    var saturation = 0;
    var lightness = 0;
    var alpha = 0;

    //att speed - lightness
    //hue =  


    hue = clamp(hue % 360, 0, 360);
    saturation = clamp(saturation, 0, 1);
    lightness = clamp(lightness, 0, 1);
    alpha = clamp(alpha, 0, 1);
    return "hsl(" + hue + "," + saturation + "," + lightness + "," + alpha + ")";
}

function getOuterColorFromAttrs(attr) {
    return "yellow";
}