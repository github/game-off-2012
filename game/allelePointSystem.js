function AllelePointSystem(pos) {
    this.base = new BaseObj(this, 15);
    this.tpos = pos;

    var vbox;
    this.added = function () {
        var that = this;
        function pointButton(num, cost) {
            var text;
            text = "Buy " + num + ": $" + cost;
            var b = new Button(text, bind(that, "buyPoint", {count: num, cost: cost}));
            return b;
        }
        vbox = new VBox();
        this.base.addChild(vbox);

        this.pointIndicator = new Label("");
        vbox.add(this.pointIndicator, 28);

        var buyHBox = new HBox();
        vbox.add(buyHBox);
        buyHBox.add(this.buyButton = pointButton(1, 50));
        buyHBox.add(this.buyButton1 = pointButton(10, 350));
        buyHBox.add(this.buyButton2 = pointButton(100, 2500));

        var spendHBox = new HBox();
        vbox.add(spendHBox);
        spendHBox.add(this.spendButton = new Button("Spend Point", bind(this, "spendPoint")));
        spendHBox.add(this.trashButton = new Button("Trash Point", bind(this, "trashPoint")));
        vbox.add(this.autoTrashButton = new ToggleButton("Auto Trash Worse"), 28);
    };

    this.resize = function (rect) {
        vbox.resize(rect);
    }

    this.pointCost = 50;

    this.buyPoint = function (costData) {
        var eng = this.base.rootNode;
        var game = eng.game;
        var selected = getSel(this);

        var cost = costData.cost || 50;
        var count = costData.count || 1;

        if (selected && selected.base.type == "Tower") {
            if (game.money > cost) {
                game.money -= cost;
                for (var i = 0; i < count; i++)
                    selected.generateAllele();
            }
        }
    }

    this.spendPoint = function () {
        var selected = getSel(this);

        if (selected && selected.base.type == "Tower") {
            if (selected.allelesGenerated.length > 0) {
                var allele = selected.allelesGenerated[0];
                selected.allelesGenerated.splice(0, 1);
                selected.genes.addAllele(allele);
            }
        }
    }

    this.trashPoint = function () {
        var selected = getSel(this);

        if (selected && selected.base.type == "Tower") {
            if (selected.allelesGenerated.length > 0)
                selected.allelesGenerated.splice(0, 1);
        }
    }

    this.doAutoTrash = function () {
        var selected = getSel(this);

        if (selected && selected.base.type == "Tower") {
            var anyPositive = false;

            while (!anyPositive && selected.allelesGenerated.length > 0) {
                this.addDeltaDisplay();

                var extraInfo = this.base.parent.extraInfo;

                anyPositive = false;
                for (var key in extraInfo) {
                    if (extraInfo[key] > 0 || extraInfo[key].added == "+")
                        anyPositive = true;
                    for (var dKey in extraInfo[key].delta)
                        if (extraInfo[key].delta[dKey] > 0)
                            anyPositive = true;
                }
                if (!anyPositive) {
                    selected.allelesGenerated.splice(0, 1);
                }
            }
        }
    }

    this.mousemove = function () { this.addDeltaDisplay(); };
    this.mouseout = function () { this.removeDeltaDisplay(); };

    this.addDeltaDisplay = function () {
        var selected = getSel(this);

        this.base.parent.extraInfo = {};
        var extraInfo = this.base.parent.extraInfo;

        if (selected && selected.base.type == "Tower") {
            if (selected.allelesGenerated.length > 0) {
                var allele = selected.allelesGenerated[0];

                function addToExtraInfo(allele, factor) {
                    for (var key in allele.delta) {
                        var change = allele.delta[key];

                        if (typeof change == "number") {
                            if (!extraInfo[key])
                                extraInfo[key] = 0;

                            extraInfo[key] += change * factor;

                            //if (!extraInfo[key])
                            //delete extraInfo[key];
                        } else {
                            if (extraInfo[formatToDisplay(change.name)]) {
                                extraInfo[formatToDisplay(change.name)].added = "+-";
                            } else {
                                extraInfo[formatToDisplay(change.name)] = change;
                                extraInfo[formatToDisplay(change.name)].added = factor == 1 ? "+" : "-";
                            }
                        }
                    }
                }

                if (selected.genes.alleles[allele.group])
                    addToExtraInfo(selected.genes.alleles[allele.group], -1);

                addToExtraInfo(allele, 1);
            }
        }
    }

    this.removeDeltaDisplay = function () {
        this.base.parent.extraInfo = {};
    }

    this.update = function () {
        if (this.autoTrashButton.toggled()) {
            this.doAutoTrash();
        }

        var selected = getSel(this);
        if (selected && selected.base.type == "Tower") {
            this.base.setAttributeRecursive("hidden", false);
            this.pointIndicator.text("Allele Points: " + selected.allelesGenerated.length);
            this.addDeltaDisplay();
        } else {
            this.base.setAttributeRecursive("hidden", true);
        }
    }
}
