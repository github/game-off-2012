function Engine(pen) {
    this.mX = -1;
    this.mY = -1;
    this.pen = pen;

    this.id = 0;
    this.money = 1000;
    this.health = 100;

    this.lastTowerHover = null;

    this.base = new baseObj("Engine");

    this.base.children.Tile = [];
    this.base.children.Bug = [];

    this.engine = this; //eng also works fine

    this.maxBugs = 2;
    this.bugIncrease = 1;
    this.bugIncInc = 0.1;

    this.maxBugs = 3000;
    this.bugIncrease = 0;
    this.bugIncInc = 0;

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

        this.update(updateAmount / 1000);
        this.draw();
        window.reqAnim(this.run.bind(this));
    };
    
/** Function */
    this.update = function (dt) {
        mX = this.mX;
        mY = this.mY;

        this.curQuadTree = new QuadTree(this.base.children, -100, 1000, -100, 1000);

        var bugs = this.base.children.Bug;

        while (bugs.length < this.maxBugs) {
            var bugStart = eng.base.children["Path_Start"][0];
            var newBug = new Bug(bugStart, 4);
            this.base.addObject(newBug);
        }

        this.base.removeAllType("Tower_Range");
        if (this.mY > 0 && this.mY < bH && this.mX > 0 && this.mX < bW) {

            var tower = findClosest(this.engine, "Tower", { x: mX, y: mY }, 0);

            if (tower) {
                tower = findClosest(this.engine, "Tower", { x: mX, y: mY }, 0);
                this.base.addObject(new Tower_Range(tower.tPos.x - tower.range + tileSize * 0.5, tower.tPos.y - tower.range + tileSize * 0.5, tower.range * 2, tower.range * 2));

                if (tower != this.lastTowerHover)
                    document.getElementById("towerinfo").innerHTML = JSON.stringify(tower.attr);
                //this.lastTowerHover = tower;
            }


            var curTile = findClosest(this.engine, "Tile", { x: this.mX, y: this.mY }, 1000);
            curTile.hover = true;
        }

        this.secondTimer -= dt;

        if (this.secondTimer < 0) {
            this.secondTimer = 1;

            this.maxBugs += this.bugIncrease;
            this.bugIncrease += this.bugIncInc;
        }

        var objsToAdd = this.base.update(dt);

        for (var i = 0; i < objsToAdd.length; i++)
            this.base.addObject(objsToAdd[i]);

        this.base.removeMarked();
    };
    
/** Function */
    this.click = function (e) {
        var cX = e.offsetX;
        var cY = e.offsetY;

        if (cY > 0 && cY < bH && cX > 0 && cX < bW) {

            var clickedTile = findClosest(this.engine, "Tile", { x: e.offsetX, y: e.offsetY }, 0);

            if (clickedTile) {
                var towerOnTile = findClosest(this.engine, "Tower", { x: e.offsetX, y: e.offsetY }, 0);
                var pathOnTile = findClosest(this.engine, "Path", { x: e.offsetX, y: e.offsetY }, 0);

                if (!towerOnTile && !pathOnTile && this.money - 50 >= 0) {
                    this.money -= 50;
                    this.base.addObject(new Tower(clickedTile.tPos.x, clickedTile.tPos.y, clickedTile.tPos.w, clickedTile.tPos.h));
                }
                else if (towerOnTile) {
                    towerOnTile.tryUpgrade();
                }
            } else {
                if (clickedTile.object.click) {
                    clickedTile.object.click();
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
        ink.text(10, bH + 150, "Bugs: " + eng.base.children.Bug.length, pen);

        this.base.draw(pen);

        this.pen.save();
        this.pen.strokeStyle = "red";
        //drawTree(this, "Tile", this.pen);
        drawTree(this, "Tower", this.pen);
        this.pen.restore();        
    };
}