//Make list with lits of alleles to create default tower types.

function TowerDragger(pos, towerGeneratorFnc) {
    this.tpos = pos;
    this.base = new BaseObj(this, 20);

    this.towerGeneratorFnc = towerGeneratorFnc;

    this.displayedTower = towerGeneratorFnc(true);

    var placeOffset = new Vector(0, 0);
    this.placingTower = false;

    this.draw = function (pen) {
        this.displayedTower.draw(pen);

        if (this.placingTower) {
            this.placingTower.recalculateAppearance(true);
            this.placingTower.draw(pen);
        }
    }

    this.resize = function (rect) {
        this.tpos = rect.largestSquare();
        this.displayedTower.tpos = this.tpos;
        this.displayedTower.recalculateAppearance();
        this.tpos = rect.largestSquare();
    }

    this.update = function (dt) {
        if (this.placingTower) {
            this.placingTower.base.update(dt);
        }
    }

    this.mousemove = function (e) {
        //var towerCollision = findClosestToPoint(eng, "Tower", tower.tpos.center(), towerRadius);

        var tower = this.placingTower;
        var eng = getEng(this);

        if (tower) {
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
    }

    var firstClick = false;
    this.mousedown = function (e, repeatPlace) {
        var eng = this.base.rootNode;
        var game = eng.game;

        firstClick = true;

        var curCost = game.currentCost;

        if (!this.placingTower && game.money - curCost >= 0) {
            //They are clicking on the placer, so begin placing
            this.placingTower = this.towerGeneratorFnc();

            var tower = this.placingTower;

            if(!repeatPlace) {
                placeOffset.set(e);
                placeOffset.sub(this.tpos);

                placeOffset.x /= this.tpos.w;
                placeOffset.y /= this.tpos.h;
            }

            tower.tpos.x = e.x - placeOffset.x * this.tpos.w;
            tower.tpos.y = e.y - placeOffset.y * this.tpos.h;

            this.placingTower.recalculateAppearance(true);
            this.mousemove(e);

            game.input.globalMouseMove[this.base.id] = this;
            game.input.globalMouseClick[this.base.id] = this;

            game.money -= curCost;
            game.currentCost *= 1.3;
        }
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
        attackCombinations.push({
            '1': towerAttackTypes[key],
        });
    }

    this.resize = function (rect) {
        costIndicator.resize(rect);
        vbox.resize(rect);
        this.tpos = rect;
    }

    this.added = function () {
        var game = getGame(this);
        var tileSize = game.tileSize;

        function tileFnc(obj, refObj, pos) {
            function towerDraggerFunction(forDisplay) {
                var fakeTile = {};
                fakeTile.tpos = new Rect(0, 0, tileSize, tileSize);
                var tower = new Tower(fakeTile, fakeTile.tpos);

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
            var towerDragger = new TowerDragger(pos.clone(), towerDraggerFunction);

            vbox.add(towerDragger);

            return true;
        }

        var boxBox = new Rect(this.tpos.x + 15, this.tpos.y + 40, 450, 150);
        makeTiled(this, tileFnc, attackCombinations, boxBox, 6, 2, 0.1);
    };

    this.update = function () {
        var game = getGame(this);

        costIndicator.text("Current tower cost: " + prefixNumber(game.currentCost));
    }
}
