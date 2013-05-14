//Debug flags. ALL SHOULD BE FALSE BY DEFAULT!
// To set this for development, make a file called debug.js,
// and set the appropriate flag in there. debug.js is in .gitignore,
// so it is unlikely you will commit it by accident, unlike
// this file, which is version controlled.

var DFlag = {};
DFlag.debug = false;

//DFlag.zindexCheck = true;
//DFlag.lotsamoney = true;

DFlag.logn = {};
// DFlag.logn.findClosest = {};
// DFlag.logn.findClosest.total = 0;
// DFlag.logn.findClosest.max = 0;
//
// DFlag.logn.findAllWithin = {};
// DFlag.logn.findAllWithin.total = 0;
// DFlag.logn.findAllWithin.max = 0;
//
// DFlag.logn.findClosestGeneric = {};
// DFlag.logn.findClosestGeneric.total = 0;
// DFlag.logn.findClosestGeneric.max = 0;

DFlag.quadtree = {};
// DFlag.quadtree.leafCount = 0;
// DFlag.quadtree.leafDepthWeighted = 0;
// DFlag.quadtree.leafObjectCount = 0;
