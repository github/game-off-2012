// Unfortunately, Tile has to be here becuase tower placement
// only works on top of a tile. Eventually we should get rid of
// it, but having it works fine for now.
function Tile(x, y, w, h) {
    this.tpos = new Rect(x, y, w, h);
    this.base = new BaseObj(this, 1);
    this.base.addChild(new Selectable());
}

function generatePath(eng, game) {

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
        }
    }
    eng.base.addChild(new Tile(0, 0, TILE_SIZE*game.numTilesX, TILE_SIZE*game.numTilesY));

    var uniqueBoard = [];
    for (var x = 0; x < NUM_TILES_X; x++) {
        uniqueBoard[x] = [];
        for (var y = 0; y < NUM_TILES_Y; y++)
            uniqueBoard[x][y] = false;
    }

    function isValid(pos) {
        return (pos.x < NUM_TILES_X && pos.y < NUM_TILES_Y && pos.x >= 0 && pos.y >= 0);
    }

    function isDeadEnd(starbox) {
        //Not a dead end if any of surrounding are not deadEnds
        if (!isValid(starbox))
            return true;
        if (uniqueBoard[starbox.x][starbox.y] == curUniqueBoardNum || board[starbox.x][starbox.y])
            return true;
        uniqueBoard[starbox.x][starbox.y] = curUniqueBoardNum;

        if (starbox.x == (NUM_TILES_X - 1) || starbox.y == (NUM_TILES_Y - 1)) {
            return false;
        }

        var deadEnd = true;
        for (var i = 0; i < 4; i++) {
            var surrounding = { x: starbox.x + vels[i].x, y: starbox.y + vels[i].y };
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

            eng.base.addChild(curPath);
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

            eng.base.addChild(curPath);

            //Look around and try to find a square to turn to that is still 1 away from everything else

            curMeander++;
            while (true) {
                var next = Math.floor(Math.random() * 4);

                if (curMeander >= meanderFactor) {
                    next = Math.floor(Math.random() * 2);
                    curMeander -= 0.2;
                }

                var nextVel = vels[next];

                var nexbox = { x: curPos.x + nextVel.x, y: curPos.y + nextVel.y };

                curUniqueBoardNum++;
                if (isValid(nexbox) && !board[nexbox.x][nexbox.y] && !isDeadEnd(nexbox)) {
                    curPos = nexbox;
                    break;
                }
            }

            if (curMeander >= meanderFactor)
                curMeander = 0;
        }
    }
}
