function gameOver() {
    this.base = new BaseObj(this, 100);

    this.eng;

    this.alpha = 1;

    this.added = function () {
        this.eng = this.base.rootNode;

        this.base.addObject(new SimpleCallback(0.5, "addButton"));
        //this.base.rootNode.speed = 0;

        this.base.addObject(new AttributeTween(0, 1, 10, "nothing", "alpha"));

        //this.base.addObject(new Circle(this.eng.tPos.getCenter(), 100, "yellow", "blue", 105));
    }

    this.nothing = function () { }

    this.addButton = function () {
        var pos = this.eng.tPos.getCenter();
        this.base.addObject(new Button(
                            new TemporalPos(pos.x * 0.5, pos.y * 0.5, 100, 30),
                            "Restart", window.location, "reload", null, 102));
    }

    this.draw = function (pen) {
        var eng = this.base.rootNode;

        pen.fillStyle = "hsl(180, 50%, 50%, " + this.alpha + ")";

        ink.rect(0, 0, eng.tPos.w, eng.tPos.h, pen);
    }
}