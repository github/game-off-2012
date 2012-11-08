function Engine(pen) {
    this.mX = -1;
    this.mY = -1;
    this.pen = pen;
    this.map = [];
    this.bugs = [];
    this.lasers = [];
    this.id = 0;
    this.money = 100;
    this.health = 100;
    for (var r = 0; r < hTiles; r++) {
        this.map[r] = [];
        for (var c = 0; c < wTiles; c++) {
            this.map[r][c] = new Tile(c * tileSize, r * tileSize, tileSize, tileSize);
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
    
/***/
    this.run = function() {
        this.update();
        this.draw();
        window.reqAnim(this.run.bind(this));
    };
    
/***/
    this.update = function() {
        for (r = 0; r < hTiles; r++) {
            for (c = 0; c < wTiles; c++) {
                var tile = this.map[r][c];
                tile.hover = false;
                tile.update();
                var bugs = this.bugs;
                if (tile.object instanceof Tower && tile.object.nextFire < new Date().getTime()) {
                    for (var i = 0; i < bugs.length; i++) {
                        var cent1 = tile.sprite.getCenter();
                        var cent2 = {x: bugs[i].sprite.x, y: bugs[i].sprite.y};
                        var dist = Math.sqrt(Math.pow(cent2.x - cent1.x, 2)
                                    + Math.pow(cent2.y - cent1.y, 2)) - bugs[i].sprite.w;
                        if (dist < tile.object.range) {
                            tile.object.nextFire = new Date().getTime() + tile.object.coolDown;
                            bugs[i].hp -= tile.object.damage;
                            this.lasers.push(new Laser(cent1.x, cent1.y, cent2.x, cent2.y,
                                        new Date().getTime(), tile.object.laserTime, this.id++));
                            break;
                        }
                    }
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
        for (var i = 0; i < bugs.length; i++) {
            if (bugs[i].hp <= 0) {
                this.money += bugs[i].value;
                this.removeId(this.bugs, bugs[i].id);
                i--;
            } else {
                bugs[i].update();
                var cen = bugs[i].sprite.getCenter();
                var c1 = Math.floor(cen.x / tileSize);
                var r1 = Math.floor(cen.y / tileSize);
                if (this.map[r1][c1] && this.map[r1][c1].object instanceof Base) {
                    this.removeId(this.bugs, bugs[i].id);
                    this.health -= 5;
                    if (this.health <= 0) {
                        window.location.reload();
                    }
                }
            }
        }
        while (this.bugs.length < 5) {
            this.bugs.push(new Bug(this.bugTemp.x, this.bugTemp.y + Math.random() * 32 + 16, this.bugTemp.r, this.id++));
        }
        if (this.mY > 0 && this.mY < bH && this.mX > 0 && this.mX < bW) {
            var r = Math.floor(this.mY / tileSize);
            var c = Math.floor(this.mX / tileSize);
            this.map[r][c].hover = true;
        }
    };
    
/***/
    this.click = function(e) {
        var cX = e.offsetX;
        var cY = e.offsetY;
        
        if (cY > 0 && cY < bH && cX > 0 && cX < bW) {
            var r = Math.floor(cY / tileSize);
            var c = Math.floor(cX / tileSize);
            var map = this.map[r][c];
            if (map.object == null) {
                if (this.money - 50 >= 0) {
                    this.money -= 50;
                    map.addObject(Tower);
                }
            } else {
                if (map.object.click) {
                    map.object.click();
                }
            }
        }
    };
    
/***/
    this.draw = function() {
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
        for (var i = 0; i < this.bugs.length; i++) {
            pen.save();
            this.bugs[i].draw(pen);
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
    };
    
/***/
    this.removeId = function(array, id) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                array.splice(i, 1);
                return;
            }
        }
    };
}