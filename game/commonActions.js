//The reason this is its own object is because the attack cycle will
//shortly (hopefully become much more complex than just calling doAttack.
function AttackCycle() {
    this.base = new BaseObj(this);
    this.attackCounter = 0;

    this.added = function () {
        this.base.addObject(new UpdateTicker(this.base.parent.attr, "attSpeed", "triggerAttack", true));
    }
    
    this.triggerAttack = function () {
        var attacker = this.base.parent;
        var attackTypes = attacker.attr.attack_types || attacker.attr.bug_attack_types;

        if (attackTypes && attackTypes.length > 0) {
            startAttack(new AttackTemplate(attackTypes[0], attacker, null, attacker.attr.damage, attacker, 0));
        }
    };
};

//I foresee this function dying in a deep dark hole due to its
//(theoretical) major impacts on speed... but w/e, its cool
//(Actually... if these were to combine themselves and notice patterns they
//could probably be much much more efficient than the naive implementation)
function UpdateTicker(objWithDelay, tickDelayName, parentTickFunctionName, inverseRate) {
    this.base = new BaseObj(this);
    
    this.objWithDelay = objWithDelay;
    this.tickDelayName = tickDelayName;

    this.parentTickFunctionName = parentTickFunctionName;

    this.inverseRate = inverseRate;

    this.currentCount = 0;

    this.update = function (dt) {
        this.currentCount += dt;

        var objDelay = 0;

        if (this.inverseRate) {
            if (this.objWithDelay[this.tickDelayName] < 0) {
                objDelay = Math.exp(this.objWithDelay[this.tickDelayName]) / Math.E;
            }
            else {
                objDelay = 1 / this.objWithDelay[this.tickDelayName];
            }
        }
        else {
            objDelay = this.objWithDelay[this.tickDelayName];
        }

        if (this.currentCount > objDelay) {
            this.base.parent[parentTickFunctionName]();
            this.currentCount = 0;
        }
    }
}

//Could also just be an UpdateTicker that calls base.destroySelf
function Lifetime(lifetime) {
    this.base = new BaseObj(this);

    this.lifetime = lifetime;

    this.update = function (dt) {
        this.lifetime -= dt;

        if (this.lifetime < 0)
            this.base.parent.base.destroySelf();
    }
}

function Selectable() {
    this.base = new BaseObj(this);

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

function HoverIndicator() {
    this.base = new BaseObj(this, 20);

    this.draw = function (pen) {
        var p = this.base.parent.tPos;

        pen.fillStyle = "rgba(255, 255, 255, 0.25)";
        pen.strokeStyle = "yellow";
        pen.lineWidth = 1;
        ink.circ(p.getCenter().x, p.getCenter().y, p.w / 2, pen);
    }
}

function SlowEffect(magnitude) {
    this.base = new BaseObj(this, 15);
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

//(Should really be a tween property class)
//Creates an animations of its parent from start to end
//and then calls callback
function MotionDelay(start, end, time, callback) {
    this.base = new BaseObj(this);

    this.start = start;
    this.end = end;
    this.time = time;
    this.baseTime = time;

    this.callback = callback;

    this.update = function (dt) {
        this.time -= dt;
        if (this.time < 0) {
            callback();
            this.base.destroySelf();
            return;
        }

        var start = this.start;
        var end = this.end;        

        var progress = this.time / this.baseTime;

        this.base.parent.tPos.x = start.x * progress + end.x * (1 - progress);
        this.base.parent.tPos.y = start.y * progress + end.y * (1 - progress);
    }
}

function AttributeTween(start, end, time, callbackName, attributeName) {
    this.base = new BaseObj(this);

    this.start = start;
    this.end = end;
    this.time = time;
    this.baseTime = time;

    this.callbackName = callbackName;

    this.attributeName = attributeName;

    this.update = function (dt) {
        this.time -= dt;
        if (this.time < 0) {
            this.base.parent[this.callbackName]();
            this.base.destroySelf();
            return;
        }

        var start = this.start;
        var end = this.end;

        var progress = this.time / this.baseTime;

        var attrName = this.attributeName;

        this.base.parent[attrName] = start * progress + end * (1 - progress);
    }
}

function SimpleCallback(time, callbackName) {
    this.base = new BaseObj(this);

    this.time = time;
    this.baseTime = time;

    this.callbackName = callbackName;

    this.update = function (dt) {
        this.time -= dt;
        if (this.time < 0) {
            this.base.parent[this.callbackName]();
            this.base.destroySelf();
            return;
        }
    }
}