var changeNextGlobalChance = null;
//Choices is an object with key as CDF (so the last should be 1)
function choose(choices)
{
    var randomValue = Math.random();

    if(changeNextGlobalChance)
    {
        randomValue = changeNextGlobalChance;
        changeNextGlobalChance = null;
    }

    var realChoices = [];
    for(var chance in choices)
    {
        var obj = {};
        obj.chance = chance;
        obj.choice = choices[chance];
        realChoices.push(obj);
    }

    realChoices.sort(function (a, b) { return a.chance - b.chance; });

    var curValue = 0;
    for(var key in realChoices)
        if(randomValue < realChoices[key].chance)
            return realChoices[key].choice;
}
var AllAlleleGroups =
{
    //Should likely have better names
    //EACH ONE OF THESE SHOULD HAVE MORE THAN ONE PHENOTYPE!
    //(Ex, one could be +10 range, of +5 range (moderate bonus)
    //two could be +1000 range of +50 damage (major bonus)
    //three could be... etc
    //Make some for all of the attack types and target strategies.
    //Some major bonuses

//BASELINE BONUS
    rangeBase: function () { return choose(
        {
            0.5: { range: 30 }, //Roughly even distribution of base stats
            0.7: { range: 50 },
            0.9: { range: 70 },
            1: { range: 150 },  //With a minor chance of huge benefit (this is really good, as
                                //no matter what the target tower stats the best phenotype
                                //for this allele will improve it or make it the same).
        }); },

    damageBase: function () { return choose(
        {
            0.5: { damage: 3 }, //Roughly even distribution of base stats
            0.7: { damage: 5 },
            0.9: { damage: 7 },
            1: { damage: 15 },  //With a minor chance of huge benefit (this is really good, as
                                //no matter what the target tower stats the best phenotype
                                //for this allele will improve it or make it the same).
        }); },

    hpBase: function () { return choose(
        {
            0.5: { hp: 30 },
            0.7: { hp: 50 },
            0.9: { hp: 70 },
            1: { hp: 150 },
        }); },

    hpRegenBase: function () { return choose(
        {
            0.5: { hpRegen: 3 },
            0.7: { hpRegen: 5 },
            0.9: { hpRegen: 7 },
            1: { hpRegen: 15 },
        }); },

    attSpeedBase: function () { return choose(
        {
            0.5: { attSpeed: 0 },
            0.7: { attSpeed: 0.2 },
            0.9: { attSpeed: 0.3 },
            1: { attSpeed: 0.5 },
        }); },

    attack1: function () { return choose(
        {
            0.166: { attack: allAttackTypes.Laser },
            0.333: { attack: allAttackTypes.Bullet },
            0.500: { attack: allAttackTypes.Chain },
            0.666: { attack: allAttackTypes.Pulse },
            0.833: { attack: allAttackTypes.DOT },
            1.0: { attack: allAttackTypes.Slow },
        }); },

    targetBase: function () { return choose(
        {
            0.333: { target: targetStrategies.Closest },
            0.666: { target: targetStrategies.Random },
            1.000: { target: targetStrategies.Farthest },
        }); },
//BONUS BASELINE

//BONUS ATTACKS
//Bonus attack or damage bonus
    attack2: function () { return choose(
        {
            0.760: { damage: 10 },
            0.800: { attack: allAttackTypes.Laser },
            0.840: { attack: allAttackTypes.Bullet },
            0.880: { attack: allAttackTypes.Chain },
            0.920: { attack: allAttackTypes.Pulse },
            0.960: { attack: allAttackTypes.DOT },
            1.000: { attack: allAttackTypes.Slow },
        }); },
//Bonus attack or attack speed bonus
    attack3: function () { return choose(
        {
            0.800: { attSpeed: 2 },
            0.840: { attack: allAttackTypes.Bullet },
            0.880: { attack: allAttackTypes.Chain },
            0.920: { attack: allAttackTypes.Pulse },
            0.960: { attack: allAttackTypes.DOT },
            1.000: { attack: allAttackTypes.Slow },
        }); },
//BONUS ATTACKS

//ATTRIBUTE SPECIALIZATIONS (these give the tower unique
//tradeoffs which should make it a distinct tower type (like high damage low attack speed)
    specization1: function () { return choose(
        {
            //Hard to kill
            0.25: { hpRegen: 50, hp: 200, damage: -13, attSpeed: -1 },
            //Gene spreader
            0.50: { upload: 50, download: -4, range: -80 },
            //Pew pew pew
            0.75: { attSpeed: 2, damage: -13},
            //Boom
            1.00: { attSpeed: -1, damage: 13},
        }); },
    specization2: function () { return choose(
        {
            //Nothing
            0.80: { range: 1 },
            //Germ
            0.85: { hpRegen: 50, hp: -100},
            //Why!?
            0.90: { attSpeed: -1, damage: -13, range: 200 },
            //Fatty
            0.95: { hpRegen: -50, hp: 1000},
            //Super-charge (not sure if this will work?)
            1.00: { currentHp: 1000},
        }); },
//ATTRIBUTE SPECIALIZATIONS

//SCARCE MEDIUM BONUS
    rangeMediumBonus: function () { return choose(
        {
            0.5: { },
            0.7: { range: 50 },
            0.9: { range: 70 },
            1: { range: 150 },
        }); },

    damageMediumBonus: function () { return choose(
        {
            0.5: { },
            0.7: { damage: 5 },
            0.9: { damage: 7 },
            1: { damage: 15 },
        }); },

    hpMediumBonus: function () { return choose(
        {
            0.5: { },
            0.7: { hp: 50 },
            0.9: { hp: 70 },
            1: { hp: 150 },
        }); },

    hpRegenMediumBonus: function () { return choose(
        {
            0.5: { },
            0.7: { hpRegen: 5 },
            0.9: { hpRegen: 7 },
            1: { hpRegen: 15 },
        }); },

    attSpeedMediumBonus: function () { return choose(
        {
            0.5: { },
            0.7: { attSpeed: 0.2 },
            0.9: { attSpeed: 0.3 },
            1: { attSpeed: 0.5 },
        }); },
//SCARCE MEDIUM BONUS

//RARE SUPER BONUS
    rangeSuperBonus: function () { return choose(
        {
            0.5: { },
            0.7: { range: 50 },
            0.9: { range: 70 },
            1: { range: 150 },
        }); },

    damageSuperBonus: function () { return choose(
        {
            0.9: { },
            1: { damage: 30 },
        }); },

    hpSuperBonus: function () { return choose(
        {
            0.9: { },
            1: { hp: 250 },
        }); },

    hpRegenSuperBonus: function () { return choose(
        {
            0.9: { },
            1: { hpRegen: 25 },
        }); },

    attSpeedSuperBonus: function () { return choose(
        {
            0.9: { },
            1: { attSpeed: 3.5 },
        }); },
//RARE SUPER BONUS

};

function Allele(delta)
{
    this.delta = delta;
    this.apply = function (target) {
        for (var key in delta) {
            var curChange = delta[key];
            if(!assertDefined(curChange))
                continue;

            if (defined(target.attr[key])) {
                target.attr[key] += curChange;
            } else if (key == "attack") {
                //attack type
                target.attr.attack_types.push(new curChange());
                // Shouldn't we be removing the attack_type here if unapply == true?
            } else if (key == "target") {
                //target strategy
                target.attr.target_Strategy = new curChange();
                // What should we do if we're removing the gene for the target_Strategy?
            }
        }
    }
    this.unapply = function (target) {
        for (var key in delta) {
            var curChange = delta[key];
            if (defined(target.attr[key])) {                
                target.attr[key] -= curChange;
            }
            //Can't unapply attacks and targets
        }
    }
    this.getInnerColor = function()
    {
        if(this.delta.attack)        
            return "pink";
        else if(this.delta.target)
            return "yellow";

        return "white";
    }
    this.getOuterColor = function()
    {
        if(this.delta.attack)
        {
            var name = this.delta.attack.name;
            if(name == "bullet")
                return globalColorPalette.bullet;
            else if(name == "laser")
                return globalColorPalette.laser;
            else if(name == "chain_lightning")
                return globalColorPalette.chain_lightning;
            else if(name == "pulse")
                return globalColorPalette.pulse;
            else if(name == "poison")
                return globalColorPalette.poison;
            else if(name == "slow")
                return globalColorPalette.slow;
                
            return "yellow";
        }
        return getInnerColorFromAttrs(this.delta);
    }
}

function TowerBreeder(pos) {    
    this.base = new BaseObj(this, 15);

    this.towers = [];

    this.tPos = pos;

    //this.base.addObject(new Button(new TemporalPos(pos.x + 140, pos.y + 10, 50, 30), "Breed",
      //      this, "breed", null));

    var placingTower = null;

    this.added = function () {
        var eng = this.base.rootNode;

        eng.globalMouseMove[this.base.id] = this;
        eng.globalMouseDown[this.base.id] = this;
    }

    this.breed = function () {
        var maxLength = 0;
        
        var resultantAlleles = {};
        for (var alleleGroup in AllAlleleGroups) {
            var alleleParent = pickRandom(this.towers);
            if(alleleParent.genes.alleles[alleleGroup])
                resultantAlleles[alleleGroup] = alleleParent.genes.alleles[alleleGroup];
        }

        var notTile = [];
        notTile.tPos = { x: 0, y: 0, w: TILE_SIZE, h: TILE_SIZE };
        var newTower = new Tower(notTile);
        for (var key in resultantAlleles)
            newTower.genes.addAllele(key, resultantAlleles[key]);
        placingTower = newTower;
        placingTower.recolor();
    }

    this.mousemove = function (e) {
        if(placingTower) {
            placingTower.tPos.x = e.x;
            placingTower.tPos.y = e.y;
        }
    }

    this.mousedown = function (e) {
        var eng = this.base.rootNode;

        if (placingTower) {
            var towerSelected = findClosest(eng, "Tower", e, 0);
            var tileSelected = findClosest(eng, "Tile", e, 0);
            var pathSelected = findClosest(eng, "Path", e, 0);

            if (!towerSelected && !pathSelected && tileSelected) {
                placingTower.tPos = tileSelected.tPos;
                eng.base.addObject(placingTower);
                placingTower = null;
            }
        }
    }

    this.draw = function (pen) {
        var pos = this.tPos;
        makeTiled(pen,
            function (obj, refObj, pos) {
                var prevPos = obj.tPos;
                obj.tPos = pos;
                obj.draw(refObj);
                obj.tPos = prevPos;
                return true;
            },
            this.towers,
            new TemporalPos(
                pos.x,
                pos.y,
                pos.w - 50,
                pos.h),
            2, 2,
            0.1);

        pen.fillStyle = "transparent";

        pen.strokeStyle = "orange";
        pen.lineWidth = 1;

        ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);

        if (placingTower) {
            placingTower.draw(pen);
        }
    }
}