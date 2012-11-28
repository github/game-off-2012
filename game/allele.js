/*
TowerStats = {
        range:          100,
        damage:         1,
        hp:             10,
        attSpeed:       1,        
        mutate:         0,
        mutatestrength: 0,
        upload:         0,
        download:       0,
        hitcount:       0,
        value:          50,
    };
    */

var AllAlleleGroups =
{
//Should likely have better names
    one: function () { return { range: 10}; },
    two: function () { return {range: Math.random() * 20}; },
    three: function () { return {range: 100, damage: -1}; },
//Make some for all of the attack types and target strategies.
};

function Allele(delta)
{
    this.delta = delta;
    this.apply = function (target, unapply) {
        for (var key in this.delta) {
            var curChange = this.delta[key];
            if (defined(target.attr[key])) {                
                target.attr[key] += curChange * (unapply ? -1 : 1);
            }
            //Then its a attack_type or target strategy
            else if (key == "attack") {
                //attack type
                target.attr.attack_types.push(new curChange());
            }
            else if(key == "target"){
                //target strategy
                target.attr.target_Strategy = new curChange();
            }
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

    this.added = function()
    {
        this.base.rootNode.globalMouseMove[this.base.id] = this;
        this.base.rootNode.globalMouseDown[this.base.id] = this;
    }

    this.breed = function () {
        var maxLength = 0;
        
        var resultantAlleles = {};
        for(var alleleGroup in AllAlleleGroups)
        {
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
        if(placingTower)
        {
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