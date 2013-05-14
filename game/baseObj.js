BaseObj.nextUniqueId = 1;
function BaseObj(holder, zindex, dynamicZIndex) {
    var self = this;
    if (!assertDefined("BaseObj", holder))
        return;

    //Strange... but needed
    holder.base = self;

//Identifier properties
    self.type = getRealType(holder); //.constructor.name;
    if (dynamicZIndex)
        self.type += zindex;

    //If its not a string then the object degenerates to an array.
    self.id = 'q' + BaseObj.nextUniqueId++;


//Drawing properties
    //Will be set to the position in the array it is in,
    //and so will be used to determine order when zindex is equal.
    self.zoffset = 0; //<--------- THIS IS ALSO QUADTREE MAINTAINED

    if (!zindex)
        zindex = 0;

    //Individual objects cannot change their zindex! If they are the same type they must have the same zindex!
    self.zindex = zindex;


//Hierarchical properties
    self.rootNode = holder; //Be default we are our own rootNode
    self.holder = holder;
    self.parent = null;

    //Organized by type, and then objects of objects (with the index the id)
    //so self.children['Tower']['q53'] could be a tower (depending on the unique id of the tower)
    //self.parent
    self.children = {};
    self.lengths = {}; //type to length, must be maintained manually (naturally)

    //Flattened structure of children, so grandchildren are in here, etc
    self.allChildren = {};
    self.allLengths = {};


    if (holder.tpos) {
        //Quadtree maintained properties
        //We default the quadtree to something, that way every object always has one
        var tempArrObjs = {};
        tempArrObjs[self.type] = {};
        tempArrObjs[self.type][self.id] = holder;
        self.curQuadTree = new QuadTree(tempArrObjs);
        //QuadTree will then set quadNode in us.
    }

    //This just makes easier to maintain our arrays. It doesn't really create them,
    //so array and arrayLengths must still be members initialized in our constructor
    function addToArray(BaseObj, obj, array, arrayLengths) {
        if (!assertDefined("addToArray", BaseObj, BaseObj[array], BaseObj[arrayLengths], obj, obj.base))
            return;

        if (!BaseObj[array][obj.base.type]) {
            BaseObj[array][obj.base.type] = {};
            BaseObj[arrayLengths][obj.base.type] = 0;
        }

        if (!BaseObj[array][obj.base.type][obj.base.id]) {
            BaseObj[array][obj.base.type][obj.base.id] = obj;
            BaseObj[arrayLengths][obj.base.type]++;
        }
    };

    self.addChild = function (obj) {
        if (!assertDefined("addChild", obj) || !assertDefined("addChild", obj.base))
            return;

        obj.base.parent = self.holder;
        obj.base.setRootNode(self.rootNode);

        addToArray(self, obj, "children", "lengths");

        if (obj.added)
            obj.added();
    };

    function removeFromArray(BaseObj, obj, array, arrayLengths) {
        if (!assertDefined(BaseObj) ||
            !assertDefined("removeFromArray", BaseObj, BaseObj[array], BaseObj[arrayLengths], obj, obj.base))
            return;

        if (!BaseObj[array][obj.base.type])
            return;

        if (BaseObj[array][obj.base.type][obj.base.id]) {
            delete BaseObj[array][obj.base.type][obj.base.id];
            BaseObj[arrayLengths][obj.base.type]--;
        }
    }

    self.eachChild = function (funcToExecute) {
        for (var type in self.children) {
            for (var id in self.children[type]) {
                if (funcToExecute(self.children[type][id])) {
                    return;
                }
            }
        }
    };

    self.removeChild = function (obj) {
        if (!assertDefined("removeChild", obj, obj.base))
            return;

        //Set its root node to itself to let it know we are no longer its parent
        obj.base.parent = obj;
        obj.base.setRootNode(obj);

        removeFromArray(self, obj, "children", "lengths");
    };

    self.destroySelf = function () {
        if (!self.parent) return;

        self.holder.base.callRaise("die");
        self.parent.base.removeChild(self.holder);

        //Also destroy our children (keeps allChildren working properly)
        self.eachChild(function (child) {
            if (child.base)
                child.base.destroySelf();
        });
    };

    self.setRootNode = function (rootNode) {
        if (!assertDefined("setRootNode", rootNode))
            return;

        //Remove stuff from old rootNode
        if (self.rootNode) {
            removeFromArray(self.rootNode.base, self.holder, "allChildren", "allLengths");
            if (self.rootNode.curQuadTree)
                self.rootNode.curQuadTree.removeFromTree(self.holder);
        }

        self.rootNode = rootNode;

        addToArray(self.rootNode.base, self.holder, "allChildren", "allLengths");
        if (self.rootNode.curQuadTree)
            self.rootNode.curQuadTree.addToTree(self.holder);

        self.eachChild(function (child) {
            if (child.base) {
                child.base.setRootNode(rootNode);
            }
        });
    };

    self.removeAllType = function (type) {
        if (self.children[type]) {
            self.children[type] = {};
            self.lengths[type] = 0;
        }
        //This is harder, you need to also remove them from their parents
        if (self.allChildren[type]) {
            for(var key in self.allChildren[type]) {
                var toRemove = self.allChildren[type][key];
                if(toRemove.base.parent != self.holder)
                    delete toRemove.base.parent.base.children[type][key];
            }
            self.allChildren[type] = {};
            self.allLengths[type] = 0;
        }
    };

    // Calls the function with the name on our object (and gives it arguments),
    // and calls raiseEvent on our children.
    // Update is basically just raiseEvent("update", dt)
    self.raiseEvent = function (name, args) {
        if (holder[name]) holder[name](args);

        self.eachChild(function (child) {
            if (child.base) {
                child.base.raiseEvent(name, args)
            }
        });
    };

    // Calls the function, then raises an event called "parent_" + name
    // to all of its children.
    self.callRaise = function (name, args) {
        if(holder[name] && !holder.hidden)
            holder[name](args);

        self.eachChild(function (child) {
            if (child && child["parent_" + name]) {
                child["parent_" + name](args);
            }
        });
    }

    self.setAttributeRecursive = function (attributeName, value) {
        self.holder[attributeName] = value;

        self.eachChild(function (child) {
            if (child.base) {
                child.base.setAttributeRecursive(attributeName, value);
            }
        });
    }

    self.canHandleEvent = function (eventName) {
        if (holder[eventName])
            return true;

        eventName = "parent_" + eventName;
        var childrenHandleIt = false;
        self.eachChild(function (child) {
            if (child.base && child.base.canHandleEvent(eventName)) {
                childrenHandleIt = true;
                return true;
            }
        });

        return childrenHandleIt;
    }

    self.update = function (dt) {
        if (holder.update) holder.update(dt);

        self.eachChild(function (child) {
            if (child.base) child.base.update(dt);
        });
    };

    var drawDirty = true;
    self.dirty = function () {
        drawDirty = true;
    }

    var canvas = new Canvas();
    function draw(pen) {
        if (holder.hidden) return;

        if (holder.draw) {
            // Provide the old API for compatability.
            holder.draw(pen);
        } else if (holder.redraw) {
            if (drawDirty) {
                canvas.resize(holder.tpos);
                holder.redraw(canvas);
                canvas.drawTo(pen);
                drawDirty = false;
            } else {
                canvas.drawTo(pen);
            }
        }
    }

    self.draw = function (pen) {
        draw(pen);

        //Sort objects by z-index (low to high) and then draw by that order
        var childWithZIndex = [];

        for (var key in self.children) {
            var child = self.children[key];
            if (getAnElement(child)) {
                childWithZIndex.push({
                    zindex: getAnElement(child).base.zindex,
                    array: child,
                });
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
                child.base.draw(pen);
            }
        }
    };

    self.game = function () {
        return self.rootNode.game;
    }
}
