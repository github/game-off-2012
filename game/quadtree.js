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


function QuadTree(arrObjs, splitThreshold) {
    //Used in makeBranch
    splitThreshold = splitThreshold || 0.9;

    this.objTrees = {};
    for (var type in arrObjs) {
        this.objTrees[type] = this.objTrees[type] || {};

        if (arrObjs[type].length == 0) {
            this.objTrees[type].tree = {};
            this.objTrees[type].tree.leaf = true;
            this.objTrees[type].tree.length = 0;
            this.objTrees[type].tree.startIndex = 0;
            this.objTrees[type].tree.endIndex = 0;
            this.objTrees[type].tree.bounds = {};
            this.objTrees[type].tree.bounds.x = 0;
            this.objTrees[type].tree.bounds.y = 0;
            this.objTrees[type].tree.bounds.w = 0;
            this.objTrees[type].tree.bounds.h = 0;

            this.objTrees[type].array = arrObjs[type];
            continue;
        }


        minX = arrObjs[type][0].tPos.boundingBox().x;
        maxX = arrObjs[type][0].tPos.boundingBox().x;
        minY = arrObjs[type][0].tPos.boundingBox().y;
        maxY = arrObjs[type][0].tPos.boundingBox().y;
        for (var index in arrObjs[type]) {
            {
                //Ughh... I don't want to find min and max
                var boundingBox = arrObjs[type][index].tPos.boundingBox();
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
        

        this.objTrees[type].tree = makeBranch
                                   (
                                       arrObjs[type],
                                       0, arrObjs[type].length,
                                       minX, maxX, false,
                                       minY, maxY, false,
                                       true,
                                       0,
                                       splitThreshold,
                                       Math.ceil(Math.log(arrObjs[type].length) / Math.log(2) + 2),
                                       1
                                   );

        this.objTrees[type].array = arrObjs[type];
    }

    //END INDEX IS INCLUSIVE HERE!
    function sortByAxis
    (
        arrObj,
        startIndex,
        endIndex,
        axis
    ) {
        var pivotPoint;

        if (startIndex + 1 == endIndex) {
            if (arrObj[startIndex].tPos[axis] > arrObj[endIndex].tPos[axis])
                swap(arrObj, startIndex, endIndex);
            return;
        }

        //Make the pivot point the median of the first middle and last
        //(also we do a bit of sorting here too)
        var middleIndex = Math.floor((startIndex + endIndex) / 2);
        if (arrObj[middleIndex].tPos[axis] < arrObj[startIndex].tPos[axis])
            swap(arrObj, middleIndex, startIndex);

        if (arrObj[endIndex].tPos[axis] < arrObj[startIndex].tPos[axis])
            swap(arrObj, endIndex, startIndex);

        if (arrObj[endIndex].tPos[axis] < arrObj[middleIndex].tPos[axis])
            swap(arrObj, endIndex, middleIndex);

        var pivotPoint = middleIndex;
        var pivotValue = arrObj[middleIndex].tPos[axis];

        //Everything <= pivot is swapper to beginning, everything else is swapped to end

        var curPos = startIndex;
        var lessEnd = startIndex;
        var greaterStart = endIndex;

        //< here instead of <= sorts it, but leaves lessEnd and greaterStart possibly wrong
        while (curPos <= greaterStart) {
            if (arrObj[curPos].tPos[axis] < pivotValue) {
                if (curPos != lessEnd)
                    swap(arrObj, curPos, lessEnd);

                curPos++;
                lessEnd++;
            }
            else if (arrObj[curPos].tPos[axis] > pivotValue) {
                swap(arrObj, curPos, greaterStart--);
            }
            else {
                curPos++;
            }
        }

        greaterStart++;

        if (lessEnd - startIndex > 0)
            sortByAxis(arrObj, startIndex, lessEnd - 1, axis);
        if (endIndex - greaterStart > 0)
            sortByAxis(arrObj, greaterStart, endIndex, axis);
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
        splitThreshold,
        expectedMaxDepth,
        curDepth
    ) {
        var branch = {};
        branch.leaf = false;
        branch.bounds = { x: minX, w: maxX - minX, y: minY, h: maxY - minY };
        
        var length = endIndex - startIndex;

        branch.length = length;

        //Leaf
        if (length <= 1 || (failedX && failedY)) {

            if (DFlag.quadtree) {
                DFlag.quadtree.leafCount++;
                DFlag.quadtree.leafDepthWeighted += curDepth * length;
                DFlag.quadtree.leafObjectCount += length;
            }

            if (length >= 0) {
                branch.leaf = true;
                branch.startIndex = startIndex;
                branch.indexCount = endIndex - startIndex;
            }
            else {
                fail("CRASHED! Have invalid (" + length + ") length in tree!");
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
            sortByAxis(arrObj, startIndex, endIndex - 1, curDimen);

            splitPos = arrObj[(Math.floor((startIndex + endIndex) / 2))][curDimen];

            if(DFlag.quadtreeDiagnostics)
            {
                for (var i = startIndex; i < endIndex - 1; i++) {
                    if (arrObj[i].tPos[curDimen] > arrObj[i + 1].tPos[curDimen]) {
                        fail("sort failed");
                    }
                }
            }           

            branch.splitPos = splitPos;
            branch.splitX = splitX;
            
            while (curPos <= greaterStart) {
                var boundingBox = arrObj[curPos].tPos.boundingBox();

                if ((boundingBox.x) < minX ||
                       (boundingBox.y) < minY ||
                       (boundingBox.x + boundingBox.w) > maxX ||
                       (boundingBox.y + boundingBox.h) > maxY) {
                    console.log("Object in quadtree out of bounds, insure your given range bounds all objects (not just their center point).");
                    return;
                }

                //Guaranteed to be entirely less than splitPos
                if ((boundingBox[curDimen] + boundingBox[curSize]) <= splitPos) {
                    if (curPos != lessEnd)
                        swap(arrObj, curPos, lessEnd);
                    curPos++; lessEnd++;
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

            //This is important!
            greaterStart++;


            //If too much is in a split... then this is not good, and if this happens
            //twice in a row (arbitrary quantity) then we stop splitting (in the future we will just do
            //different splitting techniques)            
            if ((greaterStart - lessEnd) / (endIndex - startIndex) > splitThreshold) {
                if (splitX)
                    failedX = true;
                else
                    failedY = true;
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
                    splitThreshold, expectedMaxDepth, curDepth + 1);
        
            //Split branch
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
                    splitThreshold, expectedMaxDepth, curDepth + 1);
            }
            
            //Greater branch
            if (greaterStart != endIndex)
                branch.greaterTree = makeBranch(
                    arrObj, greaterStart, endIndex,
                    splitX ? splitPos : minX, maxX, false,
                    !splitX ? splitPos : minY, maxY, false,
                    !splitX,
                    splitThreshold, expectedMaxDepth, curDepth + 1);
        }

        return branch;
    }
}