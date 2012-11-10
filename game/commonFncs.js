//KEEP THIS SHORT!
//IF THIS IS OVER 250 LINES THEN SPLIT IT INTO LOGICAL SECTIONS!

function merge(array, values) {
    if (values && values.length > 0)
        array = array.concat(values);
    return array;
}

//Gets distance to the rect, 0 if it is in rect
//Rect uses xs, xe, ys, ye structure
function distanceToRectSqr(rect, point) {
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

function sizeToBounds(size) {
    return { xs: size.x, ys: size.y, xe: size.x + size.w, ye: size.y + size.h };
}

function boundsToSize(bounds) {
    return { x: bounds.xs, y: bounds.ys, w: bounds.xe - bounds.xs, h: bounds.xe - bounds.xs };
}

function sortArrayByProperty
(
    arrObj,
    property
) {

    if (arrObj.length <= 1)
        return;

    sortArrayByPropertyPrivate(arrObj, 0, arrObj.length - 1, property);
}

function sortArrayByPropertyPrivate
(
    arrObj,
    startIndex,
    endIndex,
    property
) {
    var pivotPoint;

    if (startIndex + 1 == endIndex) {
        if (arrObj[startIndex][property] > arrObj[endIndex][property])
            swap(arrObj, startIndex, endIndex);
        return;
    }

    //Make the pivot point the median of the first middle and last
    //(also we do a bit of sorting here too)
    var middleIndex = Math.floor((startIndex + endIndex) / 2);
    if (arrObj[middleIndex][property] < arrObj[startIndex][property])
        swap(arrObj, middleIndex, startIndex);

    if (arrObj[endIndex][property] < arrObj[startIndex][property])
        swap(arrObj, endIndex, startIndex);

    if (arrObj[endIndex][property] < arrObj[middleIndex][property])
        swap(arrObj, endIndex, middleIndex);

    var pivotPoint = middleIndex;
    var pivotValue = arrObj[middleIndex][property];

    //Everything <= pivot is swapper to beginning, everything else is swapped to end

    var curPos = startIndex;
    var lessEnd = startIndex;
    var greaterStart = endIndex;

    //To prevent infinite recursion

    //< here instead of <= sorts it, but leaves lessEnd and greaterStart possibly wrong
    while (curPos <= greaterStart) {
        if (arrObj[curPos][property] < pivotValue) {
            if (curPos != lessEnd)
                swap(arrObj, curPos, lessEnd);

            curPos++;
            lessEnd++;
        }
        else if (arrObj[curPos][property] > pivotValue) {
            swap(arrObj, curPos, greaterStart--);
        }
        else {
            curPos++;
        }
    }

    greaterStart++;

    if (lessEnd - startIndex > 0)
        sortArrayByPropertyPrivate(arrObj, startIndex, lessEnd - 1, property);
    if (endIndex - greaterStart > 0)
        sortArrayByPropertyPrivate(arrObj, greaterStart, endIndex, property);
}