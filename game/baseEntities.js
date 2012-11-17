//Add some more documentation to this!


//raiseEvent
    //raiseEvent(name, arguments)
        //Calls the function with the name on our object (and gives it arguments),
        //and calls raiseEvent on our children. Then merges the results in an array (merging arrays,
        //but ignoring undefined and null) and returns that.
    //Notes
        //Update is basically just raiseEvent("update", dt)

//If an object has destroySelf == true, then it is removed from
//the object on the next update call.

/********************************* CODE START *********************************/


function baseObj(holder, zindex) {
    if (!assertDefined("baseObj", holder))
        return;

    //Organized by type, and then arrays of objects
    //this.parent
    this.children = {};
    this.type = getRealType(holder); //.constructor.name;
    this.holder = holder;

    //This can be used to greatly increase the speed of spatial based queries
    this.quadNode = {};

    //Will be set to the position in the array it is in,
    //and so will be used to determine order when zindex is equal.
    this.zoffset = 0;

    if (!zindex)
        zindex = 0;

    //Individual objects cannot change their zindex! If they are the same type they must have the same zindex!
    this.zindex = zindex;

    //If this is not set it means the object has not been added to anything yet
    //(and so IT IS THE ROOT NODE).
    this.rootNode = null;

    this.addObject = function (obj) {
        if (!obj.base)
            fail("BAD! CALLED addObject with an object with no base (we need base for the type)!");

        if (!this.children[obj.base.type])
            this.children[obj.base.type] = [];

        this.children[obj.base.type].push(obj);
        obj.base.parent = this;

        obj.base.setRootNode(this.rootNode || this);
    }

    this.setRootNode = function (rootNode) {
        this.rootNode = rootNode;
        for (var key in this.children)
            if (this.children[key].base)
                this.children[key].setRootNode(rootNode);
    }

    this.removeAllType = function (type) {
        if (this.children[type])
            this.children[type].length = 0;
    }

    this.raiseEvent = function (name, arguments) {
        var returnedValues = [];

        //Well if it exists it is clearly a function :D
        //(read http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
        //before fixing this in order to implement the most efficient solution to checking if something is a function
        //for different browsers).
        if (holder[name])
            mergeToArray(holder[name](arguments), returnedValues);

        for (var key in this.children) {
            for (var i = this.children[key].length - 1; i >= 0; i--) {
                if (this.children[key][i].base) {
                    mergeToArray(this.children[key][i].base.raiseEvent(name, arguments), returnedValues);
                }
            }
        }

        return returnedValues;
    };

    this.update = function (dt) {
        var returnedValues = [];
        
        if (holder.update)
            mergeToArray(holder.update(dt), returnedValues);

        for (var key in this.children) {
            for (var i = this.children[key].length - 1; i >= 0; i--) {
                if (this.children[key][i].base) {
                    mergeToArray(this.children[key][i].base.update(dt), returnedValues);
                }
            }
        }

        return returnedValues;
    }

    this.removeMarked = function () {
        //Removes everything marked for deletion (with destroySelf)
        for (var key in this.children) {
            for (var i = this.children[key].length - 1; i >= 0; i--) {
                if (this.children[key][i].base.destroySelf)
                    this.children[key].splice(i, 1);
                else
                    this.children[key][i].base.removeMarked();
            }
        }
    }

    this.draw = function (pen) {

        if (holder.draw)
            holder.draw(pen);

        //Sort objects by z-index (low to high) and then draw by that order
        var childWithZIndex = [];

        for (var key in this.children) {
            if (this.children[key].length > 0) {
                childWithZIndex.push({ zindex: this.children[key][0].base.zindex, array: this.children[key] });
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
            for (var i = 0; i < childWithZIndex[y].array.length; i++) {
                pen.save();
                if(childWithZIndex[y].array[i].base)
                    childWithZIndex[y].array[i].base.draw(pen);
                pen.restore();
            }
        }
    }
}