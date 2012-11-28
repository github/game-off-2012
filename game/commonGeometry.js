//For all functions:
    //rect in x, y, w, h format
    //point in x, y format
    //circle is in bounding rect format

//getCircleCenter
    //function getCircleCenter(circle)
    //Returns the vector of the center of a circle

//vectorToRect
    //function vecToRect(rect, point, vector) 
    //Gets the Vector from the a rect to a point.    
    //Caveats
        //If point is in rect then it returns Vector(0, 0).
        //If vector is given, then it will fill in vector and return that)

//minimumVectorBetweenRects
    //function minVecBetweenRects(rectOne, rectTwo) 
    //Gets the minimum vector from rectOne to rectTwo

//minimumVectorUntilFullOverlapRects
    //function minVecFullOverlapRects(rectOne, rectTwo)
    //Gets the minimum vector for rectOne to be fully overlapped by rectTwo
    //Caveats
        //Its behaviour is undefined if rectOne cannot be fully overlapped by rectTwo

//vectorBetweenRectAndCircle
    //function vecBetweenRectAndCircle(rect, circle)
    //Circle is defined as the bounding rect of circle


/********************************* CODE START *********************************/

//Returns the vector of the center of a circle
function getCircleCenter(circle) {
    return new Vector(circle.x + circle.w / 2, circle.y + circle.h / 2);
}

//Returns the vector of the center of a rect
//Should merge this and getCircleCenter into one function. This is here for clarity only
function getRectCenter(rect) {
    return new Vector(rect.x + rect.w / 2, rect.y + rect.h / 2);
}

function assertRectangle(rect) {
    return assertDefined("assertRectangle", rect, rect.x, rect.y, rect.w, rect.h);
}

//Gets the Vector from the a rect to a point.    
    //Caveats
        //If point is in rect then it returns Vector(0, 0).
        //If vector is given, then it will fill in vector and return that)
function vecToRect(point, rect, vector) {
    if (!assertDefined("vecToRect", rect, point) || !assertRectangle(rect))
        return new Vector(0, 0);

    if(!vector)
        vector = new Vector(0, 0);

    if (point.x > (rect.x + rect.w))
        vector.x = (rect.x + rect.w) - point.x;
    else if (point.x < rect.x)
        vector.x = rect.x - point.x;
    else
        vector.x = 0;

    if (point.y > (rect.y + rect.h))
        vector.y = (rect.y + rect.h) - point.y;
    else if (point.y < rect.y)
        vector.y = rect.y - point.y;
    else
        vector.y = 0;

    return vector;
}

//Gets the minimum vector from rectOne to rectTwo
//Basically just the minimum vec between the vertices of one and two
function minVecBetweenRects(rectOne, rectTwo) {
    if (!assertDefined("minVecBetweenRects", rectOne, rectTwo) ||
        !assertRectangle(rectOne) || !assertRectangle(rectTwo))
        return new Vector(0, 0);

    var distance1 = vecToRect(new Vector(rectOne.x, rectOne.y), rectTwo);
    var distance2 = vecToRect(new Vector(rectOne.x + rectOne.w, rectOne.y), rectTwo);
    var distance3 = vecToRect(new Vector(rectOne.x, rectOne.y + rectOne.h), rectTwo);
    var distance4 = vecToRect(new Vector(rectOne.x + rectOne.w, rectOne.y + rectOne.h), rectTwo);

    var minimum = distance1;

    if (distance2.magSq() < minimum.magSq())
        minimum = distance2;

    if (distance3.magSq() < minimum.magSq())
        minimum = distance3;

    if (distance4.magSq() < minimum.magSq())
        minimum = distance4;

    return minimum;
}

//Gets the minimum vector for rectOne to be fully overlapped by rectTwo
//Its behaviour is undefined if rectOne cannot be fully overlapped by rectTwo
function minVecFullOverlapRects(rectOne, rectTwo) {
    if (!assertDefined("minVecFullOverlapRects", rectOne, rectTwo) ||
        !assertRectangle(rectOne) || !assertRectangle(rectTwo))
        return new Vector(0, 0);

    var distance1 = vecToRect(new Vector(rectOne.x, rectOne.y), rectTwo);
    var distance2 = vecToRect(new Vector(rectOne.x + rectOne.w, rectOne.y), rectTwo);
    var distance3 = vecToRect(new Vector(rectOne.x, rectOne.y + rectOne.h), rectTwo);
    var distance4 = vecToRect(new Vector(rectOne.x + rectOne.w, rectOne.y + rectOne.h), rectTwo);

    var maximum = distance1;

    if (distance2.magSq() > maximum.magSq())
        maximum = distance2;

    if (distance3.magSq() > maximum.magSq())
        maximum = distance3;

    if (distance4.magSq() > maximum.magSq())
        maximum = distance4;

    return maximum;
}

//Circle is defined as the bounding rect of circle
function vecBetweenRectAndCircle(circle, circle) {
    if (!assertDefined("vecBetweenRectAndCircle", rect, circle) ||
        !assertRectangle(rect) || !assertRectangle(circle))
        return new Vector(0, 0);

    var vec = vecToRect(getCircleCenter(circle), rect);

    if (vec.magSq() < circle.w * circle.w)
        return new Vector(0, 0);
    else
        return dist;
}
