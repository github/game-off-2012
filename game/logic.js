//Calls the following functions on its children:

//update
//draw
//click
//mouseover
//mouseout

/********************************* CODE START *********************************/

function Engine(pen, bufferCanvas) {
    this.mX = -1;
    this.mY = -1;    
    this.mdX = -1; //Mouse down
    this.mdY = -1;
    this.muX = -1; //Mouse up
    this.muY = -1;


    this.pen = pen;
    this.bPen = bufferCanvas.getContext("2d");
    this.bufferCanvas = bufferCanvas;

    this.id = 0;
    this.money = 10000;
    this.health = 100;

    this.lastTowerHover = null;

    this.base = new baseObj(this);

    this.engine = this; //eng also works fine

    this.infobar = new Infobar();
    this.base.addObject(this.infobar);
    
    this.currentBugs = 10;
    this.maxBugs = 150;
    this.bugIncrease = 10;
    this.bugDifficulty = 1;

    this.secondTimer = 1;

    this.selectedObj = null;

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
        
        this.bPen.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
        this.base.draw(this.bPen);
        pen.drawImage(bufferCanvas, 0, 0);
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
                allUnderMouse[key].base.call(eventName, { x: mX, y: mY, topMost: false });

        topMost.base.call(eventName, { x: mX, y: mY, topMost: true });

        return allUnderMouse;
    }

/** Function */
    this.update = function (dt) {
        mX = this.mX;
        mY = this.mY;

        this.curQuadTree = new QuadTree(this.base.allChildren);

        if (eng.base.lengths["Path_Start"] > 0
                && (!eng.base.lengths["Bug"] || eng.base.lengths["Bug"] === 0)) {
            this.bugDifficulty += 0.1;
            while (!eng.base.lengths["Bug"] || eng.base.lengths["Bug"] < this.currentBugs) {
                var bugStart = getAnElement(eng.base.children["Path_Start"]);
                var newBug = new Bug(bugStart, this.bugDifficulty);
                this.base.addObject(newBug);
            }
            this.currentBugs += this.bugIncrease;
            if (this.currentBugs > this.maxBugs) {
                this.currentBugs = this.maxBugs;
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
                        this.prevMouseDown[i].base.call("click", { x: this.muX, y: this.muY });
                    }
                }
            }

            this.prevMouseDown = null;

            this.muX = -1;
            this.muY = -1;
        }

        this.base.removeAllType("Tower_Range");

        if (this.mY > 0 && this.mX > 0) {
            var curMouseOver = throwMouseEventAt(mX, mY, "mouseover", this);
            //Can actually find mouseout more efficiently... as we have previous and current mouseover...            
            if (this.prevMouseOver && this.prevMouseOver.length > 0) {
                for (var i = 0; i < this.prevMouseOver.length; i++) {
                    if (vecToRect({ x: mX, y: mY }, this.prevMouseOver[i].tPos).magSq() != 0) {
                        this.prevMouseOver[i].base.call("mouseout", { x: mX, y: mY });
                    }
                }
            }
            this.prevMouseOver = curMouseOver;

            if (this.prevMouseDown && this.prevMouseDown.length > 0) {
                for (var i = 0; i < this.prevMouseDown.length; i++) {
                    //if (vecToRect({ x: this.mX, y: this.mY }, this.prevMouseDown[i].tPos).magSq() == 0) {
                        this.prevMouseDown[i].base.call("dragged", { x: this.mX, y: this.mY });
                    //}
                }
            }
        }

        this.secondTimer -= dt;

        if (this.secondTimer < 0) {
            this.secondTimer = 1;

            this.maxBugs += this.bugIncrease;
            
        }

		//Make fancy background
		if (curFrameCounter % 100 == 0) {
			this.base.addObject(new FancyBackground(this.pen));
		}	
	};   
   
/** Function */
    this.draw = function () {
        pen = this.pen;
        
        pen.fillStyle = "black";
        ink.rect(0, 0, width, height, pen);
        
        pen.font = "10px courier";
        pen.fillStyle = "#0F0";
        var x = bW + 10;
        var y = bH - 75;
        ink.text(x, y, "Health: " + this.health, pen);
        ink.text(x, y + 15, "Money: $" + this.money, pen);
        ink.text(x, y + 30, "Time passed: " + gameTimeAccumulated, pen);
        ink.text(x, y + 45, "FPS: " + this.lastFPS, pen);
        ink.text(x, y + 60, "Bugs: " + eng.base.lengths.Bug, pen);  
    };

    this.changeSel = function(obj) {

	    //Change the selected tower
	    this.selectedObj = obj;
	    this.infobar.updateAttr(obj);
	    return;
    }

    this.upgradeSel = function () {
		if(this.selectedObj)
			this.selectedObj.tryUpgrade();
	    return;
    }

    this.getSelType = function () {
	    if (!this.selectedObj) {
		    return null;
	    } 
	    return this.selectedObj.base.type;
	   
    }
}
