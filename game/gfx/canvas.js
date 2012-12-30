function Canvas() {
    var element = document.createElement('canvas');
    var c = element.getContext('2d');
    var pos;
    
    this.resize = function (rect) {
        pos = rect.origin();
        element.width = rect.w;
        element.height = rect.h;
        return this;
    }
    
    this.drawTo = function (otherCanvas) {
        otherCanvas.drawImage(c, pos.x, pos.y);
    }
    
    // Required for drawTo to work properly on the canvas
    // class in addition to "raw" canvas contexts.
    this.drawImage = function (img, x, y) {
        c.drawImage(img, x, y);
    }
    
    this.stroke = function (path, color, width) {
        c.beginPath();
        path.apply(c);
        c.lineWidth = width;
        c.strokeStyle = color && color.str ? color.str() : color;
        c.stroke();
    }
    
    this.fill = function (path, color) {
        c.beginPath();
        path.apply(c);
        c.fillStyle = color && color.str ? color.str() : color;
        c.fill();
    }
}