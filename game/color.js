function Color() {
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