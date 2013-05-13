function Canvas() {
    var element = document.createElement('canvas');
    var c = element.getContext('2d');
    var pos = new Vector(0, 0);

    this.resize = function (rect) {
        pos = rect.origin();
        element.width = rect.w;
        element.height = rect.h;
        return this;
    }

    this.moveTo = function (newOrigin) {
        pos = newOrigin;
        return this;
    }

    this.drawTo = function (otherCanvas) {
    // Without this, integer values end up doing sub-pixel
    // rendering. Who knows what the W3C was thinking?
    // See http://diveintohtml5.info/canvas.html#paths

    // I can't seem to get this translate code to work, so
    // I'm just manually translating for now. Good luck if
    // you can get it to work!
//     c.translate(0.5, 0.5);
//     c.setTransform(1, 0, 0, 1, 0.5, 0.5);

        if (pos.w == 0 || pos.h == 0) {
            throw "Attempting to draw a canvas with area zero, this is probably a bug. Did you forget to resize it first?";
        }
        otherCanvas.drawImage(element, pos.x, pos.y);
    }

    // Required for drawTo to work properly on the canvas
    // class in addition to "raw" canvas contexts.
    this.drawImage = function (img, x, y) {
        c.drawImage(img, x, y);
    }

    this.stroke = function (path, color, width) {
        c.beginPath();
        path.apply(c, "stroke");
        c.lineWidth = width;
        c.strokeStyle = color && color.str ? color.str() : color;
        c.stroke();
    }

    this.fill = function (path, color) {
        c.beginPath();
        path.apply(c, "fill");
        c.fillStyle = color && color.str ? color.str() : color;
        c.fill();
    }

    // Try not to use this!
    this.ctx = function () {
        return c;
    }
}
