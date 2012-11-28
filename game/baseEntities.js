//Add some more documentation to this!


//raiseEvent
    //raiseEvent(name, arguments)
        //Calls the function with the name on our object (and gives it arguments),
        //and calls raiseEvent on our children. Then merges the results in an array (merging arrays,
        //but ignoring undefined and null) and returns that.
    //Notes
        //Update is basically just raiseEvent("update", dt)

/********************************* CODE START *********************************/

var uniqueBaseObjNumber = 1;
function baseObj(holder, zindex) {
    if (!assertDefined("baseObj", holder))
        return;

    //Strange... but needed
    holder.base = this;

//Identifier properties    
    this.type = getRealType(holder); //.constructor.name;

    //If its not a string then the object degenerates to an array.
    this.id = 'q' + uniqueBaseObjNumber++;

   
//Drawing properties
    //Will be set to the position in the array it is in,
    //and so will be used to determine order when zindex is equal.
    this.zoffset = 0; //<--------- THIS IS ALSO QUADTREE MAINTAINED

    if (!zindex)
        zindex = 0;

    //Individual objects cannot change their zindex! If they are the same type they must have the same zindex!
    this.zindex = zindex;


//Hierarchical properties
    this.rootNode = holder; //Be default we are our own rootNode    
    this.holder = holder;
    this.parent = null;

    //Organized by type, and then objects of objects (with the index the id)
    //so this.children['Tower']['q53'] could be a tower (depending on the unique id of the tower)
    //this.parent
    this.children = {};
    this.lengths = {}; //type to length, must be maintained manually (naturally)

    //Flattened structure of children, so grandchildren are in here, etc
    this.allChildren = {};
    this.allLengths = {};


    if (holder.tPos) {
        //Quadtree maintained properties
        //We default the quadtree to something, that way every object always has one
        var tempArrObjs = {};
        tempArrObjs[this.type] = {};
        tempArrObjs[this.type][this.id] = holder;
        this.curQuadTree = new QuadTree(tempArrObjs);
        //QuadTree will then set quadNode in us.
    }

    //This just makes easier to maintain our arrays. It doesn't really create them,
    //so array and arrayLengths must still be members initialized in our constructor
    function addToArray(baseObj, obj, array, arrayLengths) {
        if (!assertDefined("addToArray", baseObj, baseObj[array], baseObj[arrayLengths], obj, obj.base))
            return;

        if (!baseObj[array][obj.base.type]) {
            baseObj[array][obj.base.type] = {};
            baseObj[arrayLengths][obj.base.type] = 0;
        }

        if (!baseObj[array][obj.base.type][obj.base.id]) {
            baseObj[array][obj.base.type][obj.base.id] = obj;
            baseObj[arrayLengths][obj.base.type]++;
        }
    };

    this.addObject = function (obj) {
        if (!assertDefined("addObject", obj) || !assertDefined("addObject", obj.base))
            return;

        obj.base.parent = this.holder;
        obj.base.setRootNode(this.rootNode);

        addToArray(this, obj, "children", "lengths");

        if(obj.added)
            obj.added();

        //Hmm... I don't like this loop, too specific
        obj.base.loopThroughAllTypes(function (child) {
            if (child.parentAdded)
                child.parentAdded();
        });
    };    

    function removeFromArray(baseObj, obj, array, arrayLengths) {
        if (!assertDefined(baseObj) || 
            !assertDefined("removeFromArray", baseObj, baseObj[array], baseObj[arrayLengths], obj, obj.base))
            return;

        if (!baseObj[array][obj.base.type])
            return;

        if (baseObj[array][obj.base.type][obj.base.id]) {
            delete baseObj[array][obj.base.type][obj.base.id];
            baseObj[arrayLengths][obj.base.type]--;
        }
    }

    this.loopThroughAllTypes = function (funcToExecute) {
        for (var type in this.children)
            for (var id in this.children[type])
                if (funcToExecute(this.children[type][id])) {
                    return;
                }

    };

    this.removeObject = function (obj) {
        if (!assertDefined("removeObject", obj, obj.base))
            return;

        //Set its root node to itself to let it know we are no longer its parent
        obj.base.parent = obj;
        obj.base.setRootNode(obj);        

        removeFromArray(this, obj, "children", "lengths");
    };

    this.destroySelf = function () {
        if (this.parent) { //Else there is no way to destroy ourself
            this.holder.base.callRaise("die");
            this.parent.base.removeObject(this.holder);

            //Also destroy our children (keeps allChildren working properly)
            this.loopThroughAllTypes(function (child) {
                if (child.base)
                    child.base.destroySelf();
            });
        }
    }

    this.setRootNode = function (rootNode) {
        if (!assertDefined("setRootNode", rootNode))
            return;

        //Remove stuff from old rootNode
        if (this.rootNode) {
            removeFromArray(this.rootNode.base, this.holder, "allChildren", "allLengths");
            if (this.rootNode.curQuadTree)
                this.rootNode.curQuadTree.removeFromTree(this.holder);
        }

        this.rootNode = rootNode;

        addToArray(this.rootNode.base, this.holder, "allChildren", "allLengths");
        if (this.rootNode.curQuadTree)
            this.rootNode.curQuadTree.addToTree(this.holder);

        this.loopThroughAllTypes(function (child) {
            if (child.base) {
                child.base.setRootNode(rootNode);
            }
        });
    };

    this.removeAllType = function (type) {
        if (this.children[type])
            this.children[type] = {};
    };

    this.raiseEvent = function (name, args) {
        var returnedValues = [];

        //Well if it exists it is clearly a function :D
        //(read http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
        //before fixing this in order to implement the most efficient solution to checking if something is a function
        //for different browsers).
        if (holder[name] && !holder.hidden)
            mergeToArray(holder[name](args), returnedValues);

        this.loopThroughAllTypes(function (child) {
            if (child.base) {
                mergeToArray(child.base.raiseEvent(name, args), returnedValues);
            }
        });

        return returnedValues;
    };

    //Calls and returns the returned array (or an empty array)    
    this.callMerge = function (name, args)
    {
        var returnedValues = [];

        //Well if it exists it is clearly a function :D
        //(read http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
        //before fixing this in order to implement the most efficient solution to checking if something is a function
        //for different browsers).
        if (holder[name] && !holder.hidden)
            mergeToArray(holder[name](args), returnedValues);

        return returnedValues;
    }

    //Calls the function, then raises an event called "parent_" + name
    //to all of its children. Does not collect the return values as this
    //concept is being phased out as it is not really OO sound.
    this.callRaise = function (name, args) {
        if(holder[name] && !holder.hidden)
            holder[name](args);

        this.loopThroughAllTypes(function (child) {
            if (child.base) {
                child.base.raiseEvent("parent_" + name, args);
            }
        });
    }

    this.setAttributeRecursive = function (attributeName, value) {
        this.holder[attributeName] = value;

        this.loopThroughAllTypes(function (child) {
            if (child.base) {
                child.base.setAttributeRecursive(attributeName, value);
            }
        });
    }

    //Unfortunately this has to be recursive
    this.canHandleEvent = function (eventName) {
        if (holder[eventName])
            return true;


        eventName = "parent_" + eventName;
        var childrenHandleIt = false;
        this.loopThroughAllTypes(function (child) {
            if (child.base) {
                if (child.base.canHandleEvent(eventName)) {
                    childrenHandleIt = true;
                    return true;
                }
            }
        });

        return childrenHandleIt;
    }

    this.update = function (dt) {
        var returnedValues = [];

        if (holder.update)
            mergeToArray(holder.update(dt), returnedValues);

        this.loopThroughAllTypes(function (child) {
            if (child.base) {
                mergeToArray(child.base.update(dt), returnedValues);
            }
        });

        return returnedValues;
    };

    this.draw = function (pen) {
        if (holder.draw)
            holder.draw(pen);

        //Sort objects by z-index (low to high) and then draw by that order
        var childWithZIndex = [];

        for (var key in this.allChildren) {
            if (getAnElement(this.allChildren[key])) {
                childWithZIndex.push({ zindex: getAnElement(this.allChildren[key]).base.zindex, array: this.allChildren[key] });
            }
        }

        sortArrayByProperty(childWithZIndex, "zindex");

        if (DFlag.zindexCheck) {
            var lastZIndex = -1000000;
            for (var y = 0; y < childWithZIndex.length; y++) {
                if (childWithZIndex[y].zindex < lastZIndex) {
                    fail("Z SORTING MESSING UP (CRASH)!");
                    //sortArrayByProperty(childWithZIndex, "zindex");
                }
                lastZIndex = childWithZIndex[y].zindex;
            }
        }

        for (var y = 0; y < childWithZIndex.length; y++) {
            for (var key in childWithZIndex[y].array) {
                var child = childWithZIndex[y].array[key];
                pen.save();
                if (child.draw && !child.hidden)
                    child.draw(pen);
                pen.restore();
            }
        }

        //if (holder.draw)
          //  holder.draw(pen);
    };
    
}