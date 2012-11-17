//KEEP THIS SHORT!
//IF THIS IS OVER 250 LINES THEN SPLIT IT INTO LOGICAL SECTIONS!

function hexPair(num) {
    return Math.min(Math.max(num, 16), 255).toString(16);
}

function swap(obj, one, two) {
    var temp = obj[one];
    obj[one] = obj[two];
    obj[two] = temp;
}

function mergeToArray(value, array) {
    if (typeof value !== "undefined") {
        if (value && value.constructor.name == "Array") {
            if (value.length > 0)
                for (var key in value) //concat would mean when you call this you have to do arr = merg(val, arr)
                    array.push(value[key]);
        }
        else if (value || typeof value === "number")
            array.push(value);
    }
    return array;
}

//This should really not be in here.
//Sorts arr by the given property (uses quickSort)
function sortArrayByProperty
(
    arrObj,
    property
) {

    if (arrObj.length <= 1)
        return;

    sortArrayByPropertyPrivate(arrObj, 0, arrObj.length - 1, property);

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
}