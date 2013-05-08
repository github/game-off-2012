//Make list with lits of alleles to create default tower types.

function TowerDragger(towerGeneratorFnc) {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this, 20);

    var displayedTower = towerGeneratorFnc(true);
    this.base.addChild(displayedTower);

    var placeOffset = new Vector(0, 0);
    var placingTower;

    this.resize = function (rect) {
        this.tpos = rect.largestSquare();
        displayedTower.tpos = this.tpos;
        displayedTower.recalculateAppearance();
        this.tpos = rect.largestSquare();
    }

    this.mousemove = function (e) {
        var tower = placingTower;
        var eng = getEng(this);

        if (!tower) return;

        var pos = new Vector(0, 0);

        pos.x = e.x - placeOffset.x * tower.tpos.w;
        pos.y = e.y - placeOffset.y * tower.tpos.h;

        if (canPlace(tower, pos, eng)) {
            tower.tpos.x = pos.x;
            tower.tpos.y = pos.y;
        } else {
            tower.tryToMove(pos, eng);
        }
    }

    var firstClick = false;
    this.mousedown = function (e, repeatPlace) {
        var eng = this.base.rootNode;
        var game = eng.game;

        firstClick = true;

        var curCost = game.currentCost;

        if (placingTower || game.money - curCost < 0) return;

        //They are clicking on the placer, so begin placing
        var tower = towerGeneratorFnc();
        this.base.addChild(tower);

        if(!repeatPlace) {
            placeOffset.set(e);
            placeOffset.sub(this.tpos);

            placeOffset.x /= this.tpos.w;
            placeOffset.y /= this.tpos.h;
        }

        tower.tpos.x = e.x - placeOffset.x * this.tpos.w;
        tower.tpos.y = e.y - placeOffset.y * this.tpos.h;

        tower.recalculateAppearance(true);
        this.mousemove(e);

        game.input.globalMouseMove[this.base.id] = this;
        game.input.globalMouseClick[this.base.id] = this;

        game.money -= curCost;
        game.currentCost *= 1.3;
    }

    this.click = function (e) {
        if (firstClick) {
            firstClick = false;
            return;
        }

        var eng = this.base.rootNode;
        var game = eng.game;

        if (this.placingTower) {
            //They already clicked on the placer, so they are trying to place now
            if(tryPlaceTower(this.placingTower, this.placingTower.tpos, eng)) {
                this.placingTower = false;
                delete game.input.globalMouseMove[this.base.id];
                delete game.input.globalMouseClick[this.base.id];

                if(game.input.ctrlKey) {
                    this.mousedown(e, true);
                    firstClick = false;
                }
            }
            else {
                //Nothing, we could not place tower but they paid for it so
                //they have to place it somewhere!
            }
        }
    }
}

function Towerbar() {
    this.base = new BaseObj(this, 14);
    this.tpos = new Rect(0, 0, 0, 0);

    var vbox = new VBox();
    this.base.addChild(vbox);

    var costIndicator = new Label("Tower cost: 50");
    vbox.add(costIndicator);

    var attackCombinations = [];
    var uniqueNum = 1;

    for (var key in towerAttackTypes) {
        //Obj needed for now, it goes away when added (because we turn it into an   array)
        attackCombinations.push([
            towerAttackTypes[key],
        ]);
    }

    this.resize = function (rect) {
        costIndicator.resize(rect);
        vbox.resize(rect);
        this.tpos = rect;
    }

    this.added = function () {
        function makeTowerDragger(obj) {
            function makeTower(forDisplay) {
                var tower = new Tower();

                if (forDisplay) {
                    tower.attr.attackTypes = [];
                    for (var alleleGroup in tower.genes.alleles) {
                        if (tower.genes.alleles[alleleGroup].delta.attack) {
                            delete tower.genes.alleles[alleleGroup];
                        }
                    }
                }

                for (var key in obj) {
                    var attackType = obj[key];
                    tower.genes.addAllele(new Allele("attack" + key, { attack: attackType }));
                }

                return tower;
            }
            var towerDragger = new TowerDragger(makeTower);

            return towerDragger;
        }

        for (var key in attackCombinations) {
            vbox.add(makeTowerDragger(attackCombinations[key]));
        }
    };

    this.update = function () {
        var game = getGame(this);

        costIndicator.text("Current tower cost: " + prefixNumber(game.currentCost));
    }
}
