function AllelePointSystem(pos) {
    this.base = new BaseObj(this, 15);
    console.log("Allelenpointsysom pos:", pos);
    this.tPos = pos;

    var vbox;
    this.added = function() {
        var that = this;
        function pointButton(pos, num, cost) {
            var text;
            if (num == 1) {
                text = "Buy point ($" + cost + ")";
            } else {
                text = "Buy " + num + " points ($" + cost + ")";
            }
            var b = new Button(pos.clone(), text, bind(that, "buyPoint", {count: num, cost: cost}));
            return b;
        }
        vbox = new VBox();
        this.base.addObject(vbox);
        
        this.pointIndicator = new Label(pos.clone(), "");
        this.pointIndicator.color = "blue";
        vbox.add(this.pointIndicator);
        vbox.add(pointButton(pos, 1, 50));
        vbox.add(pointButton(pos, 10, 350));
        vbox.add(pointButton(pos, 100, 2500));
        vbox.add(new Button(pos.clone(), "Spend Point", bind(this, "spendPoint")));
        vbox.add(new Button(pos.clone(), "Trash Point", bind(this, "trashPoint")));
        this.autoTrashButton = new ToggleButton(pos.clone(), "Auto Trash Worse", bind(this, "autoTrashToggle"));
        vbox.add(this.autoTrashButton);
    };

    this.pointCost = 50;

    this.selectionChanged = function (newSelected) {
        if(newSelected)
            this.autoTrashButton.toggled = newSelected.autoTrash;
    }

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
                var allObj = selected.allelesGenerated[0];
                selected.allelesGenerated.splice(0, 1);
                selected.genes.addAllele(allObj.group, allObj.all);
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

    this.autoTrashToggle = function () {
        var selected = getSel(this);

        if (selected && selected.base.type == "Tower") {
            selected.autoTrash = this.autoTrashButton.toggled;
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

    this.mouseover = function () { this.addDeltaDisplay(); };
    this.mouseout = function () { this.removeDeltaDisplay(); };

    this.addDeltaDisplay = function () {
        var selected = getSel(this);

        this.base.parent.extraInfo = {};
        var extraInfo = this.base.parent.extraInfo;

        if (selected && selected.base.type == "Tower") {
            if (selected.allelesGenerated.length > 0) {
                var allObj = selected.allelesGenerated[0];

                function addToExtraInfo(allele, factor) {
                    for (var key in allele.delta) {
                        var change = allele.delta[key];

                        if (typeof change == "number") {
                            if (!extraInfo[key])
                                extraInfo[key] = 0;

                            extraInfo[key] += change * factor;

                            //if (!extraInfo[key])
                            //delete extraInfo[key];
                        }
                        else {
                            if (extraInfo[formatToDisplay(change.name)]) {
                                extraInfo[formatToDisplay(change.name)].added = "+-";
                            }
                            else {
                                extraInfo[formatToDisplay(change.name)] = change;
                                extraInfo[formatToDisplay(change.name)].added = factor == 1 ? "+" : "-";
                            }
                        }
                    }
                }

                if (selected.genes.alleles[allObj.group])
                    addToExtraInfo(selected.genes.alleles[allObj.group], -1);

                addToExtraInfo(allObj.all, 1);
            }
        }
    }

    this.removeDeltaDisplay = function () {
        this.base.parent.extraInfo = {};        
    }

    var added = false;
    this.update = function () {
        if(!added && getGame(this))
        {
            getGame(this).globalSelectionChanged[this.base.id] = this;
            added = true;
        }

        var eng = this.base.rootNode;
        var game = eng.game;

        var selected = getSel(this);

        vbox.resize(this.tPos);

        if (this.autoTrashButton.toggled) {
            this.doAutoTrash();
        }

        if (selected && selected.base.type == "Tower") {
            this.base.setAttributeRecursive("hidden", false);
            this.pointIndicator.text = "Allele Points: " + selected.allelesGenerated.length;
        }
        else {
            this.base.setAttributeRecursive("hidden", true);
        }
    }
}