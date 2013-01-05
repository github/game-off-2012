
//Make list with lits of alleles to create default tower types.

function GameInfoBar(pos) {
    console.log("GameInfoBar pos:", pos);
    this.box = pos;
    this.base = new BaseObj(this, 14);

    var oldmoney = 0;

    var hbox = new HBox();
    
    var vbox1 = new VBox();
    var healthIndi = new Label("");
    vbox1.add(healthIndi);

    var moneyIndi = new Label("");
    vbox1.add(moneyIndi);

    var FPSIndi = new Label("");
    vbox1.add(FPSIndi);

    var bugIndi = new Label("");
    vbox1.add(bugIndi);

    var vbox3 = new VBox();
    var curWaveIndi = new Label("");
    vbox3.add(curWaveIndi);

    var nextLevelTimeIndi = new Label("");
    vbox3.add(nextLevelTimeIndi);
    
    gotoNextLevel = new Button("Send Next Wave Now", bind(this, "skipNextLevel"));
    vbox3.add(gotoNextLevel);
    
    hbox.add(vbox1);
    hbox.add(vbox3);
    this.base.addChild(hbox);
    hbox.resize(pos);

    this.skipNextLevel = function() {
        getGame(this).lvMan.nwicounter = -1;
    }
    
    var accumulatedTime = 0;
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
        }

        curWaveIndi.text("Current Level: " + round(game.lvMan.curWave, 2));
        nextLevelTimeIndi.text("Sec To Next Level: " + round(game.lvMan.nwicounter, 0));
    }
}