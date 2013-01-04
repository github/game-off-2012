function Tower_Packet(t1, t2, speed, allele) {
    this.base = new BaseObj(this, 12);
    // We don't really need it
    this.tpos = new Rect(0, 0, 1, 1);
    var p1 = t1.tPos.center();
    var p2 = t2.tPos.center();
    
    var dis = p1.clone().sub(p2).mag();
    
    var packet = new SCircle(p1, 3, allele.getOuterColor(), allele.getInnerColor(), 15);
    packet.lineWidth = 1;
    
    var motionDelay = new MotionDelay(p1, p2, dis / speed, apply);
    this.base.addObject(packet);
    packet.base.addObject(motionDelay);
    
    var that = this;
    function apply() {
        t2.genes.addAllele(allele);
        that.base.destroySelf();
    }
}

function Tower_Connection(t1, t2) {
    this.tPos = new Rect(0, 0, 0, 0);
    this.base = new BaseObj(this, 11);

    var line = new SLine(t1.tPos.center(), t2.tPos.center(), "rgba(0, 255, 0, 0.2)", 11, [0.1, 0.3, 0.5, 0.7, 0.9]);
    this.base.addObject(line);
    
    var prevhitCount;
    var deleteButton;
    
    var that = this;
    
    function addDeleteButton() {
        var width = 20;
        var height = 20;
        
        var delta = t2.tPos.center();
        delta.sub(t1.tPos.center());
        delta.mult(1/2);
        
        var pos = t2.tPos.center();
        pos.sub(delta);
        pos.sub(new Vector(width * 0.5, height * 0.5));
        pos = new Rect(0, 0, width, height).origin(pos);
        
        deleteButton = new Button("-", bind(that, "deleteSelf"), 50).resize(pos);
        that.base.addObject(deleteButton);
    }
    addDeleteButton();
    
    function dataTransfer(t1, t2) {
        function sendRandomPacket(t1, t2, speed) {
            var group = pickRandomKey(t1.genes.alleles);
            var al = t1.genes.alleles[group];

            that.base.addObject(new Tower_Packet(t1, t2, speed, al));
        }

        if (prevhitCount === undefined) {
            prevhitCount = t1.attr.kills;
            return;
        }
        
        var dis = cloneObject(t1.tPos.center());
        dis.sub(t2.tPos.center());
        dis = dis.mag() / 1000;

        var speed = Math.max(Math.min(t1.attr.upload, t2.attr.download) / dis, 0.00000001 /* should really be zero */);
        var killsRequired = 10 / speed;
        var killDelta = t1.attr.kills - prevhitCount;
        
        while (Math.floor(killDelta / killsRequired) > 0) {
            sendRandomPacket(t1, t2, speed);
            prevhitCount += killsRequired;
            killDelta = t1.attr.kills - prevhitCount;
        }
        prevhitCount = t1.attr.kills - killDelta;
    }
    
    this.deleteSelf = function () {
        var conns = this.base.parent.connections;

        for(var key in conns) {
            if(conns[key] == this) {
                conns.splice(key, 1);
                break;
            }
        }

        this.base.destroySelf();
    }

    this.update = function (dt) {
        dataTransfer(t1, t2);

        deleteButton.hidden = !this.base.parent.hover;

        // Wtf... setColorPart() should not be a thing.
        if (this.base.parent.hover) {
            line.color = setColorPart(line.color, 3, 0.9);            
        } else {
            line.color = setColorPart(line.color, 3, 0.2);
        }
    }
}

TowerStats = {
        range:          0,
        damage:         0,
        hp:             0,
        currentHp:      0,
        hpRegen:        1,
        attSpeed:       0,
        upload:         5,
        download:       5,
        hitCount:       0,
        kills:          0,
        value:          50
    };

function Tower(baseTile, tPos) {    
    this.baseTile = baseTile;
    var p = tPos;
    this.tPos = new Rect(p.x, p.y, p.w, p.h);
    this.base = new BaseObj(this, 10);

    this.attr = {};
    this.setBaseAttrs = function () {
        //Lol, prevCur...
        var prevCurHp = this.attr.hp || this.attr.currentHp;
        if (!prevCurHp) prevCurHp = 0;
        this.attr = {
            range:          TowerStats.range,
            damage:         TowerStats.damage,
            hp:             TowerStats.hp,
            currentHp:      TowerStats.currentHp,
            hpRegen:        TowerStats.hpRegen,
            attSpeed:       TowerStats.attSpeed,
            upload:         TowerStats.upload,
            download:       TowerStats.download,
            hitCount:       TowerStats.hitCount,
            kills:          0,
            value:          TowerStats.value
        };
        this.attr.targetStrategy = new targetStrategies.Closest();
        this.attr.attackTypes = [];
    };
    this.setBaseAttrs();

    //List of alleles
    this.allelesGenerated = [];

    this.genes = new Genes();
    this.base.addObject(this.genes);

    //For alleles.
    this.autoTrash = true;

    this.connections = [];

    this.base.addObject(this.attackCycle = new AttackCycle());
    //this.base.addObject(new UpdateTicker(this.attr, "mutate", "mutate", true));
    this.base.addObject(new Selectable());
    
    this.constantOne = 1;
    this.base.addObject(new UpdateTicker(this, "constantOne", "regenTick"));

    for (var alGroup in TowerAlleles) {
        if (!this.genes.alleles[alGroup]) {
            this.genes.addAllele(new Allele(alGroup, TowerAlleles[alGroup]()));
        }
    }

    this.added = function () {
        this.recalculateAppearance();
    }

    this.generateAllele = function () {
        var genAllGroup = pickRandomKey(AllAlleleGroups);

        var alleleGenerated = new Allele(genAllGroup, AllAlleleGroups[genAllGroup]());
        this.allelesGenerated.push(alleleGenerated);
    }

    this.regenTick = function () {
        if (this.attr.hpRegen > 0) {
            this.attr.currentHp += this.attr.hpRegen;
        }
        if (this.attr.currentHp > this.attr.hp) {
            this.attr.currentHp = this.attr.hp;
        }
    }

    this.update = function (dt) {
        this.recalculateAppearance(true);
    }

    //This may also change x, y, w and h.
    this.recalculateAppearance = function (changeSize) {
        this.color = getInnerColorFromAttrs(this.attr);
        this.borderColor = getOuterColorFromAttrs(this.attr);

        //Shows HP
        var outerWidth = Math.pow(this.attr.hp / 50, 0.5) * 8;
        this.outerWidth = outerWidth;

        //Show HP regen?
        var innerWidth = Math.log(this.attr.hp / this.attr.damage / this.attr.attSpeed + 10) * 6; //Math.pow(this.attr.hpRegen * 10, 0.9);

        var center = this.tPos.center();

        var totalWidth = outerWidth + innerWidth;

        if(changeSize) {
            this.tPos.x = center.x - totalWidth;
            this.tPos.y = center.y - totalWidth;

            this.tPos.w = totalWidth * 2;
            this.tPos.h = totalWidth * 2;
        }

        this.lineWidth = outerWidth;
    }

    this.draw = function (pen) {
        var pos = this.tPos.clone();
        var cen = pos.center();

        pos.x += this.outerWidth;
        pos.y += this.outerWidth;

        pos.w -= this.outerWidth * 2;
        pos.h -= this.outerWidth * 2;

        DRAW.rect(pen, pos,
                  this.color);

        this.drawHpBars(pen, pos);


        DRAW.circle(pen, cen, this.attr.range,
            setAlpha(this.color, 0.1));

        drawAttributes(this, pen);
    };

    this.drawHpBars = function(pen, pos) {
        //One hp bar per x hp
        var hpPerBar = 10;

        //Total of hp in bars one one side equal to hp regenerated in x seconds
        var timePerSide = 10;

        var numberOfBars = this.attr.hp / hpPerBar;
        var barsFilled = this.attr.currentHp / hpPerBar;
        var barsPerSide = Math.ceil(timePerSide * this.attr.hpRegen / hpPerBar);

        //Shows HP
        var outerWidth = Math.pow(this.attr.hp / 50, 0.9);

        var layers = Math.ceil(numberOfBars / barsPerSide / 4);

        //Draw hp bars around rectangle...
        //We draw it with a finite state machine, the state is the position, color, size etc.
        //Then we just increment the state machine a lot.
        var barHeight = this.outerWidth / layers;//10 / Math.pow(barsPerSide, 0.1);//50 / Math.ceil(numberOfBars / barsPerSide / 4);
        var barWidth = pos.w / barsPerSide;


        var posX = pos.x;
        var posY = pos.y;
        var width = barWidth;
        var height = barHeight;

        var color = this.borderColor;

        var rotationPosition = 0; //0 = top, 1 = left, etc (clockwise)
        var sideCount = 0;

        var onX = true;

        var currentFactor = 1;

        posY -= height;

        function nextBar() {
            switch(rotationPosition) {
                case 0:
                    posX += width;
                    break;
                case 1:
                    posY += height;
                    break;
                case 2:
                    posX += width;
                    break;
                case 3:
                    posY += height;
                    break;
            }
        }
        function rotateBar() {
            function swapWidthHeight() {
                var temp = width;
                width = -height;
                height = temp;
            }
            switch(rotationPosition) {
                case 0:
                    width = barHeight; //Rotate bar
                    height = barWidth;

                    posX += barHeight * (currentFactor - 1); //Move out to correct distance away from square
                    posY += barHeight * currentFactor; //Move to correct start
                    break;
                case 1:
                    width = -barWidth; //Rotate bar
                    height = barHeight;

                    posX -= barHeight * (currentFactor - 1);
                    posY += barHeight * (currentFactor - 1);
                    break;
                case 2:
                    width = -barHeight; //Rotate bar
                    height = -barWidth;

                    posX -= barHeight * (currentFactor - 1);
                    posY -= barHeight * (currentFactor - 1);
                    break;
                case 3:
                    width = barWidth; //Rotate bar
                    height = barHeight;

                    posX += barHeight * (currentFactor - 1);
                    posY -= barHeight * (currentFactor + 1);
                    break;
            }
            rotationPosition++;
            if(rotationPosition >= 4) {
                rotationPosition = 0;
                currentFactor++;
            }
        }

        while(numberOfBars > 0) {
            //if(rotationPosition > 1)
              //  nextBar();

            var xBuffer = (width) * 0.15;
            var yBuffer = (height) * 0.15;

            function drawBar(color, widthPercent, heightPercent) {
                DRAW.rect(pen,
                        new Rect(
                                    posX + xBuffer, posY + yBuffer,
                                    ((width) - xBuffer * 2) * widthPercent,
                                    ((height) - yBuffer * 2) * heightPercent
                                ),
                         color);
            }

            if(barsFilled < 1) {
                drawBar("grey", 1, 1);

                if(barsFilled > 0) {
                    var currentFill = barsFilled % 1;
                    if(rotationPosition == 1 || rotationPosition == 3)
                        drawBar(color, 1, currentFill);
                    else
                        drawBar(color, currentFill, 1);
                }
            } else {
                drawBar(color, 1, 1);
            }

            //if(rotationPosition <= 1)
                nextBar();

            sideCount++;
            if(sideCount >= barsPerSide) {
                sideCount = 0;
                rotateBar();
            }

            numberOfBars--;
            barsFilled--;
        }
    }

    this.tryUpgrade = function () {
        var game = getGame(this);

        if (game.money >= 100) {
            this.attr.damage *= 2;
            this.attr.attSpeed *= 2;
            game.money -= 100;
        }
    };
    
    this.die = function() {
        var c = this.connections;
        for (var i = 0; i < c.length; i++) {
            c[i].base.destroySelf();
        }
        new Sound("snd/Tower_Die.wav").play();
    };

    this.mutate = function() {
        function invalid(attr) {
            // NaN
            if (attr != attr) return true;
            if (attr == Infinity) return true;
            if (attr == -Infinity) return true;
            return false
        }
        
        //a and at are too small for proper variable names
        var a = this.attr;
        
        for (at in a) {
            if(typeof a[at] != "number")
                continue;
            //Seriously... WTF. This code used to mean if you did:
            //attr.daf += 1 it causes the object to be deleted.
            if (invalid(a[at])) {
                if(a[at] < 0) {
                    this.die();
                } else {
                    fail("Invalid attribute in attr of object (you likely have a typo).");
                }
            }
            if (at == "hitCount") continue;
            if (at == "mutate" || at == "mutatestrength") {
                // Avoid exponetial increase in all tower stats if mutate mutation was calculated just like all the other values.
                a[at] += (Math.random() - 0.5) * a.mutatestrength / 500;
            } else {
                a[at] += (Math.random() - 0.5) * a.mutatestrength / 500 * a[at];
            }
        }
        
        if (a.range < 1) {
            a.range = 1;
        }
        
        this.recolor();
    };
    
    this.mouseover = function(e) {
        // Only required because of issue #29
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].hover = true;
        }
    };
    
    this.mouseout = function(e) {
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].hover = false;
        }
    };

    this.startDrag = null;
    this.dragOffset = null;
    this.mousedown = function(e) {
        this.startDrag = e;
        this.dragOffset = new Vector(this.tPos);
        this.dragOffset.sub(e);

        getGame(this).input.globalMouseMove[this.base.id] = this;
        getGame(this).input.globalMouseUp[this.base.id] = this;
    };

    this.mousemove = function(e)
    {
        var eng = getEng(this);

        if(this.startDrag) {
            var vector = new Vector(e);
            vector.add(this.dragOffset);

            this.tryToMove(vector, eng);
        }
    }

    this.mouseup = function(e){
        var eng = this.base.rootNode;
        var game = eng.game;

        this.startDrag = null;

        /*
        var towerSelected = findClosestToPoint(eng, "Tower", e, 0);
        if(towerSelected && towerSelected != this)
        {
            for (var i = 0; i < this.connections.length; i++)
                if(this.connections[i].t2 == towerSelected)
                    return;
            
            var conn = new Tower_Connection(this, towerSelected);
            this.base.addObject(conn);
            this.connections.push(conn);
            towerSelected.connections.push(conn);

            game.changeSel(this);
            getAnElement(this.base.children.Selectable).ignoreNext = true;
        }
        */

        delete getGame(this).input.globalMouseMove[this.base.id];
        delete getGame(this).input.globalMouseUp[this.base.id];
    };

    //Given that the user has told us to move this tower to the destination,
    //tries to move it as close as possible.
    this.tryToMove = function (destination, eng) {
        var tower = this;
        tower.hidden = true;
        var e = destination;

        var originalPos = cloneObject(tower.tPos);

        tower.tPos.x = e.x;
        tower.tPos.y = e.y;

        var collisions = [];
        mergeToArray(findAllWithinDistanceToRect(eng, "Tower", tower.tPos, 0), collisions);
        mergeToArray(findAllWithinDistanceToRect(eng, "Path", tower.tPos, 0), collisions);

        if(collisions.length > 0) {
            var alignTo = collisions[0];
            var offset = minVecForDistanceRects(tower.tPos, alignTo.tPos, 1);

            e.x += offset.x;
            e.y += offset.y;
        }

        tower.tPos.x = e.x;
        tower.tPos.y = e.y;

        //This code is kinda buggy... but thats okay... in the future we will project a line
        //from the tower position to the cursor and just put the tower as far upon that line as possible.
        //(this projection code will be created for bullets and lasers anyway).
        tower.tPos.x = e.x;
        var collisions = [];
        mergeToArray(findAllWithinDistanceToRect(eng, "Tower", tower.tPos, 0), collisions);
        mergeToArray(findAllWithinDistanceToRect(eng, "Path", tower.tPos, 0), collisions);
        if(collisions.length > 0) {
            tower.tPos.x = originalPos.x;
        }

        tower.tPos.y = e.y;
        var collisions = [];
        mergeToArray(findAllWithinDistanceToRect(eng, "Tower", tower.tPos, 0), collisions);
        mergeToArray(findAllWithinDistanceToRect(eng, "Path", tower.tPos, 0), collisions);
        if(collisions.length > 0) {
            tower.tPos.y = originalPos.y;
        }
        tower.hidden = false;
    }
}

function canPlace(tower, pos, eng) {
    var game = eng.game;

    var originalPosX = tower.tPos.x;
    var originalPosY = tower.tPos.y;

    tower.recalculateAppearance(true);
    tower.tPos.x = pos.x;
    tower.tPos.y = pos.y;

    var towerRadius = tower.tPos.w / 2;

    var e = pos;
    var towerCollision = findClosestToRect(eng, "Tower", tower.tPos, 0);
    var pathOnTile = findClosestToRect(eng, "Path", tower.tPos, 0);
    var tileExist = findClosestToRect(eng, "Tile", tower.tPos, 0);

    tower.tPos.x = originalPosX;
    tower.tPos.y = originalPosY;

    if (!towerCollision && !pathOnTile && tileExist) {
        return true;
    }
    return false;
}

function tryPlaceTower(tower, pos, eng)
{
    var game = eng.game;

    tower.recalculateAppearance(true);
    tower.tPos.x = pos.x;
    tower.tPos.y = pos.y;

    var tileExist = findClosestToPoint(eng, "Tile", pos, 0);

    if (canPlace(tower, pos, eng)) {
        eng.base.addObject(tower);
        game.changeSel(tower);
        tower.value = game.currentCost;
        if(tileExist)
            getAnElement(tileExist.base.children.Selectable).ignoreNext = true;
        return true;
    }
    return false;
};