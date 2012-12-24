// Pack a bunch of UI elements vertically.
function HBox() {
    this.base = new BaseObj(this, 15);
    this.tPos = new TemporalPos(0, 0, 0, 0);
    
    var children = [];
    
    // width is optional, if not given,
    // all children will have same width.
    this.add = function (ui, width) {
        children.push({ui: ui, width: width});
        this.base.addObject(ui);
    }
    
    this.resize = function (rect) {
        var w = 0;
        var shared = 0;
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (c.width) w += c.width;
            else shared++;
        }
        if (w > rect.w) {
            // Well... fuck.
            // Eventually we can handle this properly with requestResize, but for now... fuck it.
            throw "Attempting to make a hbox smaller than it's fixed size children allow!";
        }
        this.tPos = rect;
        
        var sharedWidth = (rect.w - w) / shared;
        var x = rect.x;
        for (i = 0; i < children.length; i++) {
            var c = children[i];
            var r = rect.clone();
            r.w = c.width || sharedWidth;
            r.x = x;
            x += r.w;
            c.ui.resize(r);
        }
    }
    
    this.globalResize = function(ev) {
        console.log(ev);
    }
}