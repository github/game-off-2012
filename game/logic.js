//Calls the following functions on its children:

//update
//draw
//click
//mouseover
//mouseout

/********************************* CODE START *********************************/

function Engine(pen) {
    this.mX = -1;
    this.mY = -1;    
    this.mdX = -1; //Mouse down
    this.mdY = -1;
    this.muX = -1; //Mouse up
    this.muY = -1;


    this.pen = pen;

    this.id = 0;
    this.money = 1000;
    this.health = 100;

    this.lastTowerHover = null;

    this.base = new baseObj(this);

    //this.base.children.Tile = [];
    //this.base.children.Bug = [];

    this.engine = this; //eng also works fine

    this.maxBugs = 2;
    this.bugIncrease = 5;
    this.bugIncInc = 0.1;

    //this.maxBugs = 0;
    //this.bugIncrease = 0;
    //this.bugIncInc = 0;

    this.secondTimer = 1;

    this.selectedTower = null;
    this.infobar = new Infobar();
    this.base.addObject(this.infobar);

    generatePath(this);
    
    //https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame
    var firstStart = Date.now();

    this.lastFPS = 60;

    var curFrameCounter = 0;
    var lastFPSUpdate = firstStart;

    this.run = function (timestamp) {
        var updateAmount = timestamp - firstStart;
        firstStart = timestamp;

        if (!timestamp)
            updateAmount = 1000 / 30;

        updateAmount = Math.min(updateAmount, 100); //Cap it at 1000

        curFrameCounter++;
        if (lastFPSUpdate + 1000 < timestamp) {
            this.lastFPS = curFrameCounter;
            curFrameCounter = 0;
            lastFPSUpdate = timestamp;
        }

        gameTimeAccumulated += updateAmount;

        var newObjects = this.base.update(updateAmount / 1000);
        //var newObjects = this.base.raiseEvent("update", updateAmount / 1000);

        for (var key in newObjects)
            this.base.addObject(newObjects[key]);

        this.base.draw(pen);
        window.reqAnim(this.run.bind(this));
    };

    function throwMouseEventAt(mX, mY, eventName, eng) {
        var allUnderMouse = [];

        for (var type in eng.base.allChildren) {
            mergeToArray(findAllWithin(eng, type, { x: mX, y: mY }, 0), allUnderMouse);
        }

        if (allUnderMouse.length == 0)
            return;

        var topMost = allUnderMouse[0];

        //*sigh* so inefficient... but for now its fine
        for (var key in allUnderMouse)
            if (allUnderMouse[key].base.zindex > topMost.base.zindex ||
                       (allUnderMouse[key].base.zindex == topMost.base.zindex &&
                       allUnderMouse[key].base.zoffset > topMost.base.zoffset))
                topMost = allUnderMouse[key];
        
        for (var key in allUnderMouse)
            if(allUnderMouse[key] !== topMost)
                allUnderMouse[key].base.raiseEvent(eventName, { x: mX, y: mY, topMost: false });

        topMost.base.raiseEvent(eventName, { x: mX, y: mY, topMost: true });

        return allUnderMouse;
    }

/** Function */
    this.update = function (dt) {
        mX = this.mX;
        mY = this.mY;

        this.curQuadTree = new QuadTree(this.base.allChildren);

        if (eng.base.lengths["Path_Start"] > 0) {
            while (!eng.base.lengths["Bug"] || eng.base.lengths["Bug"] < this.maxBugs) {
                var bugStart = getAnElement(eng.base.children["Path_Start"]);
                var newBug = new Bug(bugStart, 4);
                this.base.addObject(newBug);
            }
        }

        if (this.mdX > 0 && this.mdY > 0) {
            var curMouseDown = throwMouseEventAt(this.mdX, this.mdY, "mousedown", this);
            this.prevMouseDown = curMouseDown;
            this.mdX = -1;
            this.mdY = -1;
        }

        if (this.muX > 0 && this.muY > 0) {
            var curMouseUp = throwMouseEventAt(this.muX, this.muY, "mouseup", this);

            if (this.prevMouseDown && this.prevMouseDown.length > 0) {
                for (var i = 0; i < this.prevMouseDown.length; i++) {
                    if (vecToRect({ x: this.muX, y: this.muY }, this.prevMouseDown[i].tPos).magSq() == 0) {
                        this.prevMouseDown[i].base.raiseEvent("click", { x: this.muX, y: this.muY });
                    }
                }
            }

            this.prevMouseDown = null;

            this.muX = -1;
            this.muY = -1;
        }

        this.base.removeAllType("Tower_Range");

        if (this.mY > 0 && this.mY < bH && this.mX > 0 && this.mX < bW) {
            var curMouseOver = throwMouseEventAt(mX, mY, "mouseover", this);
            //Can actually find mouseout more efficiently... as we have previous and current mouseover...            
            if (this.prevMouseOver && this.prevMouseOver.length > 0) {
                for (var i = 0; i < this.prevMouseOver.length; i++) {
                    if (vecToRect({ x: mX, y: mY }, this.prevMouseOver[i].tPos).magSq() != 0) {
                        this.prevMouseOver[i].base.raiseEvent("mouseout", { x: mX, y: mY });
                    }
                }
            }
            this.prevMouseOver = curMouseOver;

            if (this.prevMouseDown && this.prevMouseDown.length > 0) {
                for (var i = 0; i < this.prevMouseDown.length; i++) {
                    //if (vecToRect({ x: this.mX, y: this.mY }, this.prevMouseDown[i].tPos).magSq() == 0) {
                        this.prevMouseDown[i].base.raiseEvent("dragged", { x: this.mX, y: this.mY });
                    //}
                }
            }
        }

        this.secondTimer -= dt;

        if (this.secondTimer < 0) {
            this.secondTimer = 1;

            this.maxBugs += this.bugIncrease;
            //this.bugIncrease += this.bugIncInc;
        }

    };   
   
/** Function */
    this.draw = function () {

        pen = this.pen;
        pen.fillStyle = "black";
        ink.rect(0, 0, width, height, pen);
        pen.font = "15px Helvetica";
        pen.fillStyle = "#2233FF";
        ink.text(10, bH + 20, "Health: " + this.health, pen);
        ink.text(10, bH + 40, "Money: $" + this.money, pen);
        ink.text(10, bH + 60, "Time passed: " + gameTimeAccumulated, pen);
        ink.text(10, bH + 80, "FPS: " + this.lastFPS, pen);
        ink.text(10, bH + 100, "Bugs: " + eng.base.lengths.Bug, pen);
        
        this.pen.save();
        this.pen.strokeStyle = "red";
        //drawTree(this, "Tile", this.pen);
        //drawTree(this, "Tower", this.pen);
        //drawTree(this, "Bug", this.pen);
        this.pen.restore();        
    };

    this.changeSelTower = function(tower) {
	    //Change the selected tower
	    this.selectedTower = tower;
	    this.infobar.updateSelectedTower(tower);
	    return;
    }
}
