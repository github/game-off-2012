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
    this.cX = -1; //These are set on click, its your job to consume them when you have used them
    this.cY = -1;

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

    //this.maxBugs = 10;
    //this.bugIncrease = 0;
    //this.bugIncInc = 0;

    this.secondTimer = 1;

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

        //We got a click event
        if (this.cX > 0) {
            this.click();
            this.cX = -1;
            this.cY = -1;
        }

        this.base.removeAllType("Tower_Range");

        if (this.mY > 0 && this.mY < bH && this.mX > 0 && this.mX < bW) {
            var allUnderMouse = [];

            for (var type in this.base.children) {
                mergeToArray(findAllWithin(eng, type, { x: mX, y: mY }, 0), allUnderMouse);
            }

            if (allUnderMouse.length > 0) {
                var topMost = allUnderMouse[0];

                //*sigh* so inefficient... but for now its fine
                for (var key in allUnderMouse)
                    if (allUnderMouse[key].base.zindex > topMost.base.zindex ||
                       (allUnderMouse[key].base.zindex == topMost.base.zindex &&
                       allUnderMouse[key].base.zoffset > topMost.base.zoffset))
                        topMost = allUnderMouse[key];

                allUnderMouse.splice(key, 1);

                for (var key in allUnderMouse)
                    allUnderMouse[key].base.raiseEvent("mouseover", { x: mX, y: mY, topMost: false });

                topMost.base.raiseEvent("mouseover", { x: mX, y: mY, topMost: true });
            }

            //Can actually find mouseout more efficiently... as we have previous and current mouseover...            
            if (this.prevMouseOver && this.prevMouseOver.length > 0) {
                for (var i = 0; i < this.prevMouseOver.length; i++) {
                    if (vecToRect({ x: mX, y: mY }, this.prevMouseOver[i].tPos).magSq() != 0) {
                        this.prevMouseOver[i].base.raiseEvent("mouseout");
                    }
                }
            }

            this.prevMouseOver = allUnderMouse;

            var tower = findClosest(this.engine, "Tower", { x: mX, y: mY }, 0);

            if (tower) {
                tower = findClosest(this.engine, "Tower", { x: mX, y: mY }, 0);
                this.base.addObject(new Tower_Range(tower.tPos.x - tower.range + tileSize * 0.5, tower.tPos.y - tower.range + tileSize * 0.5, tower.range * 2, tower.range * 2));
            }

        }

        this.secondTimer -= dt;

        if (this.secondTimer < 0) {
            this.secondTimer = 1;

            this.maxBugs += this.bugIncrease;
            this.bugIncrease += this.bugIncInc;
        }
    };
    
/** Function */
    this.click = function () {
        var cX = this.cX;
        var cY = this.cY;

        if (cY > 0 && cY < bH && cX > 0 && cX < bW) {

            var allUnderClick = [];

            for (var type in this.children)
                mergeToArray(findAllWithin(eng, type, { x: cX, y: cY }, 0), allUnderClick);

            if (allUnderClick.length > 0) {
                var topMost = allUnderClick[0];

                //*sigh* so inefficient... but for now its fine
                for (var key in allUnderClick)
                    if (allUnderClick[key].base.zindex > topMost.base.zindex ||
                       (allUnderClick[key].base.zindex == topMost.base.zindex &&
                       allUnderClick[key].base.zoffset > topMost.base.zoffset))
                        topMost = allUnderMouse[key];

                allUnderClick.splice(key, 1);

                for (var key in allUnderClick)
                    allUnderClick[key].base.raiseEvent("click", { x: cX, y: cY, topMost: false });

                topMost.base.raiseEvent("click", { x: cX, y: cY, topMost: true });
            }

            var clickedTile = findClosest(this.engine, "Tile", { x: cX, y: cY }, 0);

            if (clickedTile) {
                var towerOnTile = findClosest(this.engine, "Tower", { x: cX, y: cY }, 0);
                var pathOnTile = findClosest(this.engine, "Path", { x: cX, y: cY }, 0);

                if (!towerOnTile && !pathOnTile && this.money - 50 >= 0) {
                    this.money -= 50;
                    this.base.addObject(new Tower(clickedTile.tPos.x, clickedTile.tPos.y, clickedTile.tPos.w, clickedTile.tPos.h));
                }
                else if (towerOnTile) {
                    towerOnTile.tryUpgrade();
                }
            }
        }
    };
    
/** Function */
    this.draw = function () {

        pen = this.pen;
        pen.fillStyle = "black";
        ink.rect(0, 0, width, height, pen);
        pen.font = "25px Helvetica";
        pen.fillStyle = "#2233FF";
        ink.text(10, bH + 30, "Health: " + this.health, pen);
        ink.text(10, bH + 60, "Money: $" + this.money, pen);
        ink.text(10, bH + 90, "Time passed: " + gameTimeAccumulated, pen);
        ink.text(10, bH + 120, "FPS: " + this.lastFPS, pen);
        ink.text(10, bH + 150, "Bugs: " + eng.base.lengths.Bug, pen);
        
        this.pen.save();
        this.pen.strokeStyle = "red";
        //drawTree(this, "Tile", this.pen);
        //drawTree(this, "Tower", this.pen);
        //drawTree(this, "Bug", this.pen);
        this.pen.restore();        
    };
}