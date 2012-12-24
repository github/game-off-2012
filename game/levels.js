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

var baseBugAlleles = [
    function () { return { attack: bugAttackTypes.BugBullet }; },

    BugAlleles.rangeBase,
    BugAlleles.damageBase,
    BugAlleles.hpBase,
    BugAlleles.attSpeedBase,
    BugAlleles.movementSpeedBase,

    function () { return { speed: 20 }; },
];

var baseLevel = {
    waves: [
        {
            //The array should really be a object with the names the allele names
            5: baseBugAlleles,
            waveTime: 20,
            spawnDelay: 1,
            attributeModifier: 1
        },
        {
            //The array should really be a object with the names the allele names
            10: baseBugAlleles,
            waveTime: 30,
            spawnDelay: 0.5,
            attributeModifier: 1
        },
        {
            //The array should really be a object with the names the allele names
            20: baseBugAlleles,
            waveTime: 30,
            spawnDelay: 0.5,
            attributeModifier: 1
        },
        {
            //The array should really be a object with the names the allele names
            40: baseBugAlleles,
            waveTime: 30,
            spawnDelay: 0.25,
            attributeModifier: 1
        },
    ],
};