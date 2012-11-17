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
    var relevantArray = engine.curQuadTree.objTrees[type].array;

    if (DFlag.logn.findClosest)
        DFlag.logn.findClosest.max += relevantArray.length;
    
    return findClosestPrivate(relevantQuadTree, target, relevantArray, maxDistance * maxDistance, true);

    function findClosestPrivate(quadtree, target, array, minDisSquared) {
        if (!quadtree)
            return;

        //We should do this before we are called... and then we can do it much more efficiently
        //(not just because it reduces a function call), but then the code would be way bigger
        //and much more complex

        var minDisSqrBounds = vecToRect(target, quadtree.bounds).magSq();        

        //Then it is impossible and we will never find a better collision
        if (minDisSqrBounds > minDisSquared)
            return null;

        //Find closest and return it
        var closestObj = null;

        if (DFlag.logn.findClosest) {
            DFlag.logn.findClosest.total += quadtree.indexCount;
        }

        //This is the brute force part of the algorithm
        for (var x = quadtree.startIndex; x < quadtree.startIndex + quadtree.indexCount; x++) {            
            var curObj = array[x];

            var disSquared = vecToRect(target, curObj.tPos).magSq();

            if (disSquared <= minDisSquared) {
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
            var newDisSquared = vecToRect(target, curClosest.tPos);
            if (newDisSquared > minDisSquared)
                fail("no, impossible. findClosest ignored minDisSquared and returning something too far away.");
            minDisSquared = newDisSquared;
        }

        //Splits always must be compared :(
        curClosest = findClosestPrivate(quadtree.splitTree, target, array, minDisSquared) || curClosest;

        if (curClosest) {
            //Not possible, it would have been screened in the function call
            var newDisSquared = vecToRect(target, curClosest.tPos);
            if (newDisSquared > minDisSquared)
                fail("no, impossible. findClosest ignored minDisSquared and returning something too far away.");
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


function findAllWithin(engine, type, target, maxDistance) {
    if (!assertDefined("findAllWithin", engine, type, target))
        return null;

    if (!engine.curQuadTree.objTrees[type])
        return null;

    var relevantQuadTree = engine.curQuadTree.objTrees[type].tree;
    var relevantArray = engine.curQuadTree.objTrees[type].array;
    
    var within = [];

    if (DFlag.logn.findAllWithin)
        DFlag.logn.findAllWithin.max += relevantArray.length;

    findWithinPrivate(relevantQuadTree, target, relevantArray, maxDistance * maxDistance, true);    

    return within;


    function findWithinPrivate(quadtree, target, array, minDisSquared) {
        if (!quadtree)
            return;

        //We should do this before we are called... and then we can do it much more efficiently
        //(not just because it reduces a function call), but then the code would be way bigger
        //and much more complex

        var minDisSqrBounds = vecToRect(target, quadtree.bounds).magSq();
        
        //Then it is impossible and we will never find a better collision
        if (minDisSqrBounds > minDisSquared)
            return null;

        //Find closest and return it
        var closestObj = null;

        if (DFlag.logn.findAllWithin) {
            DFlag.logn.findAllWithin.total += quadtree.indexCount;
        }

        //This is the brute force part of the algorithm
        for (var x = quadtree.startIndex; x < quadtree.startIndex + quadtree.indexCount; x++) {
            var curObj = array[x];

            var disSquared = vecToRect(target, curObj.tPos);

            if (disSquared <= minDisSquared) {
                within.push(curObj);
            }
        }

        //We still might have objects on us if this is false, but if it is true
        //it means be have no branches
        if (quadtree.leaf)
            return;

        var curD = quadtree.splitX ? "x" : "y";

        //The rectangle in which we are in is the best bet... so we recurse down with that,
        var curClosest = null;

        if (target[curD] <= quadtree.splitPos)
            findWithinPrivate(quadtree.lessTree, target, array, minDisSquared);
        else
            findWithinPrivate(quadtree.greaterTree, target, array, minDisSquared);

        //Splits always must be compared :(
        findWithinPrivate(quadtree.splitTree, target, array, minDisSquared);

        //If it is possible something in the other side of the split could be better.            
        //Just opposite of previous exclusion logic
        if (target[curD] > quadtree.splitPos)
            findWithinPrivate(quadtree.lessTree, target, array, minDisSquared);
        else
            findWithinPrivate(quadtree.greaterTree, target, array, minDisSquared);


        return curClosest;
    }
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