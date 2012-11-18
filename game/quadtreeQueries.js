//object means: object.(baseObj)base


//findClosest
    //What it do:
        //Finds the closest object (within maxDistance) to target.
        //(Returns null if nothing is found) 

    //Input
        //engine.(QuadTree)curQuadTree
        //type is .type of the object you want to query for.
        //target.x and target.y (position of the place you are finding the closest to)
        //maxDistance means the object returned must be <= maxDistance away (so 0 is fine)

    //function findClosest(engine, type, target, maxDistance)


//findAllWithin
    //What it do:
        //Finds the all the objects within a certain radius of target.

    //Input
        //engine.(QuadTree)curQuadTree
        //type is type of the object you want to query for.
        //target.x and target.y (position of the base point)
        //maxDistance means the objects returned must be <= maxDistance away (so 0 is fine)

    //function findAllWithin(engine, type, target, maxDistance)


//DEBUG
    //function drawTree(engine, type, pen)


/********************************* CODE START *********************************/


function findClosest(engine, type, target, maxDistance) {
    if (!assertDefined("findClosest", engine, type, target))
        return null;

    if (!engine.curQuadTree.objTrees[type])
        return null;

    var relevantQuadTree = engine.curQuadTree.objTrees[type].tree;
    var relevantArray = engine.base.allChildren[type];

    var within = [];

    if (DFlag.logn && DFlag.logn.findClosest)
        DFlag.logn.findClosest.max += relevantArray.length;

    var realClosest = null;
    var realClosDisSq = maxDistance * maxDistance;
    for (var x = 0; x < relevantArray.length; x++) {
        returnedObj = relevantArray[x];

        var disSquared = vecToRect(target, returnedObj.tPos).magSq();

        if (disSquared <= realClosDisSq) {
            realClosest = returnedObj;
            realClosDisSq = disSquared;
        }
    }

    var closest = findClosestGeneric(relevantQuadTree, relevantArray,
        function (splitX, axisPos) {
            if (splitX) {
                if (axisPos > (target.x + target.w))
                    return 1;
                else if (axisPos < target.x)
                    return -1;
                else
                    return 0;
            }
            else {
                if (axisPos > (target.y + target.h))
                    return 1;
                else if (axisPos < target.y)
                    return -1;
                else
                    return 0;
            }
        },
        function (rect) {
            return vecToRect(target, rect).magSq();
        },
        maxDistance * maxDistance, true);

    return closest;
}


function findAllWithin(engine, type, target, maxDistance) {
    if (!assertDefined("findAllWithin", engine, type, target))
        return null;

    if (!engine.curQuadTree.objTrees[type])
        return null;

    var relevantQuadTree = engine.curQuadTree.objTrees[type].tree;
    var relevantArray = engine.base.allChildren[type];
    
    var within = [];

    if (DFlag.logn && DFlag.logn.findAllWithin)
        DFlag.logn.findAllWithin.max += relevantArray.length;

    findClosestGeneric(relevantQuadTree, relevantArray, 
        function (splitX, axisPos) 
        {
            if(splitX)
            {
                if(axisPos > (target.x + target.w))
                    return 1;
                else if(axisPos < target.x)
                    return -1;
                else
                    return 0;
            }
            else
            {
                if(axisPos > (target.y + target.h))
                    return 1;
                else if(axisPos < target.y)
                    return -1;
                else
                    return 0;
            }
        },
        function(rect)
        {
            return vecToRect(target, rect).magSq();
        },
        maxDistance * maxDistance, false, within);

    return within;
}

//Don't use findClosestGeneric if you don't know how it works!

//MaxDistance can greatly reduce our time, especially if you just
//want to use this to find intersections instead of closest.

//targetFunction returns a number when given a bool specifing the axis
//(true for x, false for y) and the position on that axis.
//targetFunction returns -ve numbers if the target is below that axis
//+ve numbers if it is above and 0 if it intersecting the axis.

//Target distance returns the distance (squared) from the target to a given rect.
function findClosestGeneric(quadtree, array, targetFunction, targetDistance, minDisSquared,
                            onlyFindOne, returned) {
    if (!quadtree) //Not error checking, just being lazy about the recursive calls in this function
        return;

    //We should do this before we are called... and then we can do it much more efficiently
    //(not just because it reduces a function call), but then the code would be way bigger
    //and much more complex

    var minDisSqrBounds = targetDistance(quadtree.bounds);

    //Then it is impossible and we will never find a better collision
    if (minDisSqrBounds > minDisSquared)
        return null;

    var closestObj = null;

    if (DFlag.logn && DFlag.logn.findClosestGeneric) {
        DFlag.logn.findClosestGeneric.total += quadtree.indexCount;
    }

    function recalcClosest() {
        if (onlyFindOne && returnedObj) {
            closestObj = returnedObj;
            minDisSquared = targetDistance(returnedObj.tPos);
        }
    }

    //This is the brute force part of the algorithm
    for (var id in quadtree.ids) {
        returnedObj = array[id];

        if (!returnedObj) {
            continue; //THIS SHOULDN'T HAPPEN! IT IS EVIDENCE OF A BUG!
        }

        var disSquared = targetDistance(returnedObj.tPos);

        if (disSquared <= minDisSquared) {
            if (onlyFindOne) {
                closestObj = returnedObj;
                minDisSquared = disSquared;
            }
            else {
                returned.push(returnedObj);
            }
        }
    }

    //We still might have objects on us if this is false, but if it is true
    //it means be have no branches
    if (quadtree.leaf)
        return onlyFindOne ? closestObj : null;

    var curD = quadtree.splitX ? "x" : "y";

    var splitNumber = targetFunction(quadtree.splitX, quadtree.splitPos);


    //splitNumber determines query order
    if (splitNumber < 0) {
        returnedObj = findClosestGeneric(quadtree.lessTree, array, targetFunction, targetDistance, minDisSquared, onlyFindOne, returned);
        recalcClosest();

        returnedObj = findClosestGeneric(quadtree.splitTree, array, targetFunction, targetDistance, minDisSquared, onlyFindOne, returned);
        recalcClosest();

        returnedObj = findClosestGeneric(quadtree.greaterTree, array, targetFunction, targetDistance, minDisSquared, onlyFindOne, returned);
        recalcClosest();
    }
    else if (splitNumber > 0) {
        returnedObj = findClosestGeneric(quadtree.greaterTree, array, targetFunction, targetDistance, minDisSquared, onlyFindOne, returned);
        recalcClosest();

        returnedObj = findClosestGeneric(quadtree.splitTree, array, targetFunction, targetDistance, minDisSquared, onlyFindOne, returned);
        recalcClosest();

        returnedObj = findClosestGeneric(quadtree.lessTree, array, targetFunction, targetDistance, minDisSquared, onlyFindOne, returned);
        recalcClosest();
    }
    else {
        returnedObj = findClosestGeneric(quadtree.splitTree, array, targetFunction, targetDistance, minDisSquared, onlyFindOne, returned);
        recalcClosest();

        returnedObj = findClosestGeneric(quadtree.lessTree, array, targetFunction, targetDistance, minDisSquared, onlyFindOne, returned);
        recalcClosest();

        returnedObj = findClosestGeneric(quadtree.greaterTree, array, targetFunction, targetDistance, minDisSquared, onlyFindOne, returned);
        recalcClosest();
    }


    return onlyFindOne ? closestObj : null;
}

function drawTree(engine, type, pen) {
    if (engine.curQuadTree.objTrees[type])
        drawBranch(engine.curQuadTree.objTrees[type].tree, pen);

    function drawBranch(quadtree, pen) {
        if (!quadtree)
            return;

        ink.outlineRect(quadtree.bounds.x, quadtree.bounds.y,
            quadtree.bounds.w, quadtree.bounds.h, pen);

        drawBranch(quadtree.lessTree, pen);
        drawBranch(quadtree.splitTree, pen);
        drawBranch(quadtree.greaterTree, pen);
    }
}