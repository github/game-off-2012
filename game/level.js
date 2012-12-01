function LevelManager(bugStart) {

    var levels = [    
        { 
            5: [
                    function () { return { attack: bugAttackTypes.BugBullet }; },
                    AllAlleleGroups.targetBase,
                    AllAlleleGroups.rangeBase,
                    function () { return { speed: 20 }; },
               ],
            waveTime: 20,
            spawnDelay: 1
        },    
        { 
            7: [
                    function () { return { attack: bugAttackTypes.BugBullet }; },
                    AllAlleleGroups.targetBase,
                    AllAlleleGroups.rangeBase,
                    function () { return { speed: 30, damage: 5 }; },
               ],
            waveTime: 14,
            spawnDelay: 0.5
        },
        {
            14: [
                    function () { return { attack: bugAttackTypes.BugBullet }; },
                    AllAlleleGroups.targetBase,
                    AllAlleleGroups.damageBase,
                    AllAlleleGroups.hpBase,
                    function () { return { speed: 20, attSpeed: 1, damage: 10 }; },
               ],
            waveTime: 14,
            spawnDelay: 0.5
        },
        {
            14: [
                    function () { return { attack: bugAttackTypes.BugBullet }; },
                    AllAlleleGroups.targetBase,
                    AllAlleleGroups.damageBase,
                    AllAlleleGroups.hpBase,
                    AllAlleleGroups.hpRegenBase,
                    AllAlleleGroups.attSpeedBase,
                    function () { return { speed: 20, hpRegen: 100, hp: -99 }; },
               ],
            waveTime: 14,
            spawnDelay: 0.5
        },
        {
            15: [
                    function () { return { attack: bugAttackTypes.BugBullet }; },
                    AllAlleleGroups.targetBase,
                    AllAlleleGroups.damageBase,
                    AllAlleleGroups.hpBase,
                    AllAlleleGroups.hpRegenBase,
                    AllAlleleGroups.attSpeedBase,
                    AllAlleleGroups.attack2,
                    AllAlleleGroups.attack3,
                    function () { return { speed: 30, hp: 300 }; },
               ],
            waveTime: 20,
            spawnDelay: 0.5
        },
        {
            20: [
                    function () { return { attack: bugAttackTypes.BugBullet }; },
                    AllAlleleGroups.targetBase,
                    AllAlleleGroups.damageBase,
                    AllAlleleGroups.hpBase,
                    AllAlleleGroups.hpRegenBase,
                    AllAlleleGroups.attSpeedBase,
                    AllAlleleGroups.attack2,
                    AllAlleleGroups.specization1,
                    AllAlleleGroups.specization2,
                    function () { return { speed: 15 }; },
               ],
            waveTime: 20,
            spawnDelay: 0.2
        }

    ];
    

    this.base = new BaseObj(this, 10);

    
    this.nwicounter = 0;

    this.curLevel = -1;
    this.curLevelData = levels[0];

    this.bugsToSpawn = [];
    this.spawnCounter = 0;

    this.update = function (dt) {
        var eng = this.base.rootNode;

        this.nwicounter -= dt;

        if (this.nwicounter < 0) {
            this.curLevel++;
            this.curLevelData = levels[this.curLevel % levels.length];
            this.nwicounter = this.curLevelData.waveTime;

            this.levelIteration = Math.floor(this.curLevel / levels.length);
            var attributeModifier = Math.atan(this.levelIteration) + this.levelIteration * 0.3 + 0.1;

            this.bugsToSpawn = [];
            for (var part in this.curLevelData) {
                if (!isNaN(part)) {
                    var bugAlleles = this.curLevelData[part];
                    for (var i = 0; i < part; i++) {
                        var bug = new Bug(bugStart);
                        for (var group in bugAlleles)
                            bug.genes.addAllele(group, new Allele(bugAlleles[group]()));
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
                        this.bugsToSpawn.push(bug);
                    }
                }
            } //End of going through level data

            this.nwicounter = this.curLevelData.waveTime;

        } //End of starting next level

        this.spawnCounter -= dt;
        if (this.spawnCounter < 0 && this.bugsToSpawn.length > 0) {
            this.spawnCounter = this.curLevelData.spawnDelay;

            eng.base.addObject(this.bugsToSpawn[0]);
            this.bugsToSpawn.splice(0, 1);
        }

    }     //End of update
} //End of levelManager
