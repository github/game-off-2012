//All the input should likely be combined and put in a few components,
//as it will likely be the same for most games.

function GitDefence(pen, bufferCanvas, pos) {
    var engine = new Engine(pen, bufferCanvas, pos, this);
    this.engine = engine;

    var mX = -1;
    var mY = -1;    
    var mdX = -1; //Mouse down
    var mdY = -1;
    var muX = -1; //Mouse up
    var muY = -1;

    //Only valid when handling mouse events (just check when it is set)
    this.ctrlKey = false;


    //Put yourself in here (index global id) to get global mouse moves
    this.globalMouseMove = {};
    this.globalMouseDown = {};

    this.id = 0; //Shouldn't be needed (ids are in base)
    this.currentCost = 100;
    this.money = 1600; //Default to a much more reasonable value.
    if (DFlag.lotsamoney) {
        this.money = 10000;
    }
    this.health = 100;

    this.speed = 1;

    this.lastTowerHover = null;


    this.infobar = new Infobar(
            new TemporalPos(pos.w - 250, 0, 250, pos.h)
        );

    engine.base.addObject(this.infobar);

    this.towerbar = new Towerbar(
            new TemporalPos(0, pos.h - 150, pos.w - 260, 150)
        );
    engine.base.addObject(this.towerbar);

//    this.towerbreeder = new TowerBreeder(
//            new TemporalPos(pos.w - 250, pos.h - 150, 200, 150)
//        );
    //    engine.base.addObject(this.towerbreeder);

    this.gameInfoBar = new GameInfoBar(
            new TemporalPos(0, pos.h - 240, pos.w - 260, 90)
        );
    engine.base.addObject(this.gameInfoBar);

    
    this.currentBugs = 10;
    this.maxBugs = 150;
    this.bugIncrease = 10;
    this.bugDifficulty = 1;

    this.selectedObj = null;

    generatePath(this.engine);
    var bugStart = getAnElement(this.engine.base.children["Path_Start"]);

    //Level/Wave generator
    var lmpos = new TemporalPos(pos.w-400, 0, 100, pos.h*0.05);
    this.lvMan = new LevelManager(bugStart, lmpos);
    engine.base.addObject(this.lvMan);
    

    this.run = function (timestamp) {
        this.engine.run(timestamp);

        this.handleMouseEvents();

        if (this.resizeEvent) {
            this.base.raiseEvent("resize", this.resizeEvent);
            this.resizeEvent = null;
        }

        if (currentRangeDisplayed && this.selectedObj)
            currentRangeDisplayed.pCenter.set(this.selectedObj.tPos.getCenter());

        if (this.selectedObj)
            this.selectedObj.hover = true;
    };

    this.resizeEvent = null;
    this.triggerResize = function(e) {
        this.resizeEvent = e;
    }

    function getMousePos(e) {
        // Canvas is fullscreen now, so pageX is our x position.
	var canpos = document.getElementById("myCanvas")
        var mX = defined(e.offsetX) ? e.offsetX : e.pageX - canpos.offsetLeft;
        var mY = defined(e.offsetY) ? e.offsetY : e.pageY - canpos.offsetTop;
        
        return { x: mX + 0.5, y: mY + 0.5 };
    }

    this.triggerMousemove = function (e) {
        var pos = getMousePos(e); this.ctrlKey = e.ctrlKey;

        mX = pos.x;
        mY = pos.y;
    }

    this.triggerMouseout = function (e) {
        var pos = getMousePos(e); this.ctrlKey = e.ctrlKey;

        mX = -1;
        mY = -1;
    }

    this.triggerMousedown = function (e) {
        var pos = getMousePos(e); this.ctrlKey = e.ctrlKey;

        mdX = pos.x;
        mdY = pos.y;
    }

    this.triggerMouseup = function (e) {
        var pos = getMousePos(e); this.ctrlKey = e.ctrlKey;

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
    this.handleMouseEvents = function () {        
        if (mdX > 0 && mdY > 0) {
            for (var key in this.globalMouseDown) {
                if (this.globalMouseMove[key].base.rootNode != this.engine)
                    delete this.globalMouseMove[key];
                else
                    this.globalMouseMove[key].base.callRaise("mousedown", { x: mdX, y: mdY });
            }

            var curMouseDown = throwMouseEventAt(mdX, mdY, "mousedown", this.engine);
            this.prevMouseDown = curMouseDown;

            mdX = -1;
            mdY = -1;
        }

        if (muX > 0 && muY > 0) {
            var curMouseUp = throwMouseEventAt(muX, muY, "mouseup", this.engine);

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
            for (var key in this.globalMouseMove) {
                if (this.globalMouseMove[key].base.rootNode != this.engine)
                    delete this.globalMouseMove[key];
                else
                    this.globalMouseMove[key].base.callRaise("mousemove", { x: mX, y: mY });
            }

            var curMouseOver = throwMouseEventAt(mX, mY, "mouseover", this.engine);
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

        //Commenting out this line leads to funny results :D
        ink.rect(0, 0, width, height, pen);
    };

    //All selected stuff should probably be in its own object
    var currentRangeDisplayed = null;
    //this.base.addObject(hoverIndicator);

    this.selectedBucket = [];

    this.changeSel = function (obj) {
        if (obj == this.selectedObj)
            return;

        if (currentRangeDisplayed) {
            currentRangeDisplayed.base.destroySelf();
            currentRangeDisplayed = null;
        }

        if (obj && obj.attr) {
            //Hooks up our tower range to our actual attributes (but not our center)
            //so we don't need to maintain it.
            currentRangeDisplayed = new PCircle(
                obj.tPos.getCenter(),
                new Pointer(obj.attr, "range"),
                new Pointer(obj, "color"),
                "transparent", 11);

            this.engine.base.addObject(currentRangeDisplayed);

            if (this.selectedObj)
                this.selectedObj.hover = false;

            this.selectedObj = obj;
            this.infobar.updateAttr(obj);

            if (!this.ctrlKey) {
                for (var key in this.selectedBucket) {
                    var selected = this.selectedBucket[key];
                    for (var key in selected.base.children.HoverIndicator) {
                        var selIndi = selected.base.children.HoverIndicator[key];
                        selIndi.base.destroySelf();
                    }
                }
                this.selectedBucket = [];
            }
            this.selectedBucket.push(obj);
            obj.base.addObject(new HoverIndicator());
            //this.towerbreeder.towers = this.selectedBucket;
        }
        else {
            for (var key in this.selectedBucket) {
                var selected = this.selectedBucket[key];
                for (var key in selected.base.children.HoverIndicator) {
                    var selIndi = selected.base.children.HoverIndicator[key];
                    selIndi.base.destroySelf();
                }
            }
            this.selectedBucket = [];

            if (this.selectedObj)
                this.selectedObj.hover = false;

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
