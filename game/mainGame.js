//All the input should likely be combined and put in a few components,
//as it will likely be the same for most games.

function GitDefence(pos) {
    var engine = new Engine(pos, this);
    this.engine = engine;

    this.numTilesX = 16;
    this.numTilesY = 12;
    this.tileSize = 32;

    this.id = 0; //Shouldn't be needed (ids are in base)
    this.currentCost = 100;
    this.money = 1600; //Default to a much more reasonable value.
    if (DFlag.lotsamoney) {
        this.money = 10000;
    }
    this.health = 100;    

    this.lastTowerHover = null;


    this.infobar = new Infobar(
            new TemporalPos(pos.w - 250, 0, 250, pos.h)
        );

    engine.base.addObject(this.infobar);

    this.towerbar = new Towerbar(
            new TemporalPos(0, pos.h - 150, pos.w - 260, 150)
        );
    engine.base.addObject(this.towerbar);

//    this.towerbreeder = new TowerBreeder(
//            new TemporalPos(pos.w - 250, pos.h - 150, 200, 150)
//        );
    //    engine.base.addObject(this.towerbreeder);

    this.gameInfoBar = new GameInfoBar(
            new TemporalPos(0, pos.h - 240, pos.w - 260, 90)
        );
    engine.base.addObject(this.gameInfoBar);


    this.selectedObj = null;
    this.globalSelectionChanged = {};

    generatePath(this.engine, this);
    var bugStart = getAnElement(this.engine.base.children["Path_Start"]);

    //Level/Wave generator
    var lmpos = new TemporalPos(pos.w-400, 0, 100, pos.h*0.05);
    this.lvMan = new LevelManager(bugStart, lmpos);
    engine.base.addObject(this.lvMan);

    this.input = new InputHandler();
    var input = this.input;
    this.input.resizeEvent = pos; //We need to resize right away (shouldn't really have to... but we do)
    
    this.run = function (timestamp) {
        var eng = this.engine;

        eng.run(timestamp);

        this.input.handleEvents(eng);

        if(this.selectionChanged) {
            this.selectionChanged = false;
            for (var key in this.globalSelectionChanged) {
                if (this.globalSelectionChanged[key].base.rootNode != eng)
                    delete this.globalSelectionChanged[key];
                else
                    this.globalSelectionChanged[key].base.callRaise("selectionChanged", this.selectedObj);
            }
        }

        if (currentRangeDisplayed && this.selectedObj)
            currentRangeDisplayed.tPos = this.selectedObj.tPos.getCenter();

        if (this.selectedObj)
            this.selectedObj.hover = true;
    };

    this.draw = function (pen) {
        pen.fillStyle = "black";

        var width = pen.canvas.width;
        var height = pen.canvas.height;

        //Commenting out this line leads to funny results :D
        ink.rect(0, 0, width, height, pen);

        engine.base.draw(pen);
    }

    //Input events now in inputEvents.js


    //All selected stuff should probably be in its own object
    var currentRangeDisplayed = null;
    //this.base.addObject(hoverIndicator);

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
                obj.tPos.getCenter(),
                obj.attr.range,
                obj.color,
                "transparent", 11);

            this.engine.base.addObject(currentRangeDisplayed);

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
            obj.base.addObject(new HoverIndicator());
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
