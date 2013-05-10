//Functions by running through a set of predefined commands object states.
//For each state it adds the objects to the local engine, then runs the
//game until advanceState is called, at which point it removes the prev objects
//and goes to the next state.


function addTextDisplay(text, obj) {
    var message = new QTextBox(new Rect(176, 16, 318, 0), text);
    obj.base.addChild(message);
}

function ContinueButton() {
    // Hardcoded position
    this.tpos = new Rect(400, 344, 90, 30);
    this.base = new BaseObj(this);

    var button = new Button("Continue", bind(this, "continue")).resize(this.tpos);
    this.base.addChild(button);

    this.continue = function() {
        getGame(this).advanceState();
    }
}

var tutorialstates = {};
tutorialstates.start = function start() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    this.added = function () {
        addTextDisplay("Welcome to GitDefence! Click continue!", this);
        this.base.addChild(new ContinueButton());

        getGame(this).underlyingGame.lvMan.nwicounter = 1 / 0; //Lol, purposely dividing by 0 to get infinity
    }
};

tutorialstates.startPlace = function startPlace() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    //What we want them to drag from!
    this.targetDragger = null;

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        addTextDisplay("Click on a tower to begin placement. Do this now.", this);


        var towerDraggers = realGame.engine.base.allChildren.TowerDragger;
        var firstTowerDragger = getAnElement(towerDraggers);
        this.targetDragger = firstTowerDragger;

        var allMouseThrough = new AllMouseThrough(this.targetDragger.tpos);
        this.base.addChild(allMouseThrough);
    }

    this.update = function () {
        if(this.targetDragger.placingTower)
            getGame(this).advanceState();
    }
};
tutorialstates.endPlace = function endPlace() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    //What we want them to drag from!
    this.targetDragger = null;

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        addTextDisplay("Click on a tile to place the tower.", this);


        var towerDraggers = realGame.engine.base.allChildren.TowerDragger;
        var firstTowerDragger = getAnElement(towerDraggers);
        this.targetDragger = firstTowerDragger;

        var pathStart = getAnElement(realGame.engine.base.allChildren.Path_Start);
        var TILE_SIZE = pathStart.tpos.w;
        var tile = findClosestToPoint(realGame.engine, "Tile", {x: TILE_SIZE * 3, y: TILE_SIZE * 5}, 0);
        this.tile = tile;


        var allMouseThrough = new AllMouseThrough(tile.tpos);
        this.base.addChild(allMouseThrough);
    }

    var wait = false;
    var time = 0;
    this.update = function () {
        var realGame = getGame(this).underlyingGame;

        var pathStart = getAnElement(realGame.engine.base.allChildren.Path_Start);
        var TILE_SIZE = pathStart.tpos.w;
        var tower = findClosestToPoint(realGame.engine, "Tower", {x: TILE_SIZE * 3, y: TILE_SIZE * 5}, 0);

        if(tower) {
            tower.genes.replaceAlleles(
                [
                    new Allele("attack1", {attack: allAttackTypes.Laser}),
                    new Allele("targetBase", {target: targetStrategies.Closest}),
                    new Allele("starterTower",
                        {range: 100, damage: 10, hp: 100, attSpeed: 1}
                    ),
                ]);
            getGame(this).advanceState();
        }
    }
};

tutorialstates.spawnEnemies = function spawnEnemies() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        addTextDisplay("Now watch your tower kill the bugs!", this);

        tutorialLevelOne.waves[0].deadTrigger = bind(getGame(this), "advanceState");
        realGame.lvMan.loadLevel(tutorialLevelOne);
    }
};

tutorialstates.clickOnTower = function clickOnTower() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        addTextDisplay("You can click on your tower to select it. After selecting a tower its attributes are displayed in the sidebar. Towers are selected by default when placed.", this);

        this.base.addChild(new ContinueButton());
    }
};
tutorialstates.buyAlleles = function buyAlleles() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        addTextDisplay("You can buy 'allele' points which allow you to increase your tower attributes. Buy points now.", this);


        var allelePointSystem = getAnElement(realGame.engine.base.allChildren.AllelePointSystem);
        var buyButton = allelePointSystem.buyButton;

        var allMouseThrough = new AllMouseThrough(buyButton.tpos);
        this.base.addChild(allMouseThrough);
    };

    this.update = function () {
        var realGame = getGame(this).underlyingGame;

        if(realGame.selectedObj && realGame.selectedObj.allelesGenerated.length > 0)
            getGame(this).advanceState();
    };
};
tutorialstates.spendAlleles = function spendAlleles() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        addTextDisplay("You can spend your allele points or trash them. When hovering over the spend and trash button the change the allele will cause is shown in the tower attributes. Also, you can automatically trash attributes which are equal or worse in all aspects to your current attributes. This is on by default.", this);


        var allelePointSystem = getAnElement(realGame.engine.base.allChildren.AllelePointSystem);

        var spendButton = allelePointSystem.spendButton;
        var allMouseThrough = new AllMouseThrough(spendButton.tpos);
        this.base.addChild(allMouseThrough);

        var trashButton = allelePointSystem.trashButton;
        var allMouseThrough = new AllMouseThrough(trashButton.tpos);
        this.base.addChild(allMouseThrough);

        var autoTrashButton = allelePointSystem.autoTrashButton;
        var allMouseThrough = new AllMouseThrough(autoTrashButton.tpos);
        this.base.addChild(allMouseThrough);
    }

    this.update = function () {
        var realGame = getGame(this).underlyingGame;

        if(realGame.selectedObj && realGame.selectedObj.allelesGenerated.length == 0)
            getGame(this).advanceState();
    }
};

tutorialstates.placeAnotherTower = function placeAnotherTower() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    //What we want them to drag from!
    this.targetDragger = null;

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        addTextDisplay("Now place another tower close to your existing tower.", this);


        var towerDraggers = realGame.engine.base.allChildren.TowerDragger;
        var firstTowerDragger = getAnElement(towerDraggers);
        this.targetDragger = firstTowerDragger;

        var allMouseThrough = new AllMouseThrough(this.targetDragger.tpos);
        this.base.addChild(allMouseThrough);


        var pathStart = getAnElement(realGame.engine.base.allChildren.Path_Start);
        var TILE_SIZE = pathStart.tpos.w;
        var tile = findClosestToPoint(realGame.engine, "Tile", {x: TILE_SIZE * 5, y: TILE_SIZE * 6}, 0);
        this.tile = tile;

        var allMouseThrough = new AllMouseThrough(tile.tpos);
        this.base.addChild(allMouseThrough);
    }

    this.update = function () {
        var realGame = getGame(this).underlyingGame;

        var pathStart = getAnElement(realGame.engine.base.allChildren.Path_Start);
        var TILE_SIZE = pathStart.tpos.w;
        var tower = findClosestToPoint(realGame.engine, "Tower", {x: TILE_SIZE * 5, y: TILE_SIZE * 6}, 0);

        if(tower) {
            tower.genes.replaceAlleles(
                [
                    new Allele("attack1", {attack: allAttackTypes.Laser}),
                    new Allele("targetBase", {target: targetStrategies.Closest}),
                    new Allele("starterTower",
                        {range: 10, damage: 10, hp: 100, attSpeed: 1}
                    ),
                ]);
            getGame(this).advanceState();
        }
    }
};

tutorialstates.networkTowerStart = function networkTowerStart() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    //What we want them to drag from!
    this.targetDragger = null;

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        addTextDisplay("Click and hold on a tower to begin making a network.", this);

        var pathStart = getAnElement(realGame.engine.base.allChildren.Path_Start);
        var TILE_SIZE = pathStart.tpos.w;
        var tile = findClosestToPoint(realGame.engine, "Tile", {x: TILE_SIZE * 3, y: TILE_SIZE * 5}, 0);
        this.tile = tile;

        var allMouseThrough = new AllMouseThrough(tile.tpos);
        this.base.addChild(allMouseThrough);
    }

    this.update = function () {
        var realGame = getGame(this).underlyingGame;

        var pathStart = getAnElement(realGame.engine.base.allChildren.Path_Start);
        var TILE_SIZE = pathStart.tpos.w;
        var tower = findClosestToPoint(realGame.engine, "Tower", {x: TILE_SIZE * 3, y: TILE_SIZE * 5}, 0);

        if(tower && tower.startDrag) {
            getGame(this).advanceState();
        }
    }
};

tutorialstates.networkTowerEnd = function networkTowerEnd() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    //What we want them to drag from!
    this.targetDragger = null;

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        addTextDisplay("Drag and release to another tower to finish the connection.", this);


        var pathStart = getAnElement(realGame.engine.base.allChildren.Path_Start);
        var TILE_SIZE = pathStart.tpos.w;
        var tile = findClosestToPoint(realGame.engine, "Tile", {x: TILE_SIZE * 5, y: TILE_SIZE * 6}, 0);
        this.tile = tile;

        var allMouseThrough = new AllMouseThrough(tile.tpos);
        this.base.addChild(allMouseThrough);

        this.base.addChild(new MouseMoveThrough(realGame.engine.tpos));
        this.base.addChild(new MouseUpThrough(realGame.engine.tpos));
    }

    this.update = function () {
        var realGame = getGame(this).underlyingGame;

        var pathStart = getAnElement(realGame.engine.base.allChildren.Path_Start);
        var TILE_SIZE = pathStart.tpos.w;
        var tower = findClosestToPoint(realGame.engine, "Tower", {x: TILE_SIZE * 3, y: TILE_SIZE * 5}, 0);

        if(!tower.startDrag) {
            if(tower) {
                if(tower.connections.length > 0)
                    getGame(this).advanceState();
                else
                    getGame(this).setState(tutorialstates.networkTowerStart);
            } else {
                getGame(this).setState(tutorialstates.networkTowerStart);
            }
        }
    }
};

tutorialstates.spawnEnemies2 = function spawnEnemies2() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        addTextDisplay("Now watch your tower kill the bugs!", this);

        tutorialLevelTwo.waves[0].deadTrigger = bind(getGame(this), "advanceState");
        realGame.lvMan.loadLevel(tutorialLevelTwo);
    }
};

tutorialstates.done = function done() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    //What we want them to drag from!
    this.targetDragger = null;

    this.added = function () {
        var realGame = getGame(this).underlyingGame;

        addTextDisplay("And thats it! Good luck!", this);

        this.base.addChild(new ContinueButton());
    }
};

tutorialstates.switchToGame = function switchToGame() {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this);

    //What we want them to drag from!
    this.targetDragger = null;

    this.added = function () {
        getGame(this).screenSystem.setActiveScreen("MainGame");
    }
};

//Makes it so the user can still click on the main game.
//This is done like this to restrict what they can click on, just passing all events on
//is as simple as: this.screenSystem.bindInput(underlyingGame.input); when we gain focus.
function AllMouseThrough(pos) {
    this.base = new BaseObj(this, 0);
    this.tpos = pos;

    /* States we pass through
    this.mX = -1;
    this.mY = -1;
    this.mdX = -1; //Mouse down
    this.mdY = -1;
    this.muX = -1; //Mouse up
    this.muY = -1;
    */

    this.mousemove = function (e) {
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

        ink.rect(this.tpos.x, this.tpos.y, this.tpos.w, this.tpos.h, pen);
    };
}

//This is always on, as it makes the underlying game look more responsive,
//and shouldn't trigger any actions.
function MouseMoveThrough(pos) {
    this.base = new BaseObj(this, 0);
    this.tpos = pos;

    this.mousemove = function (e) {
        var redirectedInput = getGame(this).underlyingGame.input;

        redirectedInput.mX = e.x;
        redirectedInput.mY = e.y;
    }
}

//This is always on, as it makes the underlying game look more responsive,
//and shouldn't trigger any actions.
function MouseUpThrough(pos) {
    this.base = new BaseObj(this, 0);
    this.tpos = pos;

    this.mouseup = function (e) {
        var redirectedInput = getGame(this).underlyingGame.input;

        redirectedInput.muX = e.x;
        redirectedInput.muY = e.y;
    }
}

function hardcodePath(underlyingGame) {
    underlyingGame.engine.base.removeAllType("Path");

    var eng = underlyingGame.engine;

    var pathStart = getAnElement(eng.base.allChildren.Path_Start);
    var pathEnd = getAnElement(eng.base.allChildren.Path_End);

    var TILE_SIZE = pathStart.tpos.w;

    pathStart.tpos.x = TILE_SIZE * 0;
    pathStart.tpos.y = TILE_SIZE * 0;

    pathEnd.tpos.x = TILE_SIZE * 3;
    pathEnd.tpos.y = TILE_SIZE * 11;

    var curX = 0;
    var curY = 0;

    var curPath = pathStart;

    function placePath() {
        var prevPath = curPath;
        curPath = new Path_Piece(curX * TILE_SIZE, curY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        prevPath.nextPath = curPath;
        eng.base.addChild(curPath);
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

    localEngine.base.addChild(new MouseMoveThrough(underlyingGame.engine.tpos));

    
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
            localEngine.base.addChild(this.curState);
        }
    }
    this.advanceState();

    this.setState = function(newState) {
        for(var num in this.states)
            if(this.states[num] == newState) {
                this.curStatePos = num - 1; //Really really hackish... but it should work
                this.advanceState();
                break;
            }
    }

    var first = false;
    this.run = function (timestamp) {
        if(first) {
            this.setState(tutorialstates.done);
            first = false;
        }
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
