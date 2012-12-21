ink = {
    circ: function (x, y, r, pen) {
        if (!assertDefined(x, y, r, pen))
            return;

        pen.beginPath();
        pen.arc(x, y, r, 0, 2 * Math.PI, false);
        pen.closePath();
        pen.fill();
        pen.stroke();
    },
    outlineCirc: function (x, y, r, pen) {
        if (!assertDefined(x, y, r, pen))
            return;

        pen.beginPath();
        pen.arc(x, y, r, 0, 2 * Math.PI, false);
        pen.closePath();
        pen.stroke();
    },
    tri: function (x, y, width, height, pen) {
        if (!assertDefined(x, y, width, height, pen))
            return;

        pen.beginPath();
        pen.moveTo(x, y);
        pen.lineTo(x + width, y);
        pen.lineTo(x + (width / 2), y + height);
        pen.lineTo(x, y);
        pen.closePath();
        pen.fill();
        pen.stroke();
    },
    rect: function (x, y, width, height, pen) {
        if (!assertDefined(x, y, width, height, pen))
            return;

        pen.beginPath();
        pen.lineWidth = 2;
        pen.rect(x + 1, y + 1, width - 2, height - 2);
        pen.closePath();
        pen.fill();
        pen.stroke();
    },
    outlineRect: function (x, y, width, height, pen) {
        if (!assertDefined(x, y, width, height, pen))
            return;

        pen.beginPath();
        pen.moveTo(x, y);

        pen.lineTo(x + width, y);
        pen.lineTo(x + width, y + height);
        pen.lineTo(x, y + height);
        pen.lineTo(x, y);

        pen.closePath();
        pen.stroke();
    },
    line: function (x1, y1, x2, y2, pen) {
        if (!assertDefined(x1, y1, x2, y2, pen, pen.strokeStyle))
            return;

        pen.beginPath();
        pen.moveTo(x1, y1);
        pen.lineTo(x2, y2);
        pen.closePath();
        pen.stroke();
    },
    arrow: function (x1, y1, x2, y2, pen) {
        if (!assertDefined(x1, y1, x2, y2, pen, pen.strokeStyle))
            return;

        //http://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
        function canvas_arrow(context, fromx, fromy, tox, toy) {
            var headlen = 5;   // length of head in pixels
            var angle = Math.atan2(toy - fromy, tox - fromx);
            context.moveTo(fromx, fromy);
            context.lineTo(tox, toy);
            context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
            context.moveTo(tox, toy);
            context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        }

        pen.beginPath();
        canvas_arrow(pen, x1, y1, x2, y2);
        pen.stroke();
    },
    arrowHead: function (x1, y1, x2, y2, pen) {
        if (!assertDefined(x1, y1, x2, y2, pen, pen.strokeStyle))
            return;

        //http://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
        function canvas_arrow(context, fromx, fromy, tox, toy) {
            var headlen = 5;   // length of head in pixels
            var angle = Math.atan2(toy - fromy, tox - fromx);
            context.moveTo(fromx, fromy);
            context.moveTo(tox, toy);
            context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
            context.moveTo(tox, toy);
            context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        }

        pen.beginPath();
        canvas_arrow(pen, x1, y1, x2, y2);
        pen.stroke();
    },
    text: function (x, y, text, pen) {
        if (!assertDefined(x, y, text, pen))
            return;

        pen.beginPath();
        pen.fillText(text, x, y);
        pen.closePath();
        pen.stroke();
        pen.fill();
    },
    cenText: function (x, y, text, pen) {
        if (!assertDefined(x, y, text, pen))
            return;

        this.text(x - pen.measureText(text).width / 2, y, text, pen);
    }
};

DRAW = {
    circle: function(pen, centerPos, r, insideColor, borderWidth, borderColor) {
        DRAW.arc(pen, centerPos, r, 0, Math.PI * 2, insideColor, borderWidth, borderColor);
    },
    arc: function(pen, centerPos, r, angleStart, angleEnd, insideColor, borderWidth, borderColor) {

        if(borderWidth) {
            pen.lineWidth = borderWidth;
            pen.strokeStyle = borderColor;
        }
        else {
            pen.lineWidth = 0;
            pen.strokeStyle = "transparent";
        }

        pen.fillStyle = insideColor;

        pen.beginPath();
        pen.arc(centerPos.x, centerPos.y, r, angleStart, angleEnd, false);
        //pen.closePath();
        pen.fill();
        pen.stroke();
    },
    piePiece: function(pen, centerPos, r, angleStart, angleEnd, insideColor, borderWidth, borderColor) {
        pen.lineWidth = borderWidth;
        pen.strokeStyle = borderColor;

        pen.fillStyle = insideColor;

        pen.beginPath();
        pen.arc(centerPos.x, centerPos.y, r, angleStart, angleEnd, false);
        pen.lineTo(centerPos.x, centerPos.y);
        pen.closePath();
        pen.fill();
        pen.stroke();
    },
    rect: function(pen, rect, insideColor, borderWidth, borderColor) {
        if(borderWidth) {
            pen.lineWidth = borderWidth;
            pen.strokeStyle = borderColor;
        }
        else {
            pen.lineWidth = 0;
            pen.strokeStyle = "transparent";
        }

        pen.fillStyle = insideColor;

        pen.beginPath();
        pen.rect(rect.x + borderWidth / 2, rect.y + borderWidth / 2,
                 rect.w - borderWidth, rect.h - borderWidth);
        pen.fill();
        pen.stroke();
    }
};