
//Make list with lits of alleles to create default tower types.

function TowerDragger(pos, towerGeneratorFnc) {
    this.tPos = pos;
    this.base = new baseObj(this, 20);

    this.towerGeneratorFnc = towerGeneratorFnc;

    this.displayedTower = towerGeneratorFnc(true);

    this.dragPos = null;

    this.draw = function (pen) {
        this.displayedTower.tPos = this.tPos;
        this.displayedTower.base.raiseEvent("resize");
        this.displayedTower.draw(pen);

        if (this.dragPos) {
            this.displayedTower.tPos = new temporalPos(this.dragPos.x, this.dragPos.y, tileSize, tileSize);
            this.displayedTower.base.raiseEvent("resize");
            this.displayedTower.draw(pen);
        }
    }

    this.mousemove = function (e) {
        this.dragPos = e;
    }

    this.mousedown = function (e) {
        if (this.dragPos) {
            if (!this.base.rootNode.ctrlKey) {
                this.dragPos = null;
                delete this.base.rootNode.globalMouseMove[this.base.id];
                delete this.base.rootNode.globalMouseDown[this.base.id];
            }
            var tileDrop = findClosest(this.base.rootNode, "Tile", e, 0);
            if (tileDrop) {
                tryPlaceTower(this.towerGeneratorFnc(), tileDrop);
            }
        }
        else {
            this.dragPos = e;
            this.base.rootNode.globalMouseMove[this.base.id] = this;
            this.base.rootNode.globalMouseDown[this.base.id] = this;
        }
    }
}

function Towerbar(pos) {
	this.base = new baseObj(this, 14);

	this.tPos = pos;

	this.costIndicator = new Label(new temporalPos(pos.x, pos.y, pos.w, pos.h), "Tower cost: 50");
	this.costIndicator.font = "20px arial";
	this.costIndicator.color = "white";
	this.base.addObject(this.costIndicator);

	var attackCombinations = [];
	var uniqueNum = 1;

	for (var key in allAttackTypes) {
	    var attackTypes = {}; //Obj needed for now, it goes away when added (because we turn it into an array)
	    attackTypes[1] = (allAttackTypes[key]);
	    attackCombinations.push(attackTypes);
	}

	//var superCombo = { 1: allAttackTypes.Pulse, 2: allAttackTypes.Slow };
	//attackCombinations.push(superCombo);

	var buttonW = 100;
    //Scaled exactly to 150 by 674...
	makeTiled(this,
        function (obj, refObj, pos) {
            var towerDragger = new TowerDragger(
                new temporalPos(pos.x, pos.y, pos.w, pos.h),
                function (forDisplay) {
                    var fakeTile = {};
                    fakeTile.tPos = new temporalPos(0, 0, 0, 0);
                    var tower = new Tower(fakeTile);

                    if (forDisplay) {
                        tower.attr.attack_types = [];
                        for (var alleleGroup in tower.genes.alleles) {
                            if (tower.genes.alleles[alleleGroup].delta.attack)
                                delete tower.genes.alleles[alleleGroup];
                        }
                    }

                    for (var key in obj) {
                        var attackType = obj[key];
                        tower.genes.addAllele("attack" + key, new Allele({ attack: attackType }));
                    }

                    tower.recolor();

                    return tower;
                }
            );

            refObj.base.addObject(towerDragger);

            return true;
        },
        attackCombinations,
        new temporalPos(
            pos.x + 15,
            pos.y + 40,
            450,
            150),
        6, 2,
        0.1);


        this.update = function () {
            this.costIndicator.tPos.x = pos.x + 10;
            this.costIndicator.tPos.y = pos.y + 25;

            this.costIndicator.text = "Current tower cost: " + this.base.rootNode.currentCost;
        }

	this.draw = function (pen) {
	    pen.fillStyle = "#000";
	    ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);

	    pen.fillStyle = "transparent";

	    pen.strokeStyle = "orange";
	    pen.lineWidth = 1;

	    ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
	}
}
