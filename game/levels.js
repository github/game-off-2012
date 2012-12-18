/*
level: {
    waves: [
        {
            (can have multiple sets of bugs, just give them different numbers
            number of bugs : {
                alleleGroup: function () { return { attribute: attributeDelta } }
            },
            (optional) waveTime: seconds until next wave is started
            (optional) spawnDelay: seconds between each enemy is spawned
            (optional) attributeModifier: number to multiply each attribute in the bugs by
            (optional) startSpawnTrigger: boundCallback to call when wave starts spawning
            (optional) finishSpawnTrigger: boundCallback when wave finishes spawning
            (optional) deadTrigger: boundCallback when all bugs spawned in this wave die
        }
    ],
}
*/

var tutorialLevelOne = {
    waves: [
        {
            //Number is number of bugs, you can have multiple numbers
            5: {
                //Alleles for the bug
                attack1: function () { return { attack: bugAttackTypes.BugBullet }; },
                targetBase: AllAlleleGroups.targetBase,
                rangeBase: AllAlleleGroups.rangeBase,
                speedBase: function () { return { speed: 5 }; },
                hpBase: function () { return { hp: 10 }; },
                attSpeedBase: function () { return { attSpeed: -100 }; }, //We don't want it to attack
            },
            //Time until next wave
            waveTime: 1/0,
            //Time between spawn
            spawnDelay: 0.3,
            //Number the resultant attributes are multiplied by
            attributeModifier: 1,
        }
    ],
};

var tutorialLevelTwo = {
    waves: [
        {
            //Number is number of bugs, you can have multiple numbers
            15: {
                //Alleles for the bug
                attack1: function () { return { attack: bugAttackTypes.BugBullet }; },
                targetBase: AllAlleleGroups.targetBase,
                rangeBase: AllAlleleGroups.rangeBase,
                speedBase: function () { return { speed: 5 }; },
                hpBase: function () { return { hp: 10 }; },
                attSpeedBase: function () { return { attSpeed: -100 }; }, //We don't want it to attack
            },
            //Time until next wave
            waveTime: 1/0,
            //Time between spawn
            spawnDelay: 0.3,
            //Number the resultant attributes are multiplied by
            attributeModifier: 1,
        }
    ],
};

var baseLevel = {
    waves: [
        {
            //The array should really be a object with the names the allele names
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
    ],
};