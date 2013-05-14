//Most references to eng in this should likely just reference base.parent.

function GameOver() {
    var self = this;

    self.base = new BaseObj(self, 100);

    self.alpha = 0;

    self.added = function() {
        self.base.addChild(new SimpleCallback(2, "addButton"));

        var eng = self.base.rootNode;
        eng.base.addChild(new AttributeTween(1, 0, 5, null, "speed"));

        self.base.addChild(new AttributeTween(0, 0.8, 3, null, "alpha"));
    }

    var restartButton = new Button("Restart", bind(window.location, "reload"));
    self.addButton = function() {
        restartButton.resize(new Rect(360, 300, 100, 30));
        self.base.addChild(restartButton);
    }

    self.draw = function(pen) {
        var eng = self.base.rootNode;
        pen.fillStyle = rgba(0, 0, 0, self.alpha).str();
        pen.fillRect(0, 0, eng.tpos.w, eng.tpos.h, pen);

        var pos = new Rect(240, 230, 100, 30);
        //Hack because of zorder bug
        pen.fillStyle = "Red";
        pen.font = "70px courier";
        pen.textAlign = "left";
        ink.text(pos.x, pos.y, "Game Over!", pen);
    }
}
