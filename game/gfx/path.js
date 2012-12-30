// Path represents a series of graphical operations to be batched
// together in a single canvas operation.
function Path() {
    var things = [];
    
    this.rect = function (rect) {
        things.push(["rect", rect.x, rect.y, rect.w, rect.h]);
        return this;
    }
    
    this.moveTo = function (p) {
        things.push(["moveTo", p.x, p.y]);
        return this;
    }
    
    this.lineTo = function (p1, p2, p3 /*, More points */) {
        for (var i = 0; i < args.length; i++) {
            things.push(["lineTo", args[i].x, args[i].y]);
        }
        return this;
    }
    
    this.arcTo = function (p1, p2, r) {
        things.push(["arcTo", p1.x, p1.y, p2.x, p2.y, r]);
        return this;
    }
    
    this.arc = function (p, r, startAngle, endAngle) {
        things.push(["arc", p.x, p.y, r, startAngle, endAngle]);
        return this;
    }
    
    this.closePath = function () {
        things.push(["closePath"]);
        return this;
    }
    
    // apply this series of operations to the given canvas
    // context.
    this.apply = function (c) {
        for (var i = 0; i < things.length; i++) {
            c[things[0]](things.slice(1));
        }
        return this;
    }
}