ink = {
    circ : function(x, y, r, pen) {
        pen.beginPath();
        pen.arc(x, y, r, 0, 2 * Math.PI, false);
        pen.closePath();
        pen.fill();
        pen.stroke();
    },
    rect : function(x, y, width, height, pen) {
        pen.beginPath();
        pen.fillRect(x, y, width, height);
        pen.rect(x + 1, y + 1, width - 2, height - 2);
        pen.closePath();
        pen.fill();
        pen.stroke();
    },
    line : function(x1, y1, x2, y2, pen) {
        pen.beginPath();
        pen.moveTo(x1, y1);
        pen.lineTo(x2, y2);
        pen.closePath();
        pen.stroke();
    },
    text : function (x, y, text, pen) {
        pen.beginPath();
        pen.fillText(text, x, y);
        pen.closePath();
        pen.stroke();
        pen.fill();
    },
    cenText : function(x, y, text, pen) {
        this.text(x - pen.measureText(text).width / 2, y, text, pen);
    }
};