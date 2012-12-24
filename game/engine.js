//A specialized object which serves as the top level object for any simulation system.
//The specific type of game is determined by the game object that holds this, and by the objects in the system.

//For now engine does both simulation and drawing, in the future it should only do simulation.

//NOTHING IN HERE SHOULD BE SPECIFIC TO ANY GAME!
//(However some things which are no in all games but are in many games may
//be in here... as that is just really useful.)

function Engine(pos, game) {
    this.game = game; //Allows object to access information on the total game-state.

    this.tPos = pos;
    this.color = "black";
    
    this.base = new BaseObj(this);

    //Usage of this will likely become deprecated
    this.engine = this; //eng also works fine

    this.speed = 1;

    this.lastFPS = 60;

    //https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame
    var firstStart = Date.now();
    var curFrameCounter = 0;
    var lastFPSUpdate = firstStart;
    var gameTimeAccumulated = 0;
    this.run = function (timestamp) {
        if (DFlag.engineTicks)
            DFlag.engineTicks++;

        var updateAmount = timestamp - firstStart;
        firstStart = timestamp;

        updateAmount = Math.min(updateAmount, 100);

        curFrameCounter++;
        if (lastFPSUpdate + 1000 < timestamp) {
            this.lastFPS = curFrameCounter;
            curFrameCounter = 0;
            lastFPSUpdate = timestamp;
        }

        updateAmount *= this.speed;

        gameTimeAccumulated += updateAmount;

        var newObjects = this.base.update(updateAmount / 1000);

        for (var key in newObjects)
            this.base.addObject(newObjects[key]);        
    };

    this.update = function (dt) {
        this.curQuadTree = new QuadTree(this.base.allChildren);
    };
}
