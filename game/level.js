function LevelManager(bugStart, lmpos) {
    var levels = [    
        { 
            5: [
                    function(){return {attack: bugAttackTypes.BugBullet}; },
                    AllAlleleGroups.rangeBase,
                    function () { return { speed: 20 }; },
               ],
            waveTime: 10,
            spawnDelay: 0.1,
        },    
        { 
            5: [
                    function(){return {attack: bugAttackTypes.BugBullet}; },
                    AllAlleleGroups.rangeBase,
                    function () { return { speed: 30 }; },
               ],
            waveTime: 7,
            spawnDelay: 0.1,
        }
    ];

    this.base = new BaseObj(this, 10);
    
    //Should get rid of these
    this.bugIncrease = 10;
    this.bugDifficulty = 1;
    this.bugDelay =0;

    this.validGameConfig = false;
    this.doneWave = true;
    this.nwicounter = 0;

    this.curLevel = -1;
    this.curLevelData = levels[0];

    this.bugsToSpawn = [];
    this.spawnCounter = 0;

    this.update = function (dt) {
        var eng = this.base.rootNode;

        //Set next wave
        if (this.doneWave == true) {
            //Set current wave to next wave
            currWv = nextWv;

            //Make new wave
            this.doneWave = false;
            this.nwicounter = this.curLevelData.waveTime;
            this.bugsleft = currWv.bugs;
        }

        this.nwicounter -= dt;

        if (this.nwicounter < 0)
            this.curLevel++;
            this.curLevelData = levels[this.curLevel % levels.length];
            this.nwicounter = this.curLevelData.waveTime;

            this.bugsToSpawn = [];
            for(var part in this.curLevelData)
            {
                if(typeof part == "number")
                {
                    var bugAlleles = this.curLevelData[part];
                    for(var i = 0; i < part; i++)
                    {
                        var bug = new Bug(bugStart);
                        for(var group in bugAlleles)
                            bug.genes.addAllele(group, new Allele(bugAlleles[group]()));
                        this.bugsToSpawn.push(bug);
                    }
                }
            } //End of going through level data

            this.nwicounter = this.curLevelData.waveTime;

        } //End of starting next level

        this.spawnCounter -= dt;
        if(this.spawnCounter < 0)
        {
            this.spawnCounter = this.curLevelData.spawnDelay;
        }

    } //End of update
} //End of levelManager
