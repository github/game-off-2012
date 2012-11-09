//Quadtree (http://en.wikipedia.org/wiki/Quadtree)
//(well really more like a bsp... but quadtree has better pictures)
//This makes spatial based queries really fast (aka,
//closest to a point, everything within an area, etc)

//Eventually it will be modified:
//1) To hold z-index to allow for mouse click detection
//2) To be used to polygon hiding
//3) To also store polygons

//Input
    //Input is object containing types, which contain arrays of all the objects of that type
    //This makes say getting closest bug much faster (as we can ignore all non-bugs)!

    //Most nested object (bugOne, etc) must have boundingBox, which returns {x, y, w, h}
    //Ex: {bug:[bugOne, bugTwo, etc], tower:[towerOne, towerTwo]}

    //We take min/max X/Y parameters are sometimes you will know them and if you do...
    //it really really helps us. If not we will calculate them (BUT EITHER GIVE ALL OR NONE!)
    //ALSO min/max are of bounds of boxes! Not coords!

//Usage
    //Currently this will be generated every cycle...
    //theoretically you can generate a quadtree faster if you
    //use the old one... but im not implementing that unless it
    //is absolutely needed

//Side-effects
    //This WILL reorder arrObjs (like 99% of the time).

    //Currently types with no objects will crash us, so don't pass it!

//Speed concerns
    //If you type things, but do not query based on the types it will be slower.
    //Only type things if you intendent to query based on those types.


function QuadTree(arrObjs, minX, maxX, minY, maxY, splitThreshold, oneAxisSplitThreshold) {
    //Used in makeBranch
    splitThreshold = splitThreshold || 0.9;

    oneAxisSplitThreshold = oneAxisSplitThreshold || 4;

    this.objTrees = {};
    for (var type in arrObjs) {
        this.objTrees[type] = this.objTrees[type] || {};

        if (arrObjs[type].length == 0) {
            this.objTrees[type].tree = {};
            this.objTrees[type].tree.leaf = true;
            this.objTrees[type].tree.length = 0;
            this.objTrees[type].tree.startIndex = 0;
            this.objTrees[type].tree.EndIndex = 0;

            this.objTrees[type].array = arrObjs[type];
            continue;
        }

        if (!minX) {
            minX = arrObjs[type][0].boundingBox().x;
            maxX = arrObjs[type][0].boundingBox().x;
            minY = arrObjs[type][0].boundingBox().y;
            maxY = arrObjs[type][0].boundingBox().y;
            for (var index in arrObjs[type]) {
                {
                    //Ughh... I don't want to find min and max
                    var boundingBox = arrObjs[type][index].boundingBox();
                    if (boundingBox.x < minX)
                        minX = boundingBox.x;
                    if (boundingBox.y < minY)
                        minY = boundingBox.y;

                    if ((boundingBox.x + boundingBox.w) > maxX)
                        maxX = boundingBox.x + boundingBox.w;
                    if ((boundingBox.y + boundingBox.h) > maxY)
                        maxY = boundingBox.y + boundingBox.h;
                }
            }
        }

        var diagnostics = {};

        this.objTrees[type].tree = makeBranch
                                   (
                                       arrObjs[type],
                                       0, arrObjs[type].length,
                                       minX, maxX, false,
                                       minY, maxY, false,
                                       true,
                                       0,
                                       Math.ceil(Math.log(arrObjs[type].length) / Math.log(2) + 2)
                                   );

        buildDiagnostics(this.objTrees[type].tree, diagnostics, 1);

        diagnostics.weightedDepth /= arrObjs[type].length;

        diagnostics.averageLeafCount /= diagnostics.leafCount;

        this.objTrees[type].array = arrObjs[type];
    }

    function buildDiagnostics(quadtree, diagnostics, curDepth) {
        if (!quadtree)
            return;

        if (quadtree.leaf) {
            if (!diagnostics.weightedDepth)
                diagnostics.weightedDepth = 0;

            diagnostics.weightedDepth += curDepth * quadtree.length;

            if (!diagnostics.averageLeafCount)
                diagnostics.averageLeafCount = 0;

            diagnostics.averageLeafCount += quadtree.length;

            if (!diagnostics.leafCount)
                diagnostics.leafCount = 0;

            diagnostics.leafCount++;
        }
        else {
            buildDiagnostics(quadtree.lessTree, diagnostics, curDepth + 1);
            buildDiagnostics(quadtree.splitTree, diagnostics, curDepth + 1);
            buildDiagnostics(quadtree.greaterTree, diagnostics, curDepth + 1);
        }
            
    }

    
    //Might get a speed benefit in making two of these
    //END INDEX IS INCLUSIVE HERE!
    function sortByXAxis
    (
        arrObj,
        startIndex,
        endIndex
    ) {
        var pivotPoint;
        
        if(startIndex + 1 == endIndex)
        {
            if (arrObj[startIndex].x > arrObj[endIndex].x)
                swap(arrObj, startIndex, endIndex);
            return;
        }

        //Make the pivot point the median of the first middle and last
        //(also we do a bit of sorting here too)
        var middleIndex = Math.floor((startIndex + endIndex) / 2);
        if (arrObj[middleIndex].x < arrObj[startIndex].x)
            swap(arrObj, middleIndex, startIndex);

        if (arrObj[endIndex].x < arrObj[startIndex].x)
            swap(arrObj, endIndex, startIndex);

        if (arrObj[endIndex].x < arrObj[middleIndex].x)
            swap(arrObj, endIndex, middleIndex);            

        var pivotPoint = middleIndex;
        var pivotValue = arrObj[middleIndex].x;

        //Everything <= pivot is swapper to beginning, everything else is swapped to end

        var curPos = startIndex;
        var lessEnd = startIndex;
        var greaterStart = endIndex;

        //To prevent infinite recursion

        //< here instead of <= sorts it, but leaves lessEnd and greaterStart possibly wrong
        while (curPos <= greaterStart) {
            if (arrObj[curPos].x < pivotValue)
            {
                if(curPos != lessEnd)
                    swap(arrObj, curPos, lessEnd);

                curPos++;
                lessEnd++;
            }
            else if (arrObj[curPos].x > pivotValue)
            {
                swap(arrObj, curPos, greaterStart--);
            }
            else
            {
                curPos++;
            }
        }

        greaterStart++;

        if(lessEnd - startIndex > 0)
            sortByXAxis(arrObj, startIndex, lessEnd - 1);
        if(endIndex - greaterStart > 0)
            sortByXAxis(arrObj, greaterStart, endIndex);
    }
    function sortByYAxis
    (
        arrObj,
        startIndex,
        endIndex
    ) {
        var pivotPoint;

        if (startIndex + 1 == endIndex) {
            if (arrObj[startIndex].y > arrObj[endIndex].y)
                swap(arrObj, startIndex, endIndex);
            return;
        }

        //Make the pivot point the median of the first middle and last
        //(also we do a bit of sorting here too)
        var middleIndex = Math.floor((startIndex + endIndex) / 2);
        if (arrObj[middleIndex].y < arrObj[startIndex].y)
            swap(arrObj, middleIndex, startIndex);

        if (arrObj[endIndex].y < arrObj[startIndex].y)
            swap(arrObj, endIndex, startIndex);

        if (arrObj[endIndex].y < arrObj[middleIndex].y)
            swap(arrObj, endIndex, middleIndex);

        var pivotPoint = middleIndex;
        var pivotValue = arrObj[middleIndex].y;

        //Everything <= pivot is swapper to beginning, everything else is swapped to end

        var curPos = startIndex;
        var lessEnd = startIndex;
        var greaterStart = endIndex;

        //To prevent infinite recursion

        //< here instead of <= sorts it, but leaves lessEnd and greaterStart possibly wrong
        while (curPos <= greaterStart) {
            if (arrObj[curPos].y < pivotValue) {
                if (curPos != lessEnd)
                    swap(arrObj, curPos, lessEnd);

                curPos++;
                lessEnd++;
            }
            else if (arrObj[curPos].y > pivotValue) {
                swap(arrObj, curPos, greaterStart--);
            }
            else {
                curPos++;
            }
        }

        greaterStart++;

        if (lessEnd - startIndex > 0)
            sortByYAxis(arrObj, startIndex, lessEnd - 1);
        if (endIndex - greaterStart > 0)
            sortByYAxis(arrObj, greaterStart, endIndex);
    }

    function makeBranch
    (
//Array of all objects we are working on, we may reorder it, but 
//will only reorder it within startIndex and endIndex
        arrObj,
        startIndex, endIndex,
//The bounding box we are currently using... this is not really needed for collision (and is not stored and should not be stored unless someone can convince me it is needed)
//We just use these to quickly determine the split point, and decide when to stop splitting.
        minX, maxX, failedX,
        minY, maxY, failedY,
//Keeps track of the axis we should split on
        splitX,
        oneAxisSplitCount,
        expectedMaxDepth
    ) {
        var branch = {};
        branch.leaf = false;
        branch.bounds = { xs: minX, xe: maxX, ys: minY, ye: maxY };

        var length = endIndex - startIndex;

        branch.length = length;

        //Leaf
        if (length <= 1 || (failedX && failedY)) {
            if (oneAxisSplitCount > oneAxisSplitThreshold)
                var hmmShouldNotReallyHappen = 0;

            if (length >= 0) {
                //console.log("leaf size " + length + " out of " + arrObj.length);
                branch.leaf = true;
                //branch.objs = arrObj[startIndex];
                branch.startIndex = startIndex;
                branch.indexCount = endIndex - startIndex;
                //branch.endIndex = endIndex;                
            }
            else {
                alert("CRASHED! Have invalid ("+length+") length in tree!");
            }
        }
        //Branch
        else {
            var lessEnd = startIndex;
            var greaterStart = endIndex - 1;

            var curPos = startIndex;

            var splitPos = splitX ? minX + (maxX - minX) * 0.5 : minY + (maxY - minY) * 0.5;

            //Cur dimension and size
            var curDimen = splitX ? "x" : "y";
            var curSize = splitX ? "w" : "h";

            //First sort by the axis, in order to find the best split pos

            var realQuadTree = false;

            if (!realQuadTree) {
                if (splitX) {
                    sortByXAxis(arrObj, startIndex, endIndex - 1);

                    for (var i = startIndex; i < endIndex - 1; i++)
                        if (arrObj[i].x > arrObj[i + 1].x) {
                            var crap = true;
                            sortByXAxis(arrObj, startIndex, endIndex - 1);
                        }
                }
                else {
                    sortByYAxis(arrObj, startIndex, endIndex - 1);
                    for (var i = startIndex; i < endIndex - 1; i++)
                        if (arrObj[i].y > arrObj[i + 1].y) {
                            var crap = true;
                        }
                }

                splitPos = arrObj[(Math.floor((startIndex + endIndex) / 2))][curDimen];
            }

            //Man this code...
            var splitIndex = -1;
            if (oneAxisSplitCount == 0) {
                splitIndex = Math.floor(startIndex + length * 0.5);                
            } else if (oneAxisSplitCount == 1) {
                splitIndex = Math.floor(startIndex + length * 0.25);
            } else if (oneAxisSplitCount == 2) {
                splitIndex = Math.floor(startIndex + length * 0.75);
            } else if (oneAxisSplitCount == 3) {
                splitIndex = Math.floor(startIndex + length * 0.1);
            } else if (oneAxisSplitCount == 4) {
                splitIndex = Math.floor(startIndex + length * 0.9);
            }

            if (splitIndex + 1) {
                var middleBox = arrObj[splitIndex].boundingBox();
                splitPos = splitX ? middleBox.x : middleBox.y;

                //if (oneAxisSplitCount % 2 == 0)
                  //  splitPos += splitX ? middleBox.w : middleBox.h;

                if (expectedMaxDepth < 0) {
                    //console.log("nooo");
                    //Then we take the one we split by and add it to this part of the tree
                    //This prevents infinite recursion!
                    swap(arrObj, splitIndex, greaterStart--);
                    endIndex--;

                    branch.startIndex = splitIndex;
                    branch.indexCount = 1;
                }
            }

            branch.splitPos = splitPos;
            branch.splitX = splitX;
            
            //else {
                while (curPos <= greaterStart) {
                    var boundingBox = arrObj[curPos].boundingBox();

                    if ((boundingBox.x) < minX ||
                       (boundingBox.y) < minY ||
                       (boundingBox.x + boundingBox.w) > maxX ||
                       (boundingBox.y + boundingBox.h) > maxY) {
                        console.log("Object in quadtree out of bounds, insure your given range bounds all objects (not just their center point).");
                        return;
                    }

                    //Guaranteed to be entirely less than splitPos
                    if ((boundingBox[curDimen] + boundingBox[curSize]) <= splitPos) {
                        if(curPos != lessEnd)
                            swap(arrObj, curPos, lessEnd);
                        curPos++;lessEnd++;
                    }
                    //Guaranteed to be entirely greater than splitPos
                    else if ((boundingBox[curDimen]) >= splitPos) {
                        if (curPos != greaterStart)
                            swap(arrObj, curPos, greaterStart);
                        greaterStart--;
                    }
                    //It crosses the splitting line (likely), so we can't really do anything with it!
                    else
                        curPos++;
                }
            //}            

            //This is important!
            greaterStart++;

            //If too much is in a split... then this is not good, and if this happens
            //twice in a row (arbitrary quantity) then we stop splitting (in the future we will just do
            //different splitting techniques)
            /*
            if ((greaterStart - lessEnd) / (endIndex - startIndex) > splitThreshold) {
                if (splitX)
                    failedX = true;
                else
                    failedY = true;
            }
            */

            if ((lessEnd - startIndex) / length < 0.3 ||
               (endIndex - greaterStart) / length < 0.3) {
                var reallyBadSplit = true;
            }

            //How the ranges are now
            //startIndex <= less < lessEnd
            //lessEnd <= mixed < greaterStart
            //greaterStart <= greater < endIndex

            //Less branch
            if (startIndex != lessEnd)
                branch.lessTree = makeBranch(
                    arrObj, startIndex, lessEnd,
                    minX, splitX ? splitPos : maxX, false,
                    minY, !splitX ? splitPos : maxY, false,
                    !splitX,
                    0, expectedMaxDepth - 1);

            //Split branch
            if (oneAxisSplitCount >= oneAxisSplitThreshold) {
                if (lessEnd != greaterStart) {
                    if (splitX)
                        failedX = true;
                    else
                        failedY = true;
                    branch.splitTree = makeBranch(
                        arrObj, lessEnd, greaterStart,
                        minX, maxX, failedX,
                        minY, maxY, failedY,
                        !splitX,      //Give up, there is not a better axis
                        0, expectedMaxDepth - 1);
                }
            }
            else {
                if (lessEnd != greaterStart) {
                    if (splitX)
                        failedX = true;
                    else
                        failedY = true;
                    branch.splitTree = makeBranch(
                        arrObj, lessEnd, greaterStart,
                        minX, maxX, failedX,
                        minY, maxY, failedY,
                        !splitX,
                        oneAxisSplitCount + 1, expectedMaxDepth - 1);
                }
            }


            //Greater branch
            if (greaterStart != endIndex)
                branch.greaterTree = makeBranch(
                    arrObj, greaterStart, endIndex,
                    splitX ? splitPos : minX, maxX, false,
                    !splitX ? splitPos : minY, maxY, false,
                    !splitX,
                    0, expectedMaxDepth - 1);
        }

        return branch;
    }
}

//Gets distance to the rect, 0 if it is in rect
//Rect uses xs, xe, ys, ye structure
function distanceToRect(rect, point) {
    //This can be expanded more... but then it would be twice as long
    if (point.x >= rect.xs && point.x <= rect.xe)
    {
        if(point.y > rect.ye) //Right
             return point.y - rect.ye;

        if(point.y < rect.ys) //Left
            return rect.ys - point.y;

        //If not Right of Left, then we are inside
        return 0;
    }
    else if (point.y >= rect.ys && point.y <= rect.ye)
    {
        if(point.x > rect.xe) //Above (really below)
             return point.x - rect.xe;

        if(point.x < rect.xs) //Below (really above)
            return rect.xs - point.x;

        return 0;
    }
    else if (point.x > rect.xe && point.y > rect.ye)
    {
        return (point.x - rect.xe) * (point.y - rect.ye);
    }
    else if (point.x > rect.xe && point.y < rect.ys)
    {
        return (point.x - rect.xe) * (rect.ys - point.y);
    }
    else if (point.x < rect.xs && point.y > rect.ye)
    {
        return (rect.xs - point.x) * (point.y - rect.ye);
    }
    else if (point.x < rect.xs && point.y < rect.ys)
    {
        return (rect.xs - point.x) * (rect.ys - point.y);
    }

    return 0;
}

function sizeToBounds(size) {
    return { xs: size.x, ys: size.y, xe: size.x + size.w, ye: size.y + size.h };
}

//Input
    //As usually target needs x, y. We don't look at w or h yet so everything is just treated as point data.

//Notes

function findClosest(engine, type, target, maxDistance) {
    var relevantQuadTree = engine.curQuadTree.objTrees[type].tree;
    var relevantArray = engine.curQuadTree.objTrees[type].array;

    var totalChecks = 0;
    var placesCheck = [];

    var closestDiagnostics = true;

    var closest = findClosestPrivate(relevantQuadTree, target, relevantArray, maxDistance * maxDistance, true);

    if (totalChecks > 15)
        var iJustHidTheProblem = true;

    var duplicates = 0;

    if (closestDiagnostics) {
        for (var placeChecked in placesCheck) {
            if (relevantArray[placesCheck[placeChecked]].hover)
                duplicates++;
            //relevantArray[placesCheck[placeChecked]].hover = true;
        }
    }

    return closest;

    function findClosestPrivate(quadtree, target, array, minDisSquared) {
        if (!quadtree)
            return;

        //We should do this before we are called... and then we can do it much more efficiently
        //(not just because it reduces a function call), but then the code would be way bigger
        //and much more complex

        var minDis = distanceToRect(quadtree.bounds, target);

        if (isNaN(minDis)) {
            var crapola = true;
            minDis = distanceToRect(quadtree.bounds, target);
        }

        //Then it is impossible and we will never find a better collision
        if (minDis * minDis > minDisSquared)
            return null;

        
            //This is the brute force part of the algorithm

        //Find closest and return it
        var closestObj = null;

        for (var x = quadtree.startIndex; x < quadtree.startIndex + quadtree.indexCount; x++) {
            if (closestDiagnostics) {
                totalChecks++;
                placesCheck.push(x);
            }
            var curObj = array[quadtree.startIndex];
            var disSquared = distanceToRect(sizeToBounds(curObj.boundingBox()), target);
            disSquared *= disSquared;

            if (disSquared < minDisSquared) {
                minDisSquared = disSquared;
                closestObj = curObj;
            }
        }

        //We still might have objects on us if this is false, but if it is true
        //it means be have no branches
        if (quadtree.leaf)
            return closestObj;
        

        var curD = quadtree.splitX ? "x" : "y";

        //The rectangle in which we are in is the best bet... so we recurse down with that,
        var curClosest = null;

        if (target[curD] <= quadtree.splitPos)
            curClosest = findClosestPrivate(quadtree.lessTree, target, array, minDisSquared);
        else
            curClosest = findClosestPrivate(quadtree.greaterTree, target, array, minDisSquared);

        if (curClosest) {
            //Not possible, it would have been screened in the function call
            var newDisSquared = distanceToRect(sizeToBounds(curClosest.boundingBox()), target);
            newDisSquared *= newDisSquared;
            if (newDisSquared > minDisSquared)
                alert("no, impossible. findClosest ignored minDisSquared and returning something too far away.");
            //minDisSquared = distSqr(curClosest, target);
            minDisSquared = newDisSquared;
        }

        //Splits always must be compared :(
        curClosest = findClosestPrivate(quadtree.splitTree, target, array, minDisSquared) || curClosest;

        if (curClosest) {
            //Not possible, it would have been screened in the function call
            var newDisSquared = distanceToRect(sizeToBounds(curClosest.boundingBox()), target);
            newDisSquared *= newDisSquared;
            if (newDisSquared > minDisSquared)
                alert("no, impossible. findClosest ignored minDisSquared and returning something too far away.");
            //minDisSquared = distSqr(curClosest, target);
            minDisSquared = newDisSquared;
        }

        //If it is possible something in the other side of the split could be better.            
            //Just opposite of previous exclusion logic
        if (target[curD] > quadtree.splitPos)
            curClosest = findClosestPrivate(quadtree.lessTree, target, array, minDisSquared) || curClosest;
        else
            curClosest = findClosestPrivate(quadtree.greaterTree, target, array, minDisSquared) || curClosest;
            

        return curClosest;
    }
}

function drawTree(engine, type, pen) {
    drawBranch(engine.curQuadTree.objTrees[type].tree, pen);
}

function drawBranch(quadtree, pen) {
    if(!quadtree)
        return;

    ink.outlineRect(quadtree.bounds.xs, quadtree.bounds.ys,
        quadtree.bounds.xe - quadtree.bounds.xs, quadtree.bounds.ye - quadtree.bounds.ys, pen);

    drawBranch(quadtree.lessTree, pen);
    drawBranch(quadtree.splitTree, pen);
    drawBranch(quadtree.greaterTree, pen);
}

function distSqr(one, two) {
    if (!one || !two) {
        alert("crap");
    }

    return (one.x - two.x) * (one.x - two.x) + (one.y - two.y) * (one.y - two.y);
}


function swap(obj, one, two) {
    var temp = obj[one];
    obj[one] = obj[two];
    obj[two] = temp;
}