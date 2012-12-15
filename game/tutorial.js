//Functions by running through a set of predefined commands object states.
//For each state it adds the objects to the local engine, then runs the
//game until advanceState is called, at which point it removes the prev objects
//and goes to the next state.

var tutorialstates = {};
tutorialstates.one = function one() {
    this.tPos = new TemporalPos(0, 0, 0, 0);
    this.base = new BaseObj(this);

    this.added = function () {
        var message = new Button({ x: 200, y: 200, w: 200, h: 140 }, "Welcome to GitDefence! Click me to begin the tutorial!",
          getGame(this), "advanceState");
        message.textControl.fontSize = 20;
        message.textControl.lineSpacing = 1.5;
        this.base.addObject(message);
    }
};

//Makes it so the user can still click on the main game.
//This is done like this to restrict what they can click on, just passing all events on
//is as simple as: this.screenSystem.bindInput(underlyingGame.input); when we gain focus.
function ClickPassthrough(pos) {
    this.base = new BaseObj(this, 0);
    this.tPos = pos;

    /*
    this.mX = -1;
    this.mY = -1;
    this.mdX = -1; //Mouse down
    this.mdY = -1;
    this.muX = -1; //Mouse up
    this.muY = -1;
    */

    this.mousedown = 
}

function Tutorial(pos) {
    var underlyingGame = new GitDefence(pos);

    //Runs before the underlyingGame, but draws after... this isn't neccessarily inconsistent
    var localEngine = new Engine(pos, this);

    this.input = new InputHandler();

    
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