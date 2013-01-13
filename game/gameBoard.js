function GameBoard(game) {
    this.tpos = new Rect(0, 0, game.numTilesX * game.tileSize, game.numTilesY * game.tileSize);
    this.base = new BaseObj(this, -32);
    var box = this.tpos.clone();
    
    generatePath(this, game);
    
    function moveChildren(node, start, end) {
        node.loopThroughAllTypes(function (child) {
            if (child.tpos) {
                child.tpos.norm(start).project(end);
            }
            moveChildren(child.base, start, end);
        });
    }
    
    this.resize = function (rect) {
        var startRect = box;
        var endRect = rect.largestSquare();
        
        moveChildren(this.base, startRect, endRect);
        
        box = endRect;
        this.tpos = rect;
        this.base.dirty();
        return this;
    }
    
    this.redraw = function (canvas) {
        var p = new Path();
        p.rect(box.clone().origin(box.origin().sub(this.tpos.origin())));
        canvas.fill(p, rgba(0, 0, 255, 0.1));
    }
}