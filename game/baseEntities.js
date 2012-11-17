//If you add baseObj, also add:
/*
this.update = function (dt) {
        this.tPos.update(dt);

        if (this.base)
            return this.base.update(dt);
    };

this.draw = function (pen) {
    //Add your draw code here

    if(this.base)
        this.base.draw(pen);
};
*/

//If an object has destroySelf == true, then it is removed from
//the object on the next update call.

function baseObj(type, zindex) {
    //Organized by type, and then arrays of objects
    //this.parent
    this.children = {};
    this.type = type;

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
            console.log("BAD! CALLED addObject with an object with no base (we need base for the type)!");

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

    this.update = function (dt) {
        var newObjs = [];
        for (var key in this.children) {
            for (var i = this.children[key].length - 1; i >= 0; i--) {
                newObjs = merge(newObjs, this.children[key][i].update(dt));
            }
        }
        return newObjs;
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
        //Sort objects by z-index (low to high) and then draw by that order

        var childWithZIndex = [];

        for (var key in this.children) {
            if (this.children[key].length > 0) {
                childWithZIndex.push({ zindex: this.children[key][0].base.zindex, array: this.children[key] });
            }
        }

        sortArrayByProperty(childWithZIndex, "zindex");

        var lastZIndex = -1000000;
        for (var y = 0; y < childWithZIndex.length; y++) {
            if (childWithZIndex[y].zindex < lastZIndex) {
                console.log("Z SORTING MESSING UP (CRASH)!");
                sortArrayByProperty(childWithZIndex, "zindex");
            }
            lastZIndex = childWithZIndex[y].zindex;
        }

        for (var y = 0; y < childWithZIndex.length; y++) {
            for (var i = 0; i < childWithZIndex[y].array.length; i++) {
                pen.save();
                childWithZIndex[y].array[i].draw(pen);
                pen.restore();
            }
        }
    }
}