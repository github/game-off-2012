function GameBoard(game) {
    this.tPos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this, 1);
    
    generatePath(this, game);
    
    this.resize = function (rect) {
        
    }
}