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
    hbox.add(this.infobar, 200);
    
    engine.globalResize = function (ev) {
        console.log("gitDefence globalResize", ev);
        hbox.resize(new Rect(0, 0, ev.width, ev.height));
    }


    this.globalSelectionChanged = {};

    var bugStart = getAnElement(this.engine.base.allChildren["Path_Start"]);

    this.lvMan = new LevelManager(bugStart);
    engine.base.addChild(this.lvMan);

    this.input = new InputHandler();
    var input = this.input;
    // We need to resize right away (shouldn't really have to... but we do)
    this.input.resizeEvent = pos;
    
    var selection = null;
    var selectionChanged = false;
    this.run = function (timestamp) {
        var eng = this.engine;
        eng.run(timestamp);

        this.input.handleEvents(eng);

        if (selectionChanged) {
            for (var key in this.globalSelectionChanged) {
                if (this.globalSelectionChanged[key].base.rootNode != eng) {
                    delete this.globalSelectionChanged[key];
                } else {
                    this.globalSelectionChanged[key].base.callRaise("selectionChanged", selection);
                }
            }
            selectionChanged = false;
        }
    };

    this.draw = function (pen) {
        engine.base.draw(pen);
        
        var obj = selection;
        if (obj) {
            pen.strokeStyle = obj.color;
            pen.fillStyle = "transparent";
            pen.lineWidth = 2;
            var p = obj.tpos.center();
            ink.circ(p.x, p.y, obj.attr.range, pen);
        }
    }
    
    this.changeSel = function (obj) {
        return this.selection(obj);
    }
    
    this.selection = function (newSelection) {
        if (newSelection === undefined) {
            return selection;
        }
        
        if (selection && selection.deselected) {
            selection.deselected();
        }
        
        selectionChanged = true;
        
        if (newSelection && newSelection.attr) {
            selection = newSelection;
            this.infobar.updateAttr(newSelection);
        } else {
            selection = null;
            this.infobar.clearDisplay();
        }
    }
}
