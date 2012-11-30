//Choices is an object with key as CDF (so the last should be 1)
function choose(choices)
{
    var randomValue = Math.random();

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
            0.7: { attSpeed: 0.3 },
            0.9: { attSpeed: 0.5 },
            1: { attSpeed: 2 },
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

    attack2: function () { return choose(
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

    //Some minor bonuses

    //Some super bonuses with tradeoffs
    //Some that always add target strategy
    //Some that always add attack type
    //Some that sometimes add attack type

    //One per attribute
};

function Allele(delta)
{
    this.delta = delta;
    this.apply = function (target) {
        for (var key in delta) {
            var curChange = delta[key];
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
}

function TowerBreeder(pos) {
    this.base = new baseObj(this, 15);

    this.towers = [];

    this.tPos = pos;

    this.base.addObject(new Button(new temporalPos(pos.x + 140, pos.y + 10, 50, 30), "Breed",
            this, "breed", null));

    var placingTower = null;

    this.added = function () {
        this.base.rootNode.globalMouseMove[this.base.id] = this;
        this.base.rootNode.globalMouseDown[this.base.id] = this;
    }

    this.breed = function () {
        var maxLength = 0;
        
        var resultantAlleles = {};
        for (var alleleGroup in AllAlleleGroups) {
            var alleleParent = this.towers[Math.floor(Math.random() * this.towers.length)];
            if(alleleParent.genes.alleles[alleleGroup])
                resultantAlleles[alleleGroup] = alleleParent.genes.alleles[alleleGroup];
        }

        var notTile = [];
        notTile.tPos = { x: 0, y: 0, w: tileSize, h: tileSize };
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
        if (placingTower) {
            var towerSelected = findClosest(this.base.rootNode, "Tower", e, 0);
            var tileSelected = findClosest(this.base.rootNode, "Tile", e, 0);
            var pathSelected = findClosest(this.base.rootNode, "Path", e, 0);

            if (!towerSelected && !pathSelected && tileSelected) {
                placingTower.tPos = tileSelected.tPos;
                this.base.rootNode.base.addObject(placingTower);
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
            new temporalPos(
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