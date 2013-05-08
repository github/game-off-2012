function GameBoard(game) {
    this.tpos = new Rect(0, 0, game.numTilesX * game.tileSize, game.numTilesY * game.tileSize);
    this.base = new BaseObj(this, -32);
    var contentBox = this.tpos.largestSquare();
    
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
        var startRect = contentBox;
        var endRect = contentBox.clone().center(rect.center());
        
        moveChildren(this.base, startRect, endRect);
        
        contentBox = endRect;
        this.tpos = rect;
        this.base.dirty();
        return this;
    }
    
    this.redraw = function (canvas) {
        var p = new Path();
        p.rect(contentBox.clone().moveOrigin(this.tpos.origin().neg()));
        canvas.fill(p, rgba(0, 0, 255, 0.1));
        canvas.stroke(p, rgba(0, 0, 255, 0.5), 2);
    }
}