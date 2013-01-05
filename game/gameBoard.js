function GameBoard(game) {
    this.box = new Rect(0, 0, game.numTilesX * game.tileSize, game.numTilesY * game.tileSize);
    this.base = new BaseObj(this, 1);
    var box = this.box.clone();
    
    generatePath(this, game);
    
    function moveChildren(node, start, end) {
        node.loopThroughAllTypes(function (child) {
            child.box.norm(start).project(end);
            moveChildren(child.base, start, end);
        });
    }
    
    this.resize = function (rect) {
        var startRect = box;
        
        var wide = rect.w / box.w > rect.h / box.h;
        var size = wide ? rect.h : rect.w;
        
        var endRect = new Rect(0, 0, size, size).center(rect.center());
        
        moveChildren(this.base, startRect, endRect);
        
        box = endRect;
        this.box = rect;
        return this;
    }
}