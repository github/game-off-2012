function Vector(x, y) {
    this.x = x;
    this.y = y;

    this.magSq = function () {
        return this.x * this.x + this.y * this.y;
    };

    this.setMag = function (mag) {
        var curMag = Math.sqrt(this.x * this.x + this.y * this.y);
        if (curMag) {
            this.x /= curMag;
            this.y /= curMag;
        }

        this.x *= mag;
        this.y *= mag;
    }

    this.subtract = function (otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
    }
    this.add = function (otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
    }
}

function sizeToBounds(size) {
    return { xs: size.x, ys: size.y, xe: size.x + size.w, ye: size.y + size.h };
}

function boundsToSize(bounds) {
    return { x: bounds.xs, y: bounds.ys, w: bounds.xe - bounds.xs, h: bounds.xe - bounds.xs };
}

//Gets distance to the rect, 0 if it is in rect
//Rect uses xs, xe, ys, ye structure
function distanceToRectSq(rect, point) {
    var xDistance;
    var yDistance;

    if (point.x >= rect.xe)
        xDistance = point.x - rect.xe;
    else if (point.x <= rect.xs)
        xDistance = rect.xs - point.x;
    else
        xDistance = 0;

    if (point.y >= rect.ye)
        yDistance = point.y - rect.ye;
    else if (point.y <= rect.ys)
        yDistance = rect.ys - point.y;
    else
        yDistance = 0;

    return xDistance * xDistance + yDistance * yDistance;
}

function vecToRect(rect, point) {
    var distance = new Vector(0, 0);

    rect = sizeToBounds(rect);

    if (point.x >= rect.xe)
        distance.x = rect.xe - point.x;
    else if (point.x <= rect.xs)
        distance.x = rect.xs - point.x;
    else
        distance.x = 0;

    if (point.y >= rect.ye)
        distance.y = rect.ye - point.y;
    else if (point.y <= rect.ys)
        distance.y = rect.ys - point.y;
    else
        distance.y = 0;

    return distance;
}

//Basically just the minimum vec between the vertices of one and two
function vecBetweenRects(rectOne, rectTwo) {
    var distance1 = vecToRect(rectOne, new Vector(rectTwo.x, rectTwo.y));
    var distance2 = vecToRect(rectOne, new Vector(rectTwo.x + rectTwo.w, rectTwo.y));
    var distance3 = vecToRect(rectOne, new Vector(rectTwo.x, rectTwo.y + rectTwo.h));
    var distance4 = vecToRect(rectOne, new Vector(rectTwo.x + rectTwo.w, rectTwo.y + rectTwo.h));

    var minimum = distance1;

    if (distance2.magSq() < minimum.magSq())
        minimum = distance2;

    if (distance3.magSq() < minimum.magSq())
        minimum = distance3;

    if (distance4.magSq() < minimum.magSq())
        minimum = distance4;

    return minimum;
}

//Basically just the maximum vec between the vertices of one and two
function distBetweenRectsFullOverlap(rectOne, rectTwo) {
    var distance1 = vecToRect(rectOne, new Vector(rectTwo.x, rectTwo.y));
    var distance2 = vecToRect(rectOne, new Vector(rectTwo.x + rectTwo.w, rectTwo.y));
    var distance3 = vecToRect(rectOne, new Vector(rectTwo.x, rectTwo.y + rectTwo.h));
    var distance4 = vecToRect(rectOne, new Vector(rectTwo.x + rectTwo.w, rectTwo.y + rectTwo.h));

    var maximum = distance1;

    if (distance2.magSq() > maximum.magSq())
        maximum = distance2;

    if (distance3.magSq() > maximum.magSq())
        maximum = distance3;

    if (distance4.magSq() > maximum.magSq())
        maximum = distance4;

    return maximum;
}

//Circle is defined as the bounds on the circle
function distBetweenRectAndCircle(rect, circleCenter, r) {
    if (!r)
        console.log("vecBetweenRectAndCircle called with r==0, you don't want this.");
    var vec = vecToRect(rect, circleCenter);

    var dist = Math.sqrt(vec.magSq()) - r;

    if (dist < 0)
        dist = 0;

    return dist;
}