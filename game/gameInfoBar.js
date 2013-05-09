function GameInfoBar() {
    this.base = new BaseObj(this, 14);
    this.tpos = new Rect(0, 0, 0, 0);

    var oldmoney = 0;

    var hbox = new HBox();

    var healthIndi = new Label("");
    hbox.add(healthIndi);

    var moneyIndi = new Label("");
    hbox.add(moneyIndi);

    var FPSIndi = new Label("");
    hbox.add(FPSIndi);

    var bugIndi = new Label("");
    hbox.add(bugIndi);

    var curWaveIndi = new Label("");
    hbox.add(curWaveIndi);

    var nextLevelTimeIndi = new Label("");
    hbox.add(nextLevelTimeIndi);

    gotoNextLevel = new Button("Send Next Wave Now", bind(this, "skipNextLevel"));
    hbox.add(gotoNextLevel);

    this.base.addChild(hbox);

    this.resize = function (rect) {
        hbox.resize(rect);
        this.tpos = rect;
    }
    this.skipNextLevel = function() {
        getGame(this).lvMan.nwicounter = -1;
    }

    var accumulatedTime = 1;
    this.update = function (dt) {
        var game = this.base.rootNode.game;
        var eng = this.base.rootNode;
        accumulatedTime += dt;

        if (accumulatedTime > 1) {
            accumulatedTime -= 1;
            healthIndi.text("HP: " + round(game.health, 1));
            moneyIndi.text("$$$: " + prefixNumber(game.money, 2));
            FPSIndi.text("FPS: " + round(eng.lastFPS, 2));
            bugIndi.text("Bugs: " + round(eng.base.allLengths.Bug, 2));
            curWaveIndi.text("Current Level: " + round(game.lvMan.curWave, 2));
            nextLevelTimeIndi.text("Next Level In: " + round(game.lvMan.nwicounter, 0));
        }

    }
}
