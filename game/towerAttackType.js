//Takes tower and target, does the attack, and returns everything it hit (as an array, or a single object)

//This function grows too slowly!
function damageToTime(damage) {
    damage += 1;
    return (Math.log(Math.log(damage)) / Math.E + 1) / 2;
}

//Should really make attacks have delay between
//attack trigger and damage time (impact).

//Normal
//Aoe
//Slow
//Arcing (delay arcs also)
//DOT

function applyDamage(target, attacker, damage) {
    target.attr.hp -= damage;
    attacker.attr.hitcount ++;
}

var attackTypes = {
    Normal: function normal() {
        this.run = function (tower, target) {
            applyDamage(target, tower, tower.attr.damage);

            tower.base.addObject(MakeLaser(tower, target, damageToTime(tower.attr.damage)));

            return target;
        },
        this.draw = function (pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "N", pen);
        }
    },
    Aoe: function area_of_effect() {
        this.radius = 15;
        this.percent_damage = 1;
        this.run = function (tower, target) {
            var targets = findAllWithin(tower.base.rootNode, "Bug", target.tPos.getCenter(), this.radius);

            var hit = [];

            var damage = tower.attr.damage;

            for (var key in targets) {
                applyDamage(targets[key], tower, damage);
                hit.push(targets[key]);
            }

            var aoeCircle = new Circle(
                    target.tPos.getCenter(),
                    this.radius,
                    "rgba(255,255,255,0)",
                    "rgba(0,255,0,255)",
                    12);

            var line = new Line(tower.tPos.getCenter(), target.tPos.getCenter(), "rgba(0,255,0,255)", 13);

            aoeCircle.base.addObject(new AlphaDecayPointer(1, 0.2, 0, aoeCircle.pColor));
            aoeCircle.base.addObject(new AlphaDecayPointer(1, 0.5, 0, aoeCircle.pFillColor));

            line.base.addObject(new AlphaDecay(1, 1, 0));

            tower.base.addObject(aoeCircle);
            tower.base.addObject(line);

            return hit; //Can probably just return targets...
        },
        this.draw = function (pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "A", pen);
        },
        this.applyAttrMods = function(attr) {
            attr.damage *= this.percent_damage / 100
        }
    },
    Slow: function slow() {        
        this.percent_slow = 50;
        this.duration = 2;
        this.run = function (tower, target) {
            var slowEffect = new SlowEffect(this.percent_slow / 100);
            slowEffect.base.addObject(new Lifetime(this.duration));

            target.base.addObject(slowEffect);

            var line = new Line(tower.tPos.getCenter(), target.tPos.getCenter(), "rgba(10,50,250,255)", 13);
            line.base.addObject(new AlphaDecay(1, 1, 0));
            tower.base.addObject(line);

            return target;
        },
        this.draw = function (pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "S", pen);
        }
    },
};


var bugAttackTypes = {
    Normal: function normal() {
        this.run = function (tower, target) {
            applyDamage(target, tower, tower.attr.damage);

            tower.base.addObject(MakeLaser(tower, target, damageToTime(tower.attr.damage)));

            return target;
        },
        this.draw = function (pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "N", pen);
        }
    }
};


function drawAttributes(user, pen) {
    drawTiled(pen,
        function (obj, pen, pos) {
            if (typeof obj == "number")
                return false;
            obj.draw(pen, pos);
            return true;
        },
        user.attr,
        new temporalPos(
            user.tPos.x + user.tPos.w * 0.15,
            user.tPos.y + user.tPos.h * 0.4,
            user.tPos.w * 0.85,
            user.tPos.h * 0.6),
        2, 2,
        0.1);
}