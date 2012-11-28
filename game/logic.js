function Engine(pen, bufferCanvas, pos) {
    var mX = -1;
    var mY = -1;    
    var mdX = -1; //Mouse down
    var mdY = -1;
    var muX = -1; //Mouse up
    var muY = -1;

    this.tPos = pos;

    this.pen = pen;
    this.bPen = bufferCanvas.getContext("2d");
    this.bufferCanvas = bufferCanvas;

    this.id = 0;
    this.money = 160;
    if (DFlag.lotsamoney) {
        this.money = 10000;
    }
    this.health = 100;

    this.lastTowerHover = null;

    this.base = new baseObj(this);

    this.engine = this; //eng also works fine

    this.infobar = new Infobar(
            new temporalPos(pos.w - 150, 0, 150, pos.h * 0.8)
        );

    this.base.addObject(this.infobar);

    this.towerbar = new Towerbar(
            new temporalPos(0, pos.h - 150, pos.w - 150, 150)
        );
    this.base.addObject(this.towerbar);

    
    this.currentBugs = 10;
    this.maxBugs = 150;
    this.bugIncrease = 10;
    this.bugDifficulty = 1;

    this.selectedObj = null;

    generatePath(this);
    var bugStart = getAnElement(this.engine.base.children["Path_Start"]);

    //Level/Wave generator
    var lmpos = new temporalPos(pos.w-400, 0, 100, pos.h*0.05);
    this.lvMan = new LevelManager(bugStart, lmpos);
    this.base.addObject(this.lvMan);
    

    this.lastFPS = 60;


    //https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame
    var firstStart = Date.now();
    var curFrameCounter = 0;
    var lastFPSUpdate = firstStart;
    var gameTimeAccumulated = 0;
    this.run = function (timestamp) {
        var updateAmount = timestamp - firstStart;
        firstStart = timestamp;

        updateAmount = Math.min(updateAmount, 100);

        curFrameCounter++;
        if (lastFPSUpdate + 1000 < timestamp) {
            this.lastFPS = curFrameCounter;
            curFrameCounter = 0;
            lastFPSUpdate = timestamp;
        }

        gameTimeAccumulated += updateAmount;

        var newObjects = this.base.update(updateAmount / 1000);

        for (var key in newObjects)
            this.base.addObject(newObjects[key]);
        
        this.bPen.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
        this.base.draw(this.bPen);
        pen.drawImage(bufferCanvas, 0, 0);
        window.reqAnim(this.run.bind(this));
    };

    this.update = function (dt) {
        this.curQuadTree = new QuadTree(this.base.allChildren);

	/*
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
        }*/

        this.handleMouseEvents();

        if (this.resizeEvent) {
            this.base.raiseEvent("resize", this.resizeEvent);
            this.resizeEvent = null;
        }

        //Make fancy background
        if (curFrameCounter % 100 == 0) {
            this.base.addObject(new FancyBackground(this.pen));
        }
    };

    this.resizeEvent = null;
    this.triggerResize = function(e) {
        this.resizeEvent = e;
    }

    function getMousePos(e) {
        // Canvas is fullscreen now, so pageX is our x position.
        var mX = defined(e.offsetX) ? e.offsetX : e.pageX;
        var mY = defined(e.offsetY) ? e.offsetY : e.pageY;

        return { x: mX + 0.5, y: mY + 0.5 };
    }

    this.triggerMousemove = function (e) {
        var pos = getMousePos(e);

        mX = pos.x;
        mY = pos.y;
    }

    this.triggerMouseout = function (e) {
        var pos = getMousePos(e);

        mX = -1;
        mY = -1;
    }

    this.triggerMousedown = function (e) {
        var pos = getMousePos(e);

        mdX = pos.x;
        mdY = pos.y;
    }

    this.triggerMouseup = function (e) {
        var pos = getMousePos(e);

        muX = pos.x;
        muY = pos.y;
    }

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
                       allUnderMouse[key].base.zoffset > topMost.base.zoffset)) {
                if (allUnderMouse[key].base.canHandleEvent(eventName))
                    topMost = allUnderMouse[key];
            }

        for (var key in allUnderMouse)
            if (allUnderMouse[key] !== topMost)
                allUnderMouse[key].base.callRaise(eventName, { x: mX, y: mY, topMost: false });

        topMost.base.callRaise(eventName, { x: mX, y: mY, topMost: true });

        return allUnderMouse;
    }

    //Called in update and uses async flags set when we get events
    this.handleMouseEvents = function() {
        if (mdX > 0 && mdY > 0) {
            var curMouseDown = throwMouseEventAt(mdX, mdY, "mousedown", this);
            this.prevMouseDown = curMouseDown;
            mdX = -1;
            mdY = -1;
        }

        if (muX > 0 && muY > 0) {
            var curMouseUp = throwMouseEventAt(muX, muY, "mouseup", this);

            if (this.prevMouseDown && this.prevMouseDown.length > 0) {
                for (var i = 0; i < this.prevMouseDown.length; i++) {
                    if (vecToRect({ x: muX, y: muY }, this.prevMouseDown[i].tPos).magSq() == 0) {
                        this.prevMouseDown[i].base.callRaise("click", { x: muX, y: muY });
                    }
                    this.prevMouseDown[i].base.callRaise("dragEnd", { x: muX, y: muY });
                }
            }

            this.prevMouseDown = null;

            muX = -1;
            muY = -1;
        }

        if (mY > 0 && mX > 0) {
            var curMouseOver = throwMouseEventAt(mX, mY, "mouseover", this);
            //Can actually find mouseout more efficiently... as we have previous and current mouseover...            
            if (this.prevMouseOver && this.prevMouseOver.length > 0) {
                for (var i = 0; i < this.prevMouseOver.length; i++) {
                    if (vecToRect({ x: mX, y: mY }, this.prevMouseOver[i].tPos).magSq() != 0) {
                        this.prevMouseOver[i].base.callRaise("mouseout", { x: mX, y: mY });
                    }
                }
            }
            this.prevMouseOver = curMouseOver;

            if (this.prevMouseDown && this.prevMouseDown.length > 0) {
                for (var i = 0; i < this.prevMouseDown.length; i++) {
                    this.prevMouseDown[i].base.callRaise("dragged", { x: mX, y: mY });
                }
            }

            mY = -1;
            mX = -1;
        }
    }
    
    this.resize = function(e) {
        this.tPos.w = e.width;
        this.tPos.h = e.height;
    }

    this.draw = function () {
        pen = this.pen;
        
        pen.fillStyle = "black";
        ink.rect(0, 0, width, height, pen);
        
        pen.font = "10px courier";
        pen.fillStyle = "#0F0";
        var x = bW + 10;
        var y = bH - 75;
        ink.text(x, y, "Health: " + this.health, pen);
        ink.text(x, y + 15, "Money: $" + Math.round(this.money*100)/100, pen);
        ink.text(x, y + 30, "Time passed: " + gameTimeAccumulated, pen);
        ink.text(x, y + 45, "FPS: " + this.lastFPS, pen);
        ink.text(x, y + 60, "Bugs: " + eng.base.lengths.Bug, pen);
    };

    //All selected stuff should probably be in its own object
    var currentRangeDisplayed = null;
    var hoverIndicator = new HoverIndicator(); //currentRangeDisplayed should probably be done like this
    this.base.addObject(hoverIndicator);

    this.changeSel = function (obj) {
        if (obj == this.selectedObj)
            return;

        if (currentRangeDisplayed) {
            currentRangeDisplayed.base.destroySelf();
            currentRangeDisplayed = null;
        }

        hoverIndicator.objectPointer = obj;

        if (obj && obj.attr) {
            //Hooks up our tower range to our actual attributes (but not our center)
            //so we don't need to maintain it.
            currentRangeDisplayed = new Circle(
                obj.tPos.getCenter(),
                new Pointer(obj.attr, "range"),
                new Pointer(obj, "color"),
                "transparent", 11);

            this.base.addObject(currentRangeDisplayed);

            this.selectedObj = obj;
            this.infobar.updateAttr(obj);
        }
        else {
            this.selectedObj = null;
            this.infobar.clearDisplay();
        }

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
