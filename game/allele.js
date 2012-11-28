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


function Allele(delta)
{
    this.delta = delta;
    this.apply = function (target) {
        for (var key in this.delta) {
            var curChange = this.delta[key];
            if (defined(target.attr[key])) {
                target.attr[key] += curChange;
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
        for (var key in this.towers) {
            maxLength = Math.max(maxLength, this.towers[key].alleles.length);
        }

        var resultantAlleles = [];
        for (var i = 0; i < maxLength; i++) {
            var alleleChoices = [];
            for (var key in this.towers) {
                var curAllele = this.towers[key].alleles[i];
                if (curAllele)
                    alleleChoices.push(curAllele);
            }
            var choosen = alleleChoices[Math.floor(Math.random() * alleleChoices.length)];
            resultantAlleles.push(choosen);
        }

        var notTile = [];
        notTile.tPos = { x: 0, y: 0, w: tileSize, h: tileSize };
        var newTower = new Tower(notTile);
        for (var key in resultantAlleles)
            newTower.addAllele(resultantAlleles[key]);
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