function Infobar(pos) {
    this.base = new BaseObj(this, 14);
    this.tattr = null;

    this.tPos = pos;

    var buttonW = 100;

    //For each displayed item gives extra info to be displayed in brackets)
    this.extraInfo = {};

    this.attributeChoosers = {};    

    /*
    this.attributeChoosers.target_Strategy = new AttributeChooser(
            new TemporalPos(pos.x, pos.y + 250, pos.w, 
                countElements(targetStrategies) * 28),
            targetStrategies,
            "target_Strategy");
    this.base.addObject(this.attributeChoosers.target_Strategy);
    */
    
    /*
    this.attributeChoosers.attack_type = new AttributeChooser(
            new TemporalPos(pos.x, pos.y + 250, pos.w,
                countElements(attackTypes) * 28),
            attackTypes,
            "attack_type");            
    //We will soon no longer let them choose their attack strategy!
    this.base.addObject(this.attributeChoosers.attack_type);
    */

    /*
    this.attributeChoosers.bug_attack_type = new AttributeChooser(
            new TemporalPos(pos.x, pos.y + 250, pos.w,
                countElements(bugAttackTypes) * 28),
            bugAttackTypes,
            "bug_attack_type");
    //We will soon no longer let them choose their attack strategy!
    this.base.addObject(this.attributeChoosers.bug_attack_type);
    */

    this.allelePoints = new AllelePointSystem(new TemporalPos(pos.x, pos.y, pos.w * 0.92, 190));
    this.base.addObject(this.allelePoints);

    //Add our buttons, should really be done just in the constructor with our given pos information
    this.added = function () {
        //Std centered button position

        this.clearDisplay();
        this.resize = Dock(this, "right", "top");
    };

    this.obj = null;
    this.updateAttr = function (obj) {
        this.base.setAttributeRecursive("hidden", false);
        this.obj = obj;
        for (var key in this.attributeChoosers)
            this.attributeChoosers[key].loadAttribute();
        return;
    }

    this.clearDisplay = function () {
        this.base.setAttributeRecursive("hidden", true);
    }

    this.draw = function (pen) {
        pen.fillStyle = "#0f0";
        pen.font = "15px courier";

        var xs = this.tPos.x + 10;
        var xe = this.tPos.x + this.tPos.w - 10;
        var y = this.tPos.y + 15;

        if (!this.obj || !this.obj.attr) {
            ink.text(xs, y, "[no selection]", pen);
            return;
        }

        ink.text(xs, y, formatToDisplay(getRealType(this.obj)), pen);
        var yPos = y + 20;
        var xPos = xs;

        var ourWidth = xe - xs;

        var baseStats = getRealType(this.obj) == "Tower" ? TowerStats : TowerStats;

        var obj = this.obj;

        pen.font = "10px courier";

        var extraInfo = this.extraInfo;
        var extraInfoDisplayed = {};

        var attChoosers = this.attributeChoosers;

        function displayAttributes(attrs) {
            for (var attrName in attrs) {
                var value = attrs[attrName];

                var arrayAttr = value;
                if (getRealType(arrayAttr) != "Array") {
                    arrayAttr = [];
                    arrayAttr.push(value);
                }

                pen.color = "Green";
                pen.fillStyle = "Transparent";
                //ink.rect(xs, y, (xe - xs), 15, pen);

                for (var key in arrayAttr) {
                    var val = arrayAttr[key];
                    function tryPrintAsNumber(val, name, extraInfo) {
                        if (typeof val != "number")
                            return false;

                        var valtxt = prefixNumber(val, 1);
                        if (defined(extraInfo[name])) {
                            valtxt = "(" + roundToDecimal(extraInfo[name], 3) + ") " + valtxt;
                            extraInfoDisplayed[name] = true;
                        }

                        var nametxt = formatToDisplay(name);

                        var baseStat = baseStats[name];

                        if (defined(baseStat)) {
                            pen.color = "White";
                            pen.fillStyle = "Purple";
                            var startX = xPos - 3;
                            var startY = yPos - 10;
                            var totalWidth = ourWidth + 6;
                            var totalHeight = 15;
                            var totalStat = Math.max(baseStat, 0);
                            var factor = 1 * totalWidth * 0.5 / 10;
                            startX += totalWidth * 0.5;

                            function addBarPart(val) {
                                var direction = val < 0 ? -1 : +1;
                                var curWidth = (Math.log(Math.abs(val) / baseStat + 2)) *
                                factor * direction;
                                if (val > 0) {
                                    pen.fillStyle = "Green";
                                    ink.rect(startX, startY, curWidth, totalHeight * 0.5, pen);
                                }
                                else {
                                    pen.fillStyle = "Red";
                                    ink.rect(startX, startY + totalHeight * 0.5, curWidth,
                                    totalHeight * 0.5, pen);
                                }
                                return curWidth;
                            }

                            //addBarPart(val - baseStat);
                            for (var key in obj.genes.alleles) {
                                var allele = obj.genes.alleles[key];
                                for (var key in allele.delta) {
                                    if (key == name) {
                                        var impact = allele.delta[key];
                                        if (impact > 0)
                                            startX += addBarPart(impact) * (impact < 0 ? -1 : 1);
                                    }
                                }
                            }
                            startX -= 2;
                            for (var key in obj.genes.alleles) {
                                var allele = obj.genes.alleles[key];
                                for (var key in allele.delta) {
                                    if (key == name) {
                                        var impact = allele.delta[key];
                                        if (impact < 0)
                                            startX += addBarPart(impact) * (impact < 0 ? -1 : 1);
                                    }
                                }
                            }
                        }

                        pen.color = "Green";
                        pen.fillStyle = "White";
                        pen.textAlign = 'left';
                        ink.text(xPos, yPos, nametxt, pen);
                        pen.textAlign = 'right';
                        ink.text(xe, yPos, valtxt, pen);
                        yPos += 15;
                        return true;
                    }

                    if (!tryPrintAsNumber(val, attrName, extraInfo)) {
                        yPos += 5;

                        var nameText;

                        if (!defined(attChoosers[attrName])) {
                            nameText = formatToDisplay(getRealType(val));
                        }
                        else {
                            nameText = formatToDisplay(attrName);
                        }

                        var subExtraInfo = {};
                        if (defined(extraInfo[nameText]) && !extraInfoDisplayed[nameText]) {
                            subExtraInfo = extraInfo[nameText];
                            extraInfoDisplayed[nameText] = true;
                            nameText = "(" + extraInfo[nameText].added + ") " + nameText;
                        }

                        pen.color = "Green";
                        pen.fillStyle = "Green";
                        pen.textAlign = 'center';
                        pen.font = "14px courier";
                        ink.text((xs + xe) / 2, yPos, nameText, pen);
                        pen.font = "10px courier";
                        yPos += 20;
                        xPos += 5;

                        for (var subAttr in val) {
                            tryPrintAsNumber(val[subAttr], subAttr, subExtraInfo);
                        }

                        //See if its an attribute which we have a attribute chooser for
                        if (defined(attChoosers[attrName])) {
                            attChoosers[attrName].tPos.y = yPos;
                            attChoosers[attrName].resize();
                            yPos += attChoosers[attrName].tPos.h;
                            yPos += 20; //idk really why this is needed
                        }

                        xPos -= 5;

                        //Even so we still need to position the attribute choosers
                    }
                } //End of looping through arrays within attributes

            } //End of attribute loop
        } //End of display attribute function

        displayAttributes(this.obj.attr);

        //var extraInfo = this.extraInfo;
        //var extraInfoDisplayed = {};

        var undisplayedExtra = {};

        for (var key in extraInfo) {
            if (!extraInfoDisplayed[key])
                undisplayedExtra[key] = new extraInfo[key]();
        }

        displayAttributes(undisplayedExtra);

        //this.upgradeb.tPos.y = yPos;
        //yPos += 30;


        this.allelePoints.tPos.x = xPos;
        this.allelePoints.tPos.y = this.tPos.y + this.tPos.h - this.allelePoints.tPos.h - 10;
    }                                                                      //End of draw
}
