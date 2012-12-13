
//Make list with lits of alleles to create default tower types.

function GameInfoBar(pos) {
    this.tPos = pos;
    this.base = new BaseObj(this, 14);

    this.tPos = pos;

    var oldmoney = 0;

	    
    this.healthIndi = new Label(
        new TemporalPos(pos.x + 9, pos.y + 25, pos.w, pos.h), "");
    this.healthIndi.font = "20px arial";
    this.healthIndi.color = "white";
    this.base.addObject(this.healthIndi);

    this.moneyIndi = new Label(
        new TemporalPos(pos.x + 9, pos.y + 50, pos.w, pos.h), "");
    this.moneyIndi.font = "20px arial";
    this.moneyIndi.color = "white";
    this.base.addObject(this.moneyIndi);

    this.FPSIndi = new Label(
        new TemporalPos(pos.x + 200, pos.y + 25, pos.w, pos.h), "");
    this.FPSIndi.font = "20px arial";
    this.FPSIndi.color = "white";
    this.base.addObject(this.FPSIndi);

    this.bugIndi = new Label(
        new TemporalPos(pos.x + 200, pos.y + 50, pos.w, pos.h), "");
    this.bugIndi.font = "20px arial";
    this.bugIndi.color = "white";
    this.base.addObject(this.bugIndi);

    this.curLevelIndi = new Label(
        new TemporalPos(pos.x + 300, pos.y + 25, pos.w, pos.h), "");
    this.curLevelIndi.font = "20px arial";
    this.curLevelIndi.color = "white";
    this.base.addObject(this.curLevelIndi);

    this.nextLevelTimeIndi = new Label(
        new TemporalPos(pos.x + 300, pos.y + 50, pos.w, pos.h), "");
    this.nextLevelTimeIndi.font = "20px arial";
    this.nextLevelTimeIndi.color = "white";
    this.base.addObject(this.nextLevelTimeIndi);


    this.gotoNextLevel = new Button(
        new TemporalPos(pos.x + 315, pos.y + 63, 190, 25), "Send Next Wave Now",
            this, "skipNextLevel");
    //this.gotoNextLevel.font = "20px arial";
    //this.gotoNextLevel.color = "white";
    this.base.addObject(this.gotoNextLevel);

    this.skipNextLevel = function()
    {
        getGame(this).lvMan.nwicounter = -1;
    }

    this.update = function () {
        var game = this.base.rootNode.game;
        var eng = this.base.rootNode;

        this.healthIndi.text = "User Health: " + roundToDecimal(game.health, 1);
        this.moneyIndi.text = "Money: $" + roundToDecimal(game.money, 2);
        this.FPSIndi.text = "FPS: " + roundToDecimal(eng.lastFPS, 2);
        this.bugIndi.text = "Bugs: " + roundToDecimal(eng.base.allLengths.Bug, 2);

        this.curLevelIndi.text = "Current Level: " + roundToDecimal(game.lvMan.curLevel, 2);
        this.nextLevelTimeIndi.text = "Sec To Next Level: " + roundToDecimal(game.lvMan.nwicounter, 0);
        if (game.health < 50) {
	        this.healthIndi.color = "yellow";
	    }
	    if (game.health < 25) {
	        this.healthIndi.color = "red";
	    }
	    if (oldmoney < game.money) {
	        oldmoney = game.money;
		    this.base.addObject( new TextFadeAni(this.moneyIndi.tPos, false, "$$$$$"));
		} else if (oldmoney > game.money) {
		    oldmoney = game.money;
		    this.base.addObject( new TextFadeAni(this.moneyIndi.tPos, true, "$$$$$"));
	    }
	
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


