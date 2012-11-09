function Engine(pen) {
    this.mX = -1;
    this.mY = -1;
    this.pen = pen;
    this.map = [];
    //this.bugs = [];

    this.lasers = [];


    this.id = 0;
    this.money = 100;
    this.health = 100;

    //{bug:[bugOne, bugTwo, etc], tower:[towerOne, towerTwo]}
    //Sorted by types for quadtree (and as we often want to find
    //all objects of a type. ONLY add more types when it is common
    //to query based on those types (else just add to default).
    this.allObjects = {};

    this.allObjects.Tile = [];
    this.allObjects.Bug = [];

    this.engine = this;

    for (var r = 0; r < hTiles; r++) {        
        this.map[r] = [];
        for (var c = 0; c < wTiles; c++) {
            this.map[r][c] = new Tile(c * tileSize, r * tileSize, tileSize, tileSize);
            this.map[r][c].engine = this;
            this.allObjects.Tile.push(this.map[r][c]);
        }
    }
    for (var r = hTiles / 2 - 1; r <= hTiles / 2; r++) {
        for (var c = 0; c < wTiles - 1; c++) {
            this.map[r][c].addObject(Path);
        }
    }
    this.map[hTiles / 2 - 1][wTiles - 1].addObject(Base);
    this.map[hTiles / 2][wTiles - 1].addObject(Base);
    this.bugTemp = {x: -32, y: 7 * tileSize, r: 5};
    this.run = function() {
        this.update();
        this.draw();
        window.reqAnim(this.run.bind(this));
    };
    
/** Function */
    this.update = function () {
        this.curQuadTree = new QuadTree(this.allObjects, 0, 1000, 0, 1000);

        var bugs = this.allObjects.Bug;

        for (r = 0; r < hTiles; r++) {
            for (c = 0; c < wTiles; c++) {
                var tile = this.map[r][c];
                tile.hover = false;
                tile.update();                
                if (tile.object instanceof Tower && tile.object.nextFire < new Date().getTime()) {
                    var searchBug = findClosest(this, "Bug", tile, tile.object.range * tile.object.range + 0.01);
                    if (searchBug) {
                        tile.object.nextFire = new Date().getTime() + tile.object.coolDown;
                        searchBug.hp -= tile.object.damage;

                        var cent1 = tile.sprite.getCenter();
                        var cent2 = { x: searchBug.sprite.x, y: searchBug.sprite.y };

                        this.lasers.push(new Laser(cent1.x, cent1.y, cent2.x, cent2.y,
                            new Date().getTime(), tile.object.laserTime, this.id++));
                    }

                    /*
                    var cent1 = tile.sprite.getCenter();
                    var cent2 = { x: bugs[i].sprite.x, y: bugs[i].sprite.y };
                    var dist = Math.sqrt(Math.pow(cent2.x - cent1.x, 2)
                    + Math.pow(cent2.y - cent1.y, 2)) - bugs[i].sprite.w;
                    if (dist < tile.object.range) {
                    tile.object.nextFire = new Date().getTime() + tile.object.coolDown;
                    bugs[i].hp -= tile.object.damage;
                    this.lasers.push(new Laser(cent1.x, cent1.y, cent2.x, cent2.y,
                    new Date().getTime(), tile.object.laserTime, this.id++));
                    break;
                    }
                    */
                    // }
                }
            }
        }

        var time = new Date().getTime();
        for (var i = 0; i < this.lasers.length; i++) {
            var las = this.lasers[i];
            if (time > las.start + las.dur) {
                this.removeId(this.lasers, las.id);
                i--;
            }
        }

        //You have to do loops which modify an array backwards, so you
        //don't mess up the indexes.
        for (var i = bugs.length - 1; i >= 0; i--) {
            if (bugs[i].hp <= 0) {
                this.money += bugs[i].value;
                //this.removeId(this.bugs, bugs[i].id);

                bugs.splice(i, 1);
            } else {
                bugs[i].update(true);
                var cen = bugs[i].sprite.getCenter();
                var c1 = Math.floor(cen.x / tileSize);
                var r1 = Math.floor(cen.y / tileSize);
                if (this.map[r1][c1] && this.map[r1][c1].object instanceof Base) {
                    //this.removeId(this.bugs, bugs[i].id);

                    bugs.splice(i, 1);

                    this.health -= 5;
                    if (this.health <= 0) {
                        window.location.reload();
                    }
                }
            }
        }
        while (bugs.length < 50) {
            var newBug = new Bug(this.bugTemp.x, this.bugTemp.y + Math.random() * 32 + 16, this.bugTemp.r, this.id++);
            newBug.engine = this;
            //this.bugs.push(newBug);
            bugs.push(newBug);
        }
        if (this.mY > 0 && this.mY < bH && this.mX > 0 && this.mX < bW) {
            var r = Math.floor(this.mY / tileSize);
            var c = Math.floor(this.mX / tileSize);

            var curTile = findClosest(this.engine, "Tile", { x: this.mX, y: this.mY }, 1000);

            curTile.hover = true;
        }
    };
    
/** Function */
    this.click = function (e) {
        var cX = e.offsetX;
        var cY = e.offsetY;

        if (cY > 0 && cY < bH && cX > 0 && cX < bW) {
            var r = Math.floor(cY / tileSize);
            var c = Math.floor(cX / tileSize);
            var map = this.map[r][c];

            var clickedTile = findClosest(this.engine, "Tile", { x: e.offsetX, y: e.offsetY }, 1000);

            if (clickedTile.object == null) {
                if (this.money - 50 >= 0) {
                    this.money -= 50;
                    clickedTile.addObject(Tower);
                }
            } else {
                if (clickedTile.object.click) {
                    clickedTile.object.click();
                }
            }
        }
    };
    
/** Function */
    this.draw = function () {
        pen = this.pen;
        pen.fillStyle = "black";
        ink.rect(0, 0, width, height, pen);
        pen.font = "25px Helvetica";
        pen.fillStyle = "#2233FF";
        ink.text(10, bH + 30, "Health: " + this.health, pen);
        ink.text(10, bH + 60, "Money: $" + this.money, pen);
        for (var r = 0; r < hTiles; r++) {
            for (var c = 0; c < wTiles; c++) {
                pen.save();
                this.map[r][c].draw(pen);
                pen.restore();
            }
        }

        var bugs = this.allObjects.Bug;
        for (var i = 0; i < bugs.length; i++) {
            pen.save();
            bugs[i].draw(pen);
            pen.restore();
        }

        for (var i = 0; i < this.lasers.length; i++) {
            pen.save();
            this.lasers[i].draw(pen);
            pen.restore();
        }

        for (var r = 0; r < hTiles; r++) {
            for (var c = 0; c < wTiles; c++) {
                var temp = this.map[r][c];
                if (temp.hover && temp.object instanceof Tower) {
                    pen.save();
                    temp.object.overlay(pen);
                    pen.restore();
                }
            }
        }



        this.pen.save();
        this.pen.strokeStyle = "red";
        //drawTree(this, "Tile", this.pen);
        this.pen.restore();
    };
    
/** Function */
    this.removeId = function(array, id) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                array.splice(i, 1);
                return;
            }
        }
    };
}