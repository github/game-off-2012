//Functions by running through a set of predefined commands object states.
//For each state it adds the objects to the local engine, then runs the
//game until advanceState is called, at which point it removes the prev objects
//and goes to the next state.

var tutorialstates = {};

tutorialstates.one = [];
tutorialstates.one.push(new Circle({ x: 50, y: 50 }, 100, "blue", "yellow", 5));

function Tutorial(pos) {
    var underlyingGame = new GitDefence(pos);

    //Runs before the underlyingGame, but draws after... this isn't neccessarily inconsistent
    var localEngine = new Engine(pos, this);

    this.input = underlyingGame.input;

    
    this.states = [];

    for (var key in tutorialstates)
        this.states.push(tutorialstates[key]);

    this.curState = null;
    this.curStatePos = -1;

    this.advanceState = function () {
        var prevState = this.states[this.curStatePos];
        if (prevState) {
            for (var key in prevState) {
                prevState[key].base.destroySelf();
            }
        }

        this.curStatePos++;
        var currentState = this.states[this.curStatePos];
        if (currentState) {
            for (var key in currentState) {
                localEngine.base.addObject(currentState[key]);
            }
        }
    }
    this.advanceState();

    this.run = function (timestamp) {
        localEngine.run(timestamp);
        underlyingGame.run(timestamp);
    };

    this.draw = function (pen) {
        underlyingGame.draw(pen);
        localEngine.base.draw(pen);
    }
}