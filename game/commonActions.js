function doAttack(object) {
    if (!assertDefined(object, object.attr))
        return;

    var target = object.attr.target_Strategy.run(object);

    if (!target)
        return;

    var hit = object.attr.attack_type.run(object, target);
};

//The reason this is its own object is because the attack cycle will
//shortly (hopefully become much more complex than just calling doAttack.
function AttackCycle() {
    this.base = new baseObj(this);
    this.attackCounter = 0;

    this.added = function () {
        this.base.addObject(new UpdateTicker(this.base.parent.attr, "attSpeed", "triggerAttack", true));
    }

    //Going to be more than just doAttack!
    this.triggerAttack = function() {
        doAttack(this.base.parent);
    };
};

function Mortality() {
    this.base = new baseObj(this);

    this.update = function () {
        if (this.base.parent.attr.hp < 0) {
            var sound = new Sound("snd/die.wav");
            sound.play();
            this.base.parent.base.destroySelf();
        }
    }
}

//I foresee this function dying in a deep dark hole due to its
//(theoretical) major impacts on speed... but w/e, its cool
//(Actually... if these were to combine themselves and notice patterns they
//could probably be much much more efficient than the naive implementation)
function UpdateTicker(objWithDelay, tickDelayName, parentTickFunctionName, inverseRate) {
    this.base = new baseObj(this);
    
    this.objWithDelay = objWithDelay;
    this.tickDelayName = tickDelayName;

    this.parentTickFunctionName = parentTickFunctionName;

    this.inverseRate = inverseRate;

    this.currentCount = 0;

    this.update = function (dt) {
        this.currentCount += dt;

        if (this.inverseRate) {
            if (this.currentCount > (1 / this.objWithDelay[this.tickDelayName])) {
                this.base.parent[parentTickFunctionName]();
                this.currentCount = 0;
            }
        }
        else {
            if (this.currentCount > this.objWithDelay[this.tickDelayName]) {
                this.base.parent[parentTickFunctionName]();
                this.currentCount = 0;
            }
        }
    }
}

//Could also just be an UpdateTicker that calls base.destroySelf
function Lifetime(lifetime) {
    this.base = new baseObj(this);

    this.lifetime = lifetime;

    this.update = function (dt) {
        this.lifetime -= dt;

        if (this.lifetime < 0)
            this.base.parent.base.destroySelf();
    }
}

function Selectable() {
    this.base = new baseObj(this);

    this.ignoreNext = false;

    //Magical hacks
    this.topMost = false;
    //I use mouseup because click doesn't have topMost because I don't want to implement it
    this.parent_mouseup = function (e) {
        this.topMost = e.topMost;
    }

    this.parent_click = function () {
        if (this.ignoreNext) {
            this.ignoreNext = false;
            return;
        }
        if (this.topMost)
            this.base.rootNode.changeSel(this.base.parent);
    }

    this.parent_die = function () {
        if(this.base.rootNode.selectedObj == this.base.parent)
            this.base.rootNode.changeSel(null);
    }
}

function HoverIndicator(objectPointed) {
    this.base = new baseObj(this, 20);

    this.objectPointer = objectPointed;

    this.draw = function (pen) {
        if (this.objectPointer && this.objectPointer.tPos) {
            var p = this.objectPointer.tPos;
            //pen.fillStyle = this.color;
            //pen.strokeStyle = "lightblue";
            //ink.rect(p.x, p.y, p.w, p.h, pen);

            pen.fillStyle = "rgba(255, 255, 255, 0.25)";
            pen.strokeStyle = "yellow";
            pen.lineWidth = 1;
            ink.rect(p.x, p.y, p.w, p.h, pen);
        }
    }
}

function SlowEffect(magnitude) {
    this.base = new baseObj(this, 15);
    this.magnitude = magnitude;

    this.added = function () {
        this.base.parent.attr.speed *= this.magnitude;
    }

    this.die = function () {
        this.base.parent.attr.speed /= this.magnitude;
    }

    this.draw = function (pen) {
        var p = this.base.parent.tPos;
        pen.fillStyle = "dodgerblue";
        pen.strokeStyle = "white";
        pen.lineWidth = 1;
        ink.circ(p.getCenter().x, p.getCenter().y, p.w / 2, pen);
    }
}