function generatePath(eng, game) {
    // Unfortunately, Tile has to be here becuase tower placement
    // only works on top of a tile. Eventually we should get rid of
    // it, but having it works fine for now.
    function Tile(x, y, w, h) {
        this.tPos = new Rect(x, y, w, h);
        this.base = new BaseObj(this, 1);
        this.base.addObject(new Selectable());
    }
    
    var curPos = { x: 0, y: 0 };

    var NUM_TILES_X = game.numTilesX;
    var NUM_TILES_Y = game.numTilesY;

    var TILE_SIZE = game.tileSize;

    var meanderFactor = 40;
    var curMeander = 0;
    var vels = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1}];

    //Just temp
    var curUniqueBoardNum = 2;
    var board = [];
    for (var x = 0; x < NUM_TILES_X; x++) {
        board[x] = [];
        for (var y = 0; y < NUM_TILES_Y; y++) {
            board[x][y] = false;
            eng.base.addObject(new Tile(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE));
        }
    }

    var uniqueBoard = [];
    for (var x = 0; x < NUM_TILES_X; x++) {
        uniqueBoard[x] = [];
        for (var y = 0; y < NUM_TILES_Y; y++)
            uniqueBoard[x][y] = false;
    }

    function isValid(pos) {
        return (pos.x < NUM_TILES_X && pos.y < NUM_TILES_Y && pos.x >= 0 && pos.y >= 0);
    }

    function isDeadEnd(startPos) {
        //Not a dead end if any of surrounding are not deadEnds
        if (!isValid(startPos))
            return true;
        if (uniqueBoard[startPos.x][startPos.y] == curUniqueBoardNum || board[startPos.x][startPos.y])
            return true;
        uniqueBoard[startPos.x][startPos.y] = curUniqueBoardNum;

        if (startPos.x == (NUM_TILES_X - 1) || startPos.y == (NUM_TILES_Y - 1)) {
            return false;
        }

        var deadEnd = true;
        for (var i = 0; i < 4; i++) {
            var surrounding = { x: startPos.x + vels[i].x, y: startPos.y + vels[i].y };
            deadEnd &= isDeadEnd(surrounding); //1 not dead end is fine
        }

        return deadEnd;
    }
    var prevPos = { x: 0, y: 0 };
    var prevPath = null;
    var pathPos = 1;
    while (true) {
        if (curPos.x == (NUM_TILES_X - 1) || curPos.y == (NUM_TILES_Y - 1)) {
            curPath = new Path_End(curPos.x * TILE_SIZE, curPos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            prevPath.nextPath = curPath;

            eng.base.addObject(curPath);
            break;
        }
        else {
            board[curPos.x][curPos.y] = true;

            var curPath;

            if (!prevPath) {
                curPath = new Path_Start(curPos.x * TILE_SIZE, curPos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
            else {
                curPath = new Path_Piece(curPos.x * TILE_SIZE, curPos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                prevPath.nextPath = curPath;
            }

            prevPath = curPath;
            curPath.pathPos = pathPos++;

            eng.base.addObject(curPath);

            //Look around and try to find a square to turn to that is still 1 away from everything else

            curMeander++;
            while (true) {
                var next = Math.floor(Math.random() * 4);

                if (curMeander >= meanderFactor) {
                    next = Math.floor(Math.random() * 2);
                    curMeander -= 0.2;
                }

                var nextVel = vels[next];

                var nextPos = { x: curPos.x + nextVel.x, y: curPos.y + nextVel.y };

                curUniqueBoardNum++;
                if (isValid(nextPos) && !board[nextPos.x][nextPos.y] && !isDeadEnd(nextPos)) {
                    curPos = nextPos;
                    break;
                }
            }

            if (curMeander >= meanderFactor)
                curMeander = 0;
        }
    }
}