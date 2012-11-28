
function TowerDragger(pos, towerGeneratorFnc) {
    this.tPos = pos;
    this.base = new baseObj(this, 20);

    this.towerGeneratorFnc = towerGeneratorFnc;

    this.displayedTower = towerGeneratorFnc();

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

    this.dragged = function (e) {
        this.dragPos = e;
    }

    this.dragEnd = function (e) {
        this.dragPos = null;
        var tileDrop = findClosest(this.base.rootNode, "Tile", e, 0);
        if (tileDrop)
            tryPlaceTower(this.towerGeneratorFnc(), tileDrop);
    }
}

function Towerbar(pos) {
	this.base = new baseObj(this, 14);

	this.tPos = pos;

	var attackCombinations = [];
	var uniqueNum = 1;

	for (var key in allAttackTypes) {
	    var attackTypes = {}; //Obj needed for now, it goes away when added (because we turn it into an array)
	    attackTypes[uniqueNum++] = (allAttackTypes[key]);
	    attackCombinations.push(attackTypes);
	}

	var superCombo = { 0: allAttackTypes.Bullet, 1: allAttackTypes.Normal };

	attackCombinations.push(superCombo);

	var buttonW = 100;
    //Scaled exactly to 150 by 674...
	makeTiled(this,
        function (obj, refObj, pos) {
            var towerDragger = new TowerDragger(
                new temporalPos(pos.x, pos.y, pos.w, pos.h),
                function () {
                    var fakeTile = {};
                    fakeTile.tPos = new temporalPos(0, 0, 0, 0);
                    var tower = new Tower(fakeTile);

                    tower.attr.attack_types = [];
                    for (var attackType in obj)                    
                        tower.attr.attack_types.push(new obj[attackType]());

                    tower.recolor();

                    return tower;
                }
            );

            refObj.base.addObject(towerDragger);

            return true;
        },
        attackCombinations,
        new temporalPos(
            pos.x + 65,
            pos.y,
            600,
            150),
        8, 2,
        0.1);
  

	this.draw = function (pen) {
	    pen.fillStyle = "#000";
	    ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);

	    pen.fillStyle = "transparent";

	    pen.strokeStyle = "orange";
	    pen.lineWidth = 1;

	    ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
	}
}
