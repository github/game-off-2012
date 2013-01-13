function GitDefence(pos) {
    var engine = new Engine(pos, this);
    this.engine = engine;

    this.numTilesX = 16;
    this.numTilesY = 16;
    this.tileSize = 32;

    this.id = 0; //Shouldn't be needed (ids are in base)
    this.currentCost = 100;
    this.money = 1600; //Default to a much more reasonable value.
    if (DFlag.lotsamoney) {
        this.money = 10000;
    }
    this.health = 100;    

    this.lastTowerHover = null;

    var hbox = new HBox();
    engine.base.addChild(hbox);
    
    this.towerbar = new Towerbar();
    hbox.add(this.towerbar, 64);
    
    var vbox = new VBox();
    hbox.add(vbox);
    this.gameInfoBar = new GameInfoBar();
    vbox.add(this.gameInfoBar, 32);
    this.gameBoard = new GameBoard(this);
    vbox.add(this.gameBoard);
    
    this.infobar = new Infobar();
    hbox.add(this.infobar, 150);
    
    
    engine.globalResize = function (ev) {
        console.log("gitDefence globalResize", ev);
        hbox.resize(new Rect(0, 0, ev.width, ev.height));
    }

    this.selectedObj = null;
    this.globalSelectionChanged = {};

    var bugStart = getAnElement(this.engine.base.allChildren["Path_Start"]);

    this.lvMan = new LevelManager(bugStart);
    engine.base.addChild(this.lvMan);

    this.input = new InputHandler();
    var input = this.input;
    this.input.resizeEvent = pos; //We need to resize right away (shouldn't really have to... but we do)
    
    
    this.run = function (timestamp) {
        var eng = this.engine;
        eng.run(timestamp);

        this.input.handleEvents(eng);

        if (this.selectionChanged) {
            this.selectionChanged = false;
            for (var key in this.globalSelectionChanged) {
                if (this.globalSelectionChanged[key].base.rootNode != eng) {
                    delete this.globalSelectionChanged[key];
                } else {
                    this.globalSelectionChanged[key].base.callRaise("selectionChanged", this.selectedObj);
                }
            }
        }

        if (currentRangeDisplayed && this.selectedObj) {
            currentRangeDisplayed.tpos = this.selectedObj.tpos.center();
        }

        if (this.selectedObj) {
            this.selectedObj.hover = true;
        }
    };

    this.draw = function (pen) {
        engine.base.draw(pen);
    }

    //Input events now in inputEvents.js


    //All selected stuff should probably be in its own object
    var currentRangeDisplayed = null;
    //this.base.addChild(hoverIndicator);

    this.selectedBucket = [];

    this.selectionChanged = false;
    this.changeSel = function (obj) {
        if (obj == this.selectedObj)
            return;

        this.selectionChanged = true;

        if (currentRangeDisplayed) {
            currentRangeDisplayed.base.destroySelf();
            currentRangeDisplayed = null;
        }

        if (obj && obj.attr) {
            //Hooks up our tower range to our actual attributes (but not our center)
            //so we don't need to maintain it.
            currentRangeDisplayed = new SCircle(
                obj.tpos.center(),
                obj.attr.range,
                obj.color,
                "transparent", 11);

            this.engine.base.addChild(currentRangeDisplayed);

            if (this.selectedObj)
                this.selectedObj.hover = false;

            this.selectedObj = obj;
            this.infobar.updateAttr(obj);

            if (!this.input.ctrlKey) {
                for (var key in this.selectedBucket) {
                    var selected = this.selectedBucket[key];
                    for (var key in selected.base.children.HoverIndicator) {
                        var selIndi = selected.base.children.HoverIndicator[key];
                        selIndi.base.destroySelf();
                    }
                }
                this.selectedBucket = [];
            }
            this.selectedBucket.push(obj);
            obj.base.addChild(new HoverIndicator());
            //this.towerbreeder.towers = this.selectedBucket;
        } else {
            for (var key in this.selectedBucket) {
                var selected = this.selectedBucket[key];
                for (var key in selected.base.children.HoverIndicator) {
                    var selIndi = selected.base.children.HoverIndicator[key];
                    selIndi.base.destroySelf();
                }
            }
            this.selectedBucket = [];

            if (this.selectedObj)
                this.selectedObj.hover = false;

            this.selectedObj = null;
            this.infobar.clearDisplay();
        }

        return;
    }

    this.upgradeSel = function () {
        if(this.selectedObj)
            this.selectedObj.tryUpgrade();
        return;
    }
    
    this.getSelType = function () {
        if (!this.selectedObj) {
            return null;
        }
        return this.selectedObj.base.type;
    }
}
