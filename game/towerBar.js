
function TowerDragger(pos, towerGeneratorFnc) {
    this.tPos = pos;
    this.base = new baseObj(this, 20);

    this.towerGeneratorFnc = towerGeneratorFnc;

    this.displayedTower = towerGeneratorFnc();

    this.dragPos = null;

    this.draw = function (pen) {
        this.displayedTower.tPos = this.tPos;
        this.displayedTower.base.raiseEvent("resize");
        this.displayedTower.draw(pen);

        if (this.dragPos) {
            this.displayedTower.tPos = new temporalPos(this.dragPos.x, this.dragPos.y, tileSize, tileSize);
            this.displayedTower.base.raiseEvent("resize");
            this.displayedTower.draw(pen);
        }
    }

    this.dragged = function (e) {
        this.dragPos = e;
    }

    this.dragEnd = function (e) {
        this.dragPos = null;
        var tileDrop = findClosest(this.base.rootNode, "Tile", e, 0);
        tileDrop.click(e);
    }
}

function Towerbar(pos) {
	this.base = new baseObj(this, 14);
	this.tattr = null;

	this.tPos = pos;

	var buttonW = 100;

    var towerDraggedTest = new TowerDragger(
            new temporalPos(pos.x + 20, pos.y + 20, 20, 20),
            function() {
                var fakeTile = {};
                fakeTile.tPos = new temporalPos(0, 0, 0, 0);
                return new Tower(fakeTile);
            }
        );

    this.base.addObject(towerDraggedTest);

	this.draw = function (pen) {
	    pen.fillStyle = "#000";
	    ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);

	    pen.fillStyle = "transparent";

	    pen.strokeStyle = "orange";
	    pen.lineWidth = 1;

	    ink.rect(this.tPos.x, this.tPos.y, this.tPos.w, this.tPos.h, pen);
	}
}
