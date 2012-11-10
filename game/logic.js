function Engine(pen) {
    this.mX = -1;
    this.mY = -1;
    this.pen = pen;

    this.id = 0;
    this.money = 100;
    this.health = 100;


    this.base = new baseObj("Engine");

    this.base.children.Tile = [];
    this.base.children.Bug = [];

    this.engine = this; //eng also works fine

    for (var r = 0; r < hTiles; r++) {        
        for (var c = 0; c < wTiles; c++) {
            this.base.addObject(new Tile(c * tileSize, r * tileSize, tileSize, tileSize))
        }
    }
    for (var r = hTiles / 2 - 1; r <= hTiles / 2; r++) {
        for (var c = 0; c < wTiles - 1; c++) {
            this.base.addObject(new Path(c * tileSize, r * tileSize, tileSize, tileSize))
        }
    }
    //this.map[hTiles / 2 - 1][wTiles - 1].addObject(Base); //OHHH Base means your main base, the place you defend!
    //this.map[hTiles / 2][wTiles - 1].addObject(Base);

    this.run = function(dt) {
        this.update(dt);
        this.draw();
        window.reqAnim(this.run.bind(this));
    };
    
/** Function */
    this.update = function (dt) {
        mX = this.mX;
        mY = this.my;

        this.curQuadTree = new QuadTree(this.base.children, -100, 1000, -100, 1000);

        var bugs = this.base.children.Bug;

        for (var key in this.base.children.Tile) {
            this.base.children.Tile[key].hover = false;
        }

        //You have to do loops which modify an array backwards, so you
        //don't mess up the indexes.
        for (var i = bugs.length - 1; i >= 0; i--) {
            /*
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
            */
        }
        while (bugs.length < 500) {
            var newBug = new Bug(5, Math.random() * 32 + 16, 4, this.id++);
            bugs.push(newBug);
        }

        if (this.mY > 0 && this.mY < bH && this.mX > 0 && this.mX < bW) {
            this.base.removeAllType("Tower_Range");

            this.base.addObject(new Tower_Range(x, y, tileSize, tileSize));

            var curTile = findClosest(this.engine, "Tile", { x: this.mX, y: this.mY }, 1000);
            curTile.hover = true;
        }

        this.base.update(dt);
    };
    
/** Function */
    this.click = function (e) {
        var cX = e.offsetX;
        var cY = e.offsetY;

        if (cY > 0 && cY < bH && cX > 0 && cX < bW) {

            var clickedTile = findClosest(this.engine, "Tile", { x: e.offsetX, y: e.offsetY }, 1000);

            if (clickedTile.object == null) {
                if (this.money - 50 >= 0) {
                    this.money -= 50;
                    clickedTile.addObject(new Tower(clickedTile.x, clickedTile.y, clickedTile.w, clickedTile.h));
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


        this.pen.save();
        this.pen.strokeStyle = "red";
        drawTree(this, "Bug", this.pen);
        this.pen.restore();

        this.base.draw(pen);
    };
}