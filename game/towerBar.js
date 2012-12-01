
//Make list with lits of alleles to create default tower types.

function TowerDragger(pos, towerGeneratorFnc) {
    this.tPos = pos;
    this.base = new BaseObj(this, 20);

    this.towerGeneratorFnc = towerGeneratorFnc;

    this.displayedTower = towerGeneratorFnc(true);

    this.dragPos = null;

    this.draw = function (pen) {
        this.displayedTower.tPos = this.tPos;
        this.displayedTower.base.raiseEvent("resize");
        this.displayedTower.draw(pen);

        if (this.dragPos) {
            this.displayedTower.tPos = new TemporalPos(this.dragPos.x, this.dragPos.y, TILE_SIZE, TILE_SIZE);
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
    this.base = new BaseObj(this, 14);

    this.tPos = pos;

    var costIndicator = new Label(new TemporalPos(pos.x, pos.y, pos.w, pos.h), "Tower cost: 50");
    costIndicator.font = "20px arial";
    costIndicator.color = "white";
    this.base.addObject(costIndicator);

    var attackCombinations = [];
    var uniqueNum = 1;

    for (var key in towerAttackTypes) {
        var attackTypes = {}; //Obj needed for now, it goes away when added (because we turn it into an array)
        attackTypes[1] = (towerAttackTypes[key]);
        attackCombinations.push(attackTypes);
    }

    var buttonW = TILE_SIZE;
    //Scaled exactly to 150 by 674...
    
    function tileFnc(obj, refObj, pos) {
        function towerDraggerFunction(forDisplay) {
            var fakeTile = {};
            fakeTile.tPos = new TemporalPos(0, 0, 0, 0);
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

            return tower;
        }
        var towerDragger = new TowerDragger(pos.clone(), towerDraggerFunction);

        refObj.base.addObject(towerDragger);

        return true;
    }
    
    var tPosBox = new TemporalPos(pos.x + 15, pos.y + 40, 450, 150);
    makeTiled(this, tileFnc, attackCombinations, tPosBox, 6, 2, 0.1);


    this.update = function () {
        costIndicator.tPos.x = pos.x + 10;
        costIndicator.tPos.y = pos.y + 25;

        costIndicator.text = "Current tower cost: " + this.base.rootNode.currentCost;
    }
}
