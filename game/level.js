function LevelData(b, d, l, nwi) {
    this.bugs = b;
    this.delay = d;
    this.lv = l;
    this.nextWaveIn = nwi;
}

function WaveVisualizer(wvpos, ldata) {
    this.base = new baseObj(this, 9);

    this.update = function(dt) {
        return;
    }

    this.die = function() {
        this.destroyAtBase();
    }

    this.moveTo = function(x, y) {
        wvpos.x = x;
        wvpos.y = y;
    }

    this.resetTo = function(x, y, wvinfo) {
        ldata = wvinfo;
        this.moveTo(x, y);
    }

    this.draw = function (pen) {
        pen.fillStyle = "green";
        ink.rect(wvpos.x, wvpos.y, wvpos.w, wvpos.h, pen);
        pen.fillStyle = "blue";
        pen.font = "10px courier";
        ink.text(wvpos.x+5, wvpos.y+20, "Bugs:  " + ldata.bugs, pen);
        ink.text(wvpos.x+5, wvpos.y+35, "Level: " + ldata.lv, pen);
        return;
    }
}




function LevelManager(bugStart, lmpos) {
    this.base = new baseObj(this, 10);
    
    //Should get rid of these
    this.bugIncrease = 10;
    this.bugDifficulty = 1;
    this.bugDelay =0;

    this.validGameConfig = false;
    this.doneWave = true;
    this.counter = 0;
    this.nwicounter = 0;
    this.bugsleft;

    //Things in next wave
    var nextWv = new LevelData(5, 2, 0, 10);

    //Things in this wave
    var currWv = new LevelData(0,0,0,0);

    //Next wave graphic indicator
    var nextWvVis = new WaveVisualizer(new temporalPos(lmpos.x, lmpos.y+lmpos.h+(nextWv.nextWaveIn*30), 100, 50), nextWv);
    this.base.addObject(nextWvVis);


    this.update = function (dt) {
        //Set next wave
        if (this.doneWave == true) {
            //Set current wave to next wave
            currWv = nextWv;

            //Make new wave
            nextWv = new LevelData(currWv.bugs*2, currWv.delay/10, currWv.lv + 1, currWv.nextWaveIn);
            this.doneWave = false;
            this.nwicounter = currWv.nextWaveIn;
            this.bugsleft = currWv.bugs;
        }

        if (this.bugsleft <= 0) {
            this.nwicounter -= dt;
            nextWvVis.moveTo(lmpos.x, lmpos.y+lmpos.h+(this.nwicounter*30));
            if (this.nwicounter <= 0) {
                //alert("Next wave incoming");
                this.doneWave = true;
                nextWvVis.resetTo(lmpos.x, lmpos.y+lmpos.h+(nextWv.nextWaveIn*30), nextWv);
            }
        }

        if (this.counter <= 0 && this.bugsleft > 0) {
            this.base.addObject(new Bug(bugStart, 1));
            this.counter = currWv.delay;
            this.bugsleft -= 1;
            //alert(this.bugsleft);
        }
        this.counter -= dt;
    }
    
    this.draw = function (pen) {
        pen.fillStyle = "white";
        ink.rect(lmpos.x, lmpos.y, lmpos.w, lmpos.h, pen);

        pen.fillStyle = "blue";
        pen.font = "10px courier";
        ink.text(lmpos.x, lmpos.y+20, "Next wave in: " + this.nwicounter, pen);
        return;
    }
}
