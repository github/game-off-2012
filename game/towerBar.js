//Make list with lits of alleles to create default tower types.

function TowerDragger(towerGeneratorFnc) {
    this.tpos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this, 20);

    var displayedTower = towerGeneratorFnc(true);

    var placeOffset = new Vector(0, 0);
    var placingTower;

    var displayedTowerCanvas = new Canvas();
    var displayedTowerDirty = true;
    this.resize = function (rect) {
        this.tpos = rect.largestSquare();
        displayedTower.recalculateAppearance();
        displayedTower.tpos = this.tpos;
        displayedTowerCanvas.resize(this.tpos);
        displayedTowerDirty = true;
    };

    this.draw = function (pen) {
        var canvas = displayedTowerCanvas;
        if (displayedTowerDirty) {
            var pen2 = canvas.ctx();
            pen2.translate(-this.tpos.x, -this.tpos.y);
            displayedTower.draw(pen2);
            displayedTowerDirty = false;
        }
        canvas.drawTo(pen);
        if (placingTower) placingTower.draw(pen);
    }

    this.update = function (dt) {
       if (placingTower) placingTower.recalculateAppearance(true);
    }

    this.mousemove = function (e) {
        var tower = placingTower;
        if (!tower) return;

        var eng = getEng(this);

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
        placingTower = towerGeneratorFnc();

        if(!repeatPlace) {
            placeOffset.set(e);
            placeOffset.sub(this.tpos);

            placeOffset.x /= this.tpos.w;
            placeOffset.y /= this.tpos.h;
        }

        placingTower.tpos.x = e.x - placeOffset.x * this.tpos.w;
        placingTower.tpos.y = e.y - placeOffset.y * this.tpos.h;

        placingTower.recalculateAppearance(true);
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

        if (!placingTower) return;

        if (!tryPlaceTower(placingTower, placingTower.tpos, eng)) {
            console.warn("We couldn't place your tower...");
            return;
        }

        placingTower = false;
        delete game.input.globalMouseMove[this.base.id];
        delete game.input.globalMouseClick[this.base.id];

        if (game.input.ctrlKey) {
            this.mousedown(e, true);
            firstClick = false;
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
