function Sprite(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.w = w;
    this.h = h;
    
/***/
    this.update = function() {
        this.x += this.dx;
        this.y += this.dy;
    };
    
/***/
    this.getCenter = function() {
        return {x: this.x + this.w / 2, y: this.y + this.h / 2};
    };
}

function Tile(x, y, w, h) {
    this.hover = false;
    this.sprite = new Sprite(x, y, w, h);
    this.object = null;
    
/***/
    this.addObject = function(obj) {
        this.object = new obj(this.sprite, this);
    };
    
/***/
    this.update = function() {
        if (this.object != null && this.object.update) {
            this.object.update();
        }
    };
    
/***/
    this.draw = function(pen) {
        var s = this.sprite;
        if (this.object == null) {
            pen.fillStyle = "white";
            if (this.hover) {
                pen.strokeStyle = "yellow";
            } else {
                pen.strokeStyle = "black";
            }
            ink.rect(s.x, s.y, s.w, s.h, pen);
        } else {
            if (this.object.draw) {
                this.object.draw(pen);
            }
        }
    };
}

function Path(sprite) {
    this.sprite = sprite;
    
/***/
    this.draw = function(pen) {
        var s = this.sprite;
        pen.fillStyle = "green";
        pen.strokeStyle = "green";
        ink.rect(s.x, s.y, s.w, s.h, pen);
    };
}

function Base(sprite) {
    this.sprite = sprite;
    
/***/
    this.draw = function(pen) {
        var s = this.sprite;
        pen.fillStyle = "blue";
        pen.strokeStyle = "blue";
        ink.rect(s.x, s.y, s.w, s.h, pen);
    };
}

function Tower(sprite) {
    this.sprite = sprite;
    this.range = 112;
    this.damage = 16;
    this.nextFire = 0;
    this.coolDown = 200;
    this.laserTime = 50;
    
/***/
    this.draw = function(pen) {
        var s = this.sprite;
        pen.fillStyle = "red";
        pen.strokeStyle = "red";
        ink.rect(s.x, s.y, s.w, s.h, pen);
    };
    
/***/
    this.overlay = function(pen) {
        var s = this.sprite;
        pen.save();
        pen.lineWidth = 2;
        pen.fillStyle = "transparent";
        pen.strokeStyle = "blue";
        ink.circ(s.x + s.w / 2, s.y + s.h / 2, this.range, pen);
        pen.restore();
    };
}

function Bug(x, y, r, id) {
    this.sprite = new Sprite(x, y, r, r);
    this.id = id;
    this.hp = 100;
    this.value = 15;
    this.speed = 0.2;
    this.sprite.dx = this.speed;
    
/***/
    this.update = function() {
        this.sprite.update();
    };
    
/***/
    this.draw = function(pen) {
        var s = this.sprite;
        pen.fillStyle = "yellow";
        pen.strokeStyle = "orange";
        pen.save();
        pen.lineWidth = 1;
        ink.circ(s.x, s.y, s.w, pen);
        pen.restore();
    };
}

function Laser(x1, y1, x2, y2, start, dur, id) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.start = start;
    this.dur = dur;
    this.id = id;
    
/***/
    this.draw = function(pen) {
        pen.strokeStyle = "purple";
        pen.save();
        pen.lineWidth = 5;
        ink.line(this.x1, this.y1, this.x2, this.y2, pen);
        pen.restore();
    };
}