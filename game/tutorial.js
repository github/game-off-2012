//Functions by running through a set of predefined commands object states.
//For each state it adds the objects to the local engine, then runs the
//game until advanceState is called, at which point it removes the prev objects
//and goes to the next state.

var tutorialstates = {};
tutorialstates.start = function start() {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this);

    this.added = function () {
        var message = new Button(
            { x: 200, y: 200, w: 200, h: 140 }, "Welcome to GitDefence! Click me to begin the tutorial!",
            getGame(this), "advanceState");
        message.textControl.fontSize = 20;
        message.textControl.lineSpacing = 1.5;
        this.base.addObject(message);

        getGame(this).underlyingGame.lvMan.nwicounter = 1 / 0; //Lol, purposely dividing by 0 to get infinity
    }
};

tutorialstates.startPlace = function startPlace() {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this);

    //What we want them to drag from!
    this.targetDragger = null;

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        var message = new Button(
            { x: 200, y: 200, w: 200, h: 140 }, "Click on a tower to begin placement. Do this now.");
        message.textControl.fontSize = 20;
        message.textControl.lineSpacing = 1.5;
        this.base.addObject(message);


        var towerDraggers = realGame.engine.base.allChildren.TowerDragger;
        var firstTowerDragger = getAnElement(towerDraggers);
        this.targetDragger = firstTowerDragger;


        var allMouseThrough = new AllMouseThrough(this.targetDragger.tPos);
        this.base.addObject(allMouseThrough);
    }

    this.update = function () {
        if(this.targetDragger.dragPos)
            getGame(this).advanceState();
    }
};

tutorialstates.endPlace = function endPlace() {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this);

    //What we want them to drag from!
    this.targetDragger = null;

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        var message = new Button(
            { x: 200, y: 200, w: 200, h: 140 }, "Click on a tile to place the tower.");
        message.textControl.fontSize = 20;
        message.textControl.lineSpacing = 1.5;
        this.base.addObject(message);


        var towerDraggers = realGame.engine.base.allChildren.TowerDragger;
        var firstTowerDragger = getAnElement(towerDraggers);
        this.targetDragger = firstTowerDragger;


        var pathStart = getAnElement(realGame.engine.base.allChildren.Path_Start);
        var TILE_SIZE = pathStart.tPos.w;
        var tile = findClosest(realGame.engine, "Tile", {x: TILE_SIZE * 3, y: TILE_SIZE * 5}, 0);
        this.tile = tile;


        var allMouseThrough = new AllMouseThrough(tile.tPos);
        this.base.addObject(allMouseThrough);
    }

    //I am just turning this into a state machine
    var curStatePos = 0;
    this.update = function () {
        switch(curStatePos)
        {
            case 0:
                if(this.targetDragger.dragPos)
                    curStatePos++;
                break;
            case 1:
                if(!this.targetDragger.dragPos) //Give it a tick to respond to this
                    curStatePos++;
                break;
            case 2:
                var redirectedInput = getGame(this).underlyingGame.input;

                redirectedInput.muX = this.tile.tPos.x;
                redirectedInput.muY = this.tile.tPos.y;

                curStatePos++;
                break;
            case 3:
                getGame(this).advanceState();
                break;
        }
    }
};

tutorialstates.spawnEnemies = function spawnEnemies() {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this);

    //What we want them to drag from!
    this.targetDragger = null;

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        var message = new Button(
            { x: 200, y: 200, w: 200, h: 140 }, "Now watch your tower kill the bugs!");
        message.textControl.fontSize = 20;
        message.textControl.lineSpacing = 1.5;
        this.base.addObject(message);

        realGame.lvMan.levels = [
            {
                5: [
                    function () { return { attack: bugAttackTypes.BugBullet }; },
                    AllAlleleGroups.targetBase,
                    AllAlleleGroups.rangeBase,
                    function () { return { speed: 20 }; },
                    function () { return { attSpeed: 0 }; }, //We don't want it to attack
                ],
                waveTime: 1/0,
                spawnDelay: 1,
                attributeModifier: 1,
            }
        ];
        realGame.lvMan.nwicounter = 0;
    }

    var bugsSent = false;
    this.update = function() {
        var realGame = getGame(this).underlyingGame;

        if(realGame.engine.base.allLengths.Bugs > 0)
            bugsSent = true;
        else if(bugsSent && realGame.engine.base.allLengths.Bugs == 0)
            getGame(this).advanceState();
    }
};

tutorialstates.done = function done() {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this);

    //What we want them to drag from!
    this.targetDragger = null;

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        var message = new Button(
            { x: 200, y: 200, w: 200, h: 140 }, "You have finished the tutorial!");
        message.textControl.fontSize = 20;
        message.textControl.lineSpacing = 1.5;
        this.base.addObject(message);
    }
};

//Makes it so the user can still click on the main game.
//This is done like this to restrict what they can click on, just passing all events on
//is as simple as: this.screenSystem.bindInput(underlyingGame.input); when we gain focus.
function AllMouseThrough(pos) {
    this.base = new BaseObj(this, 0);
    this.tPos = pos;

    /* States we pass through
    this.mX = -1;
    this.mY = -1;
    this.mdX = -1; //Mouse down
    this.mdY = -1;
    this.muX = -1; //Mouse up
    this.muY = -1;
    */

    this.mouseover = function (e) {
        var redirectedInput = getGame(this).underlyingGame.input;

        redirectedInput.mX = e.x;
        redirectedInput.mY = e.y;
    }

    this.mousedown = function (e) {
        var redirectedInput = getGame(this).underlyingGame.input;

        redirectedInput.mdX = e.x;
        redirectedInput.mdY = e.y;
    }

    this.mouseup = function (e) {
        var redirectedInput = getGame(this).underlyingGame.input;

        redirectedInput.muX = e.x;
        redirectedInput.muY = e.y;
    }

    this.draw = function (pen) {
        pen.fillStyle = "rgba(255, 255, 255, 0.5)";
        pen.strokeStyle = "transparent";

        ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
    };
}

//This is always on, as it makes the underlying game look more responsive,
//and shouldn't trigger any actions.
function MouseMoveThrough(pos) {
    this.base = new BaseObj(this, 0);
    this.tPos = pos;

    this.mouseover = function (e) {
        var redirectedInput = getGame(this).underlyingGame.input;

        redirectedInput.mX = e.x;
        redirectedInput.mY = e.y;
    }
}

function hardcodePath(underlyingGame) {
    underlyingGame.engine.base.removeAllType("Path");

    var eng = underlyingGame.engine;

    var pathStart = getAnElement(eng.base.allChildren.Path_Start);
    var pathEnd = getAnElement(eng.base.allChildren.Path_End);

    var TILE_SIZE = pathStart.tPos.w;

    pathStart.tPos.x = TILE_SIZE * 0;
    pathStart.tPos.y = TILE_SIZE * 0;

    pathEnd.tPos.x = TILE_SIZE * 3;
    pathEnd.tPos.y = TILE_SIZE * 11;

    var curX = 0;
    var curY = 0;

    var curPath = pathStart;

    function placePath() {
        var prevPath = curPath;
        curPath = new Path(curX * TILE_SIZE, curY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        prevPath.nextPath = curPath;
        eng.base.addObject(curPath);
    }

    curY++;
    placePath();

    curX++;
    placePath();

    while (curY < 6) {
        curY++;
        placePath();
    }

    curX++;
    placePath();

    while (curY < 11) {
        curY++;
        placePath();
    }
    

    curPath.nextPath = pathEnd;
}

function Tutorial(pos) {
    var underlyingGame = new GitDefence(pos);
    this.underlyingGame = underlyingGame;

    hardcodePath(underlyingGame);

    //Runs before the underlyingGame, but draws after... this isn't neccessarily inconsistent
    var localEngine = new Engine(pos, this);
    this.localEngine = localEngine;

    this.input = new InputHandler();

    localEngine.base.addObject(new MouseMoveThrough(underlyingGame.engine.tPos));

    
    this.states = [];

    for (var key in tutorialstates)
        this.states.push(tutorialstates[key]);

    this.curState = null;
    this.curStatePos = -1;
            

    this.advanceState = function () {
        var prevState = this.curState;
        if (prevState) {
            prevState.base.destroySelf();
        }

        this.curStatePos++;
        
        if (this.states[this.curStatePos]) {
            this.curState = new this.states[this.curStatePos]();
            localEngine.base.addObject(this.curState);
        }
    }
    this.advanceState();

    this.run = function (timestamp) {
        this.input.handleEvents(localEngine);

        localEngine.run(timestamp);
        underlyingGame.run(timestamp);
    };

    this.draw = function (pen) {
        underlyingGame.draw(pen);
        localEngine.base.draw(pen);
    };

    this.gainFocus = function () {
        //this.screenSystem.bindInput(underlyingGame.input);
    }
}
