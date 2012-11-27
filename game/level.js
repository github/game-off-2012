function LevelData(b, d, l, nwi) {
    this.bugs = b;
    this.delay = d;
    this.lv = l;
    this.nextWaveIn = nwi;
}

function LevelManager(bugStart) {
    this.base = new baseObj(this, 0);
    
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
            if (this.nwicounter <= 0) {
                alert("Next wave incoming");
                this.doneWave = true;
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
}
