function AllelePointSystem(pos) {
    this.base = new baseObj(this, 15);
    this.tPos = pos;

    this.pointIndicator = new Label(cloneObject(pos), "");
    this.pointIndicator.color = "blue";
    this.base.addObject(this.pointIndicator);

    this.buyButton = new Button(cloneObject(pos), "Buy Point", this, "buyPoint");
    this.buyButton.tPos.h = 30;
    this.buyButton.tPos.w *= 0.8;
    this.base.addObject(this.buyButton);

    this.spendButton = new Button(cloneObject(pos), "Spend Point", this, "spendPoint");
    this.spendButton.tPos.h = 30;
    this.spendButton.tPos.w *= 0.8;    
    
    this.base.addObject(this.spendButton);

    this.trashButton = new Button(cloneObject(pos), "Trash Point", this, "trashPoint");
    this.trashButton.tPos.h = 30;
    this.trashButton.tPos.w *= 0.8;
    this.base.addObject(this.trashButton);

    this.buyPoint = function () {
        var selected = this.base.rootNode.selectedObj;

        if (selected && selected.base.type == "Tower") {
            selected.generateAllele();
        }
    }

    this.spendPoint = function () {
        var selected = this.base.rootNode.selectedObj;

        if (selected && selected.base.type == "Tower") {
            if (selected.allelesGenerated.length > 0) {
                var allObj = selected.allelesGenerated[0];
                selected.allelesGenerated.splice(0, 1);
                selected.genes.addAllele(allObj.group, allObj.all);
            }
        }
    }

    this.trashPoint = function () {
        var selected = this.base.rootNode.selectedObj;

        if (selected && selected.base.type == "Tower") {
            if (selected.allelesGenerated.length > 0)
                selected.allelesGenerated.splice(0, 1);
        }
    }

    this.mouseover = function () { this.addDeltaDisplay(); };
    this.mouseout = function () { this.removeDeltaDisplay(); };

    this.addDeltaDisplay = function () {
        this.base.parent.extraInfo = {};
        var extraInfo = this.base.parent.extraInfo;

        var selected = this.base.rootNode.selectedObj;

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

    this.update = function () {
        var xPos = this.tPos.x;
        var yPos = this.tPos.y;

        this.pointIndicator.tPos.x = xPos + 10;
        this.pointIndicator.tPos.y = yPos + 20;
        yPos += 30;

        this.buyButton.tPos.x = xPos + 10;
        this.buyButton.tPos.y = yPos;
        yPos += 30;

        this.spendButton.tPos.x = xPos + 10;
        this.spendButton.tPos.y = yPos;
        yPos += 30;

        this.trashButton.tPos.x = xPos + 10;
        this.trashButton.tPos.y = yPos;
        yPos += 30;        

        var selected = this.base.rootNode.selectedObj;

        if (selected && selected.base.type == "Tower") {
            this.base.setAttributeRecursive("hidden", false);
            this.pointIndicator.text = "Allele Points: " + selected.allelesGenerated.length;
        }
        else {
            this.base.setAttributeRecursive("hidden", true);
        }
    }

    this.draw = function (pen) {
        //pen.fillStyle = "#000";
        //ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);

        pen.fillStyle = "transparent";

        pen.strokeStyle = "orange";
        pen.lineWidth = 1;

        ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
    }
}