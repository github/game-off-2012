//KEEP THIS SHORT!
//IF THIS IS OVER 250 LINES THEN SPLIT IT INTO LOGICAL SECTIONS!

function hexPair(num) {
    num = Math.floor(num);
    return Math.min(Math.max(num, 16), 255).toString(16);
}

function swap(obj, one, two) {
    var temp = obj[one];
    obj[one] = obj[two];
    obj[two] = temp;
}

function mergeToArray(value, array) {
    if (nullOrUndefined(value))
        return array;

    if ((value.length === undefined || value.length !== 0)) {
        if (typeof value === "number") {
            array.push(value);
        } else if (value) {
            //This is probably the fastest way to check if it is probably an array, if it isn't and it has length... well then:
            //http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
            if (value.length !== undefined) {
                if (value.length > 0)
                    for (var key in value) //concat would mean when you call this you have to do arr = merg(val, arr)
                        array.push(value[key]);
            } else if (value) {
                array.push(value);
            }
        }
    }
    return array;
}


//Gets an element from object, or returns null if there are no objects
function getAnElement(object) {
    for (var key in object)
        return object[key];
    return null;
}

//Don't use this often! If you really need the count (length) you should keep track of it
function countElements(object) {
    var count = 0;
    for (var key in object)
        count++;
    return count;
}

function hasAtleastXElements(object, x) {
    if (!x)
        return true;

    for (var key in object) {
        x--;
        if (!x)
            return true;
    }

    return false;
}

function sortArrayByProperty(a, prop) {
    a.sort(cmp)
    function cmp(a, b) {
        // Avoid multiple object dereferences in
        // tight inner loop.
        var ap = a[prop];
        var bp = b[prop];
        if (ap < bp) {
            return -1;
        } else if (ap > bp) {
            return 1;
        } else {
            return 0;
        }
    }
}

//If given an object it turns a random key from it
function pickRandom(array) {
    if(!assertDefined(array.length))
        return;

    return array[Math.floor(Math.random() * array.length)];
}

function pickRandomKey(object) {
    var keys = [];
    for(var key in object)
        keys.push(key)
    return keys[Math.floor(Math.random() * keys.length)];
}

//I could make ones for every single color piece... but using regex to set
//RGBA is retarded and incredibly inefficient, so I am just copy and pasting
//an answer from stack overlow...
//http://stackoverflow.com/questions/8177964/in-javascript-how-can-i-set-rgba-without-specifying-the-rgb
function setAlpha(color, newAlpha) {
    if (!assertDefined(color, newAlpha))
        return;
    return color.replace(/[^,]+(?=\))/, newAlpha);
}

function getSel(obj) {
    return obj.base.rootNode.game.selection();
}

function getGame(obj) {
    return obj.base.rootNode.game;
}

function getEng(obj) {
    return obj.base.rootNode;
}

//Great debate here over this topic:
//http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
function cloneObject(object) {
    return jQuery.extend(true, {}, object);
}

function mergeObject(objectOne, objectTwo) {
    return jQuery.extend(true, objectOne, objectTwo);
}

function clamp(val, min, max) {
    //Like my code?
    if (isNaN(val))
        return min / 2 + max / 2;

    if (val < min) return min;
    else if (val > max) return max;
    else return val;
}


//makeTileFnc takes array[x], pen, Rect
function makeTiled(pen, makeTileFnc, array, boxBox, xNum, yNum, percentBuffer) {
    var width = boxBox.w / (xNum);
    var height = boxBox.h / (yNum);

    var xPos = boxBox.x + width * percentBuffer;
    var yPos = boxBox.y + height * percentBuffer;

    var drawnWidth = width * (1 - 2 * percentBuffer);
    var drawnHeight = height * (1 - 2 * percentBuffer);

    for (var key in array) {
        var value = array[key];
        if (xPos > boxBox.x + boxBox.w) {
            xPos = boxBox.x + width * percentBuffer;
            yPos += height;
        }

        if (makeTileFnc(value, pen, new Rect(xPos, yPos, drawnWidth, drawnHeight)))
            xPos += width;
    }
}

//This is reference code for Quentin, don't touch this code.
//This should really not be in here.
//Sorts arr by the given property (uses quickSort)
function sortArrayByPropertyCustom
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

// From http://fitzgeraldnick.com/weblog/26/ with slight modifications
function bind(thisCtx, name /*, variadic args to curry */) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function () {
        return thisCtx[name].apply(thisCtx, args.concat(Array.prototype.slice.call(arguments)));
    };
}

function loadScript(name) {
    var s = document.createElement('script')
    s.src = name + '.js';
    document.getElementById('scripts').appendChild(s);
}

function loadScripts(prefix, scripts) {
    for (var i = 0; i < scripts.length; i++) {
        loadScript(prefix + scripts[i]);
    }
}

// http://stackoverflow.com/questions/2607248/optimize-website-for-touch-devices
function isTouchDevice() {
   return "ontouchstart" in window;
}
