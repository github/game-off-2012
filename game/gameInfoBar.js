
//Make list with lits of alleles to create default tower types.

function GameInfoBar(pos) {
    console.log("GameInfoBar pos:", pos);
    this.tPos = pos;
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
    this.base.addObject(hbox);
    hbox.resize(pos);

    this.skipNextLevel = function() {
        getGame(this).lvMan.nwicounter = -1;
    }

    this.update = function () {
        var game = this.base.rootNode.game;
        var eng = this.base.rootNode;

        healthIndi.text("HP: " + roundToDecimal(game.health, 1));
        moneyIndi.text("$$$: " + prefixNumber(game.money, 2));
        FPSIndi.text("FPS: " + roundToDecimal(eng.lastFPS, 2));
        bugIndi.text("Bugs: " + roundToDecimal(eng.base.allLengths.Bug, 2));

        curWaveIndi.text("Current Level: " + roundToDecimal(game.lvMan.curWave, 2));
        nextLevelTimeIndi.text("Sec To Next Level: " + roundToDecimal(game.lvMan.nwicounter, 0));
        
//         if (game.health < 50) {
// 	        healthIndi.color = "yellow";
// 	    }
// 	    if (game.health < 25) {
// 	        healthIndi.color = "red";
// 	    }
// 	    if (oldmoney < game.money) {
// 	        oldmoney = game.money;
// 		    this.base.addObject( new TextFadeAni(this.moneyIndi.tPos, false, "$$$$$"));
// 		} else if (oldmoney > game.money) {
// 		    oldmoney = game.money;
// 		    this.base.addObject( new TextFadeAni(this.moneyIndi.tPos, true, "$$$$$"));
// 	    }
// 	
    }
}

//Should use AlphaDecay instead of implementing its alpha decay itself
//Also should likely use AttributeTween for its motion.
function TextFadeAni(pos, negative, txt) {
	this.base = new BaseObj(this, 19);
	this.tPos = pos.clone();
	if (!negative) {
		this.tPos.y -= 15;
	} else {
		this.tPos.y += 15;
	}


	var alpha = 1;

	this.draw = function (pen) {
		if (negative) {
			pen.fillStyle = "rgba(255,0,0," + alpha + ")";
		} else { 
			pen.fillStyle = "rgba(0,255,0," + alpha + ")";
		}
			
		pen.font = "24px courier";
		ink.text(this.tPos.x, this.tPos.y, txt, pen);
		return;
	}

	this.update = function (dt) {
		alpha -= dt/2;
		if (alpha <= 0) {
			this.base.destroySelf();
		}
		if (!negative) {
			this.tPos.y -= dt*5;
		} else {
			this.tPos.y += dt*5;
		}
	}
}


