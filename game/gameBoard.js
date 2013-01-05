function GameBoard(game) {
    this.box = new Rect(0, 0, game.numTilesX * game.tileSize, game.numTilesY * game.tileSize);
    this.base = new BaseObj(this, 1);
    
    generatePath(this, game);
    
    this.resize = function (rect) {
//         moveBy rect.center() - this.box.center();
//         scaleBy smallest of (rect.w / this.box.w, rect.h / this.box.h)
        moveChildren(rect.center().sub(this.box.center()), Math.min(rect.w / this.box.w, rect.h / this.box.h));
    }
//         rect.origin() - box.orgin();
}