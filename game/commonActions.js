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
        this.base.addObject(new UpdateTicker(this.base.parent.attr, "speed", "triggerAttack", true));
    }

    //Going to be more than just doAttack!
    this.triggerAttack = function() {
        doAttack(this.base.parent);
    };
};

function Mortality() {
    this.base = new baseObj(this);

    this.update = function () {
        if (this.base.parent.attr.hp < 0)
            this.base.parent.die();
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