function generateBugArray (bugStart, bugTemplate, count, attributeModifier) {
    //Needs to loop through, or else all bugs will be exactly the same
    //(their underlying generation may involve randomness
    var waveArray = [];

    for (var i = 0; i < count; i++) {
        var bug = new Bug(bugStart);
        for (var group in bugTemplate)
            bug.genes.addAllele(new Allele(group, bugTemplate[group]()));
        for (var attrName in bug.attr) {
            if (typeof bug.attr[attrName] == "number") {
                if (attrName == "speed")
                    bug.attr[attrName] *= Math.max(Math.min(attributeModifier, 0.8), 0.6);
                else
                    bug.attr[attrName] *= attributeModifier;

                if (attrName == "range")
                    bug.attr[attrName] *= Math.min(attributeModifier, 0.3);
                else
                    bug.attr[attrName] *= attributeModifier;
            }
        }
        if (bug.attr.currentHp < bug.attr.hp)
            bug.attr.currentHp = bug.attr.hp;

        waveArray.push(bug);
    }

    return waveArray;
}

function LevelManager(bugStart) {
    this.base = new BaseObj(this, 10);

    this.curLevel = null;
    this.loadLevel = function(level){
        this.nwicounter = 0;
        this.curWave = 0;

        //Array of arrays!
        this.bugsToSpawn = [];
        this.startSpawnTriggers = [];
        this.finishSpawnTriggers = [];

        this.spawnCounter = 0;

        this.waves = level.waves;

        this.curLevel = level;
    }
    this.loadLevel(baseLevel);

    this.update = function (dt) {
        var waves = this.waves;

        var eng = this.base.rootNode;

        var curWaveData = waves[this.curWave % waves.length];

        this.nwicounter -= dt;

        if (this.nwicounter < 0) {

            this.levelIteration = Math.floor(this.curWave / waves.length);
            var attributeModifier = curWaveData.attributeModifier;
            if(!attributeModifier)
                attributeModifier = Math.atan(this.levelIteration) + this.levelIteration * 0.3 + 0.1;

            var waveArray = [];

            for (var part in curWaveData) {
                if (!isNaN(part)) {
                    var bugAlleles = curWaveData[part];

                    var partWaveArray = generateBugArray(bugStart, bugAlleles, part, attributeModifier);

                    mergeToArray(partWaveArray, waveArray);
                }
            }

            this.bugsToSpawn.push(waveArray);

            this.startSpawnTriggers.push(curWaveData.startSpawnTrigger);
            this.finishSpawnTriggers.push(curWaveData.finishSpawnTrigger);

            if(curWaveData.deadTrigger) {
                var grimReaper = new AliveCounter(bind(curWaveData, "deadTrigger"));
                for(var key in waveArray)
                    grimReaper.addAliveTracker(waveArray[key]);

                //I am not entirely sure we even need to do this... but we will just to insure
                //garbage collection doesn't clean it up.
                this.base.addObject(grimReaper);
            }


            this.nwicounter = curWaveData.waveTime;

            this.curWave++;
        } //End of starting next level

        this.spawnCounter -= dt;
        if (this.spawnCounter < 0 && this.bugsToSpawn.length > 0) {
            this.spawnCounter = curWaveData.spawnDelay;

            var currentWave = this.bugsToSpawn[0];

            if(this.bugsToSpawn.length == this.startSpawnTriggers.length) {
                var curStartTrigger = this.startSpawnTriggers[0];
                if(curStartTrigger)
                    curStartTrigger();
                this.startSpawnTriggers.shift();
            }

            var curBug = currentWave[0];
            eng.base.addObject(curBug);
            currentWave.shift();

            if(currentWave.length == 0) {
                this.bugsToSpawn.shift();
                var curFinishTrigger = this.finishSpawnTriggers[0];
                if(curFinishTrigger)
                    curFinishTrigger();
                this.finishSpawnTriggers.shift();
            }
        }

    }     //End of update
} //End of levelManager
