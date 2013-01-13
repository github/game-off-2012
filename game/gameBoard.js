function GameBoard(game) {
    this.box = new Rect(0, 0, game.numTilesX * game.tileSize, game.numTilesY * game.tileSize);
    this.base = new BaseObj(this, -32);
    var contentBox = this.box.largestSquare();
    
    generatePath(this, game);
    
    function moveChildren(node, start, end) {
        node.loopThroughAllTypes(function (child) {
            if (child.box) {
                child.box.norm(start).project(end);
            }
            moveChildren(child.base, start, end);
        });
    }
    
    this.resize = function (rect) {
        var startRect = contentBox;
        var endRect = rect.largestSquare();
        
        moveChildren(this.base, startRect, endRect);
        
        contentBox = endRect;
        this.box = rect;
        this.base.dirty();
        return this;
    }
    
    this.redraw = function (canvas) {
        var p = new Path();
        p.rect(contentBox.clone().moveOrigin(this.box.origin().neg()));
        canvas.fill(p, rgba(0, 0, 255, 0.1));
        canvas.stroke(p, rgba(0, 0, 255, 0.5), 2);
    }
}