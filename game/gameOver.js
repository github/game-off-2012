//Most references to eng in this should likely just reference base.parent.

function GameOver() {
    this.base = new BaseObj(this, 100);

    this.eng;

    this.alpha = 0;

    this.added = function() {
        this.eng = this.base.rootNode;

        this.base.addObject(new SimpleCallback(2, "addButton"));

        this.base.rootNode.base.addObject(new AttributeTween(1, 0, 5, null, "speed"));

        this.base.addObject(new AttributeTween(0, 0.8, 3, null, "alpha"));
    }

    this.nothing = function() {}

    this.addButton = function() {
        this.base.addObject(new Button("Restart", bind(window.location, "reload"), 102).resize(new Rect(360, 300, 100, 30)));
    }

    this.draw = function(pen) {
        var eng = this.base.rootNode;

        pen.fillStyle = "rgba(0, 0, 0, " + this.alpha + ")"; //"hsl(180, 50%, 50%, " + this.alpha + ")";

        ink.rect(0, 0, eng.box.w, eng.box.h, pen);


        var pos = new Rect(240, 230, 100, 30);
        //Hack because of zorder bug
        pen.fillStyle = "Red";
        pen.font = "70px courier";
        ink.text(pos.x, pos.y, "Game Over!", pen);
    }
}