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


//Currently types with no objects will crash us, so don't pass it!

//Speed concerns
//If you type things, but do not query based on the types it will be slower.
//Only type things if you intendent to query based on those types.


function QuadTree(arrObjs, splitThreshold) {

    //This will cause undefined behaviour is given object is not in
    //our quadtree, or never has been removed from a quadtree.
    this.removeFromTree = function (obj) {
        if (!assertDefined("removeFromTree", obj, obj.base))
            return;

        if (!obj.tpos)
            return;

        delete obj.base.quadNode.ids[obj.base.id];
    };

    this.addToTree = function (obj) {
        if (!assertDefined("addToTree", obj, obj.base))
            return;

        if (!obj.tpos)
            return;

        var type = obj.base.type;
        if (!this.objTrees[type]) {
            this.objTrees[type] = {};
            this.objTrees[type].tree = {};
            this.objTrees[type].tree.numberContained = 1;
            this.objTrees[type].tree.leaf = true;
            this.objTrees[type].tree.ids = {};
            this.objTrees[type].tree.ids[obj.base.id] = true; //Could be set to false even
            this.objTrees[type].tree.bounds = obj.tpos;

            obj.base.quadNode = this.objTrees[type].tree;
        } else {
            var mostBoundingNode = this.objTrees[type].tree;

            //Returns false if a path is no good, true if it is
            function findMostBoundingNode(tree, obj) {
                if (!tree) {
                    return;
                }

                if (minVecFullOverlapRects(obj.tpos, tree.bounds).magSq() > 0) {
                    return false;
                }

                mostBoundingNode = tree;

                if (findMostBoundingNode(tree.lessTree, obj)) {
                    return true;
                }

                if (findMostBoundingNode(tree.greaterTree, obj)) {
                    return true;
                }

                if (findMostBoundingNode(tree.splitTree, obj)) {
                    return true;
                }

                //If none return true, but we bound the object, we are the most bounding!
                return true;
            }

            findMostBoundingNode(mostBoundingNode, obj);

            mostBoundingNode.ids[obj.base.id] = true;
            obj.base.quadNode = mostBoundingNode;
        }
    };

    //Used in makeBranch
    splitThreshold = splitThreshold || 0.9;

    this.objTrees = {};
    for (var type in arrObjs) {
        this.objTrees[type] = this.objTrees[type] || {};

        var idKey = [];
        var i = 0;
        for (var key in arrObjs[type]) {
            arrObjs[type][key].zoffset = i++;
            idKey.push(arrObjs[type][key].base.id);
        }

        //We can't index stuff without box
        if (idKey.length == 0 || !arrObjs[type][idKey[0]].tpos) {
            this.objTrees[type].tree = {};
            this.objTrees[type].tree.leaf = true;
            this.objTrees[type].tree.numberContained = 0;
            this.objTrees[type].tree.ids = {};
            this.objTrees[type].tree.bounds = {x: 0, y:0, w:0, h:0};
            continue;
        }
        
        minX = arrObjs[type][idKey[0]].tpos.x;
        maxX = arrObjs[type][idKey[0]].tpos.x;
        minY = arrObjs[type][idKey[0]].tpos.y;
        maxY = arrObjs[type][idKey[0]].tpos.y;
        for (var key in arrObjs[type]) {            
            //Ughh... I don't want to find min and max
            var boundingBox = arrObjs[type][key].tpos;
            if (boundingBox.x < minX) minX = boundingBox.x;
            if (boundingBox.y < minY) minY = boundingBox.y;

            if ((boundingBox.x + boundingBox.w) > maxX) {
                maxX = boundingBox.x + boundingBox.w;
            }
            if ((boundingBox.y + boundingBox.h) > maxY) {
                maxY = boundingBox.y + boundingBox.h;
            }
        }        
        
        this.objTrees[type].tree = makeBranch
                                   (
                                       arrObjs[type],
                                       idKey,
                                       0, idKey.length,
                                       minX, maxX, false,
                                       minY, maxY, false,
                                       true,
                                       0,
                                       splitThreshold,
                                       Math.ceil(Math.log(idKey.length) / Math.log(2) + 2),
                                       1
                                   );
       
    }

    function makeBranch
    (
        arrObj,
        idKey,
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
        if (curDepth > 1000)
            fail("WTF, stack overflow now");

        var branch = {};
        branch.leaf = false;
        branch.bounds = { x: minX, w: maxX - minX, y: minY, h: maxY - minY };
        
        var length = endIndex - startIndex;

        branch.numberContained = length;

        if (DFlag.quadtreeDiagnostics) {
            for (var i = startIndex; i < endIndex; i++) {
                if (minVecFullOverlapRects(arrObj[idKey[i]].tpos, branch.bounds).magSq() > 0) {
                    fail("Bounds not respected in quadtree!");
                }
            }
        }

        //Leaf
        if (length <= 1 || (failedX && failedY)) {
            if (DFlag.quadtree) {
                DFlag.quadtree.leafCount++;
                DFlag.quadtree.leafDepthWeighted += curDepth * length;
                DFlag.quadtree.leafObjectCount += length;
            }

            if (length >= 0) {
                branch.leaf = true;
                branch.ids = {};
                for (var i = startIndex; i < endIndex; i++) {
                    arrObj[idKey[i]].base.quadNode = branch;
                    branch.ids[idKey[i]] = true; //Could be set to false even
                }
            } else {
                fail("CRASHED! Have invalid (" + length + ") length in tree!");
            }
            return branch;
        }
    
        var lessEnd = startIndex;
        var greaterStart = endIndex - 1;

        var curPos = startIndex;

        var splibox = splitX ? minX + (maxX - minX) * 0.5 : minY + (maxY - minY) * 0.5;

        //Cur dimension and size
        var curDimen = splitX ? "x" : "y";
        var curSize = splitX ? "w" : "h";

        //First sort by the axis, in order to find the best split pos            
        //Uncomment out this time to guarentee good results, now we kinda just take random stuff.
        //sortByAxis(arrObj, startIndex, endIndex - 1, curDimen);

        var splitIndex = (Math.floor((startIndex + endIndex) / 2));            

        splibox = arrObj[idKey[splitIndex]].tpos[curDimen];

        if(DFlag.quadtreeDiagnostics) {
            for (var i = startIndex; i < endIndex - 1; i++) {
                if (arrObj[idKey[i]].tpos[curDimen] > arrObj[idKey[i + 1]].tpos[curDimen]) {
                    fail("sort failed");
                }
            }
        }           

        branch.splibox = splibox;
        branch.splitX = splitX;

        //Take the item at splitIndex and put it at the current level (prevents stack overflow)
        swap(idKey, splitIndex, greaterStart);
        branch.ids = {};
        branch.ids[idKey[greaterStart]] = true;            
        greaterStart--;endIndex--;

        while (curPos <= greaterStart) {
            var boundingBox = arrObj[idKey[curPos]].tpos;

            if ((boundingBox.x) < minX ||
                    (boundingBox.y) < minY ||
                    (boundingBox.x + boundingBox.w) > maxX ||
                    (boundingBox.y + boundingBox.h) > maxY) {
                console.log("Object in quadtree out of bounds, insure your given range bounds all objects (not just their center point).");
                return;
            }

            if ((boundingBox[curDimen] + boundingBox[curSize]) <= splibox) {
                // Guaranteed to be entirely less than splibox
                if (curPos != lessEnd) {
                    swap(idKey, curPos, lessEnd);
                }
                curPos++;
                lessEnd++;
            } else if ((boundingBox[curDimen]) >= splibox) {
                // Guaranteed to be entirely greater than splibox
                if (curPos != greaterStart) {
                    swap(idKey, curPos, greaterStart);
                }
                greaterStart--;
            } else {
                // It crosses the splitting line (likely), so we can't really do anything with it!
                curPos++;
            }
        }

        //This is important!
        greaterStart++;


        //If too much is in a split... then this is not good, and if this happens
        //twice in a row (arbitrary quantity) then we stop splitting (in the future we will just do
        //different splitting techniques)            
        if ((greaterStart - lessEnd) / (endIndex - startIndex) > splitThreshold) {
            if (splitX) failedX = true;
            else failedY = true;
        }
                    
        //How the ranges are now
        //startIndex <= less < lessEnd
        //lessEnd <= mixed < greaterStart
        //greaterStart <= greater < endIndex

        //Less branch
        if (startIndex != lessEnd) {
            branch.lessTree = makeBranch(
                arrObj, idKey, startIndex, lessEnd,
                minX, splitX ? splibox : maxX, false,
                minY, !splitX ? splibox : maxY, false,
                !splitX,
                splitThreshold, expectedMaxDepth, curDepth + 1);
        }
    
        //Split branch
        if (lessEnd != greaterStart) {
            if (splitX) failedX = true;
            else failedY = true;
            
            branch.splitTree = makeBranch(
                arrObj, idKey, lessEnd, greaterStart,
                minX, maxX, failedX,
                minY, maxY, failedY,
                !splitX,
                splitThreshold, expectedMaxDepth, curDepth + 1);
        }
        
        //Greater branch
        if (greaterStart != endIndex) {
            branch.greaterTree = makeBranch(
                arrObj, idKey, greaterStart, endIndex,
                splitX ? splibox : minX, maxX, false,
                !splitX ? splibox : minY, maxY, false,
                !splitX,
                splitThreshold, expectedMaxDepth, curDepth + 1);
        }

        return branch;
    }

    // END INDEX IS INCLUSIVE HERE!
    function sortByAxis
    (
        arrObj,
        startIndex,
        endIndex,
        axis
    ) {
        var pivotPoint;

        if (startIndex + 1 == endIndex) {
            if (arrObj[startIndex].tpos[axis] > arrObj[endIndex].tpos[axis]) {
                swap(arrObj, startIndex, endIndex);
            }
            return;
        }

        //Make the pivot point the median of the first middle and last
        //(also we do a bit of sorting here too)
        var middleIndex = Math.floor((startIndex + endIndex) / 2);
        if (arrObj[middleIndex].tpos[axis] < arrObj[startIndex].tpos[axis]) {
            swap(arrObj, middleIndex, startIndex);
        }

        if (arrObj[endIndex].tpos[axis] < arrObj[startIndex].tpos[axis]) {
            swap(arrObj, endIndex, startIndex);
        }

        if (arrObj[endIndex].tpos[axis] < arrObj[middleIndex].tpos[axis]) {
            swap(arrObj, endIndex, middleIndex);
        }

        var pivotPoint = middleIndex;
        var pivotValue = arrObj[middleIndex].tpos[axis];

        //Everything <= pivot is swapper to beginning, everything else is swapped to end

        var curPos = startIndex;
        var lessEnd = startIndex;
        var greaterStart = endIndex;

        //< here instead of <= sorts it, but leaves lessEnd and greaterStart possibly wrong
        while (curPos <= greaterStart) {
            if (arrObj[curPos].tpos[axis] < pivotValue) {
                if (curPos != lessEnd) {
                    swap(arrObj, curPos, lessEnd);
                }

                curPos++;
                lessEnd++;
            } else if (arrObj[curPos].tpos[axis] > pivotValue) {
                swap(arrObj, curPos, greaterStart--);
            } else {
                curPos++;
            }
        }

        greaterStart++;

        if (lessEnd - startIndex > 0) {
            sortByAxis(arrObj, startIndex, lessEnd - 1, axis);
        }
        if (endIndex - greaterStart > 0) {
            sortByAxis(arrObj, greaterStart, endIndex, axis);
        }
    }
}