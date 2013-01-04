function GameBoard(game) {
    this.box = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this, 1);
    
    generatePath(this, game);
    
    this.resize = function (rect) {
        
    }
}