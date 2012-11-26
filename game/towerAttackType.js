//Takes tower and target, does the attack, and returns everything it hit (as an array)

//This function grows too slowly!
function damageToTime(damage) {
    damage += 1;
    return (Math.log(Math.log(damage)) / Math.E + 1) / 2;
}

var attackTypes = {
    Normal: function normal() {
        this.run = function (tower, target) {
            target.attr.hp -= tower.attr.damage;
            tower.attr.hitcount += 1;

            tower.base.addObject(MakeLaser(tower, target, damageToTime(tower.attr.damage)));

            var hit = [];
            hit.push(target);

            return hit; //Can probably just return target...
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
        this.percent_damage = 50;
        this.run = function (tower, target) {
            var targets = findAllWithin(tower.base.rootNode, "Bug", target.tPos.getCenter(), this.radius);

            var hit = [];

            for (var key in targets) {
                var target = targets[key];

                var damage = tower.attr.damage * this.percent_damage / 100;

                target.attr.hp -= damage;
                tower.attr.hitcount += 1;

                hit.push(target);
            }

            var aoeCircle = new Circle(
                    target.tPos.getCenter(),
                    this.radius,
                    "rgba(255,255,255,0)",
                    "rgba(0,255,0,255)",
                    12);

            aoeCircle.base.addObject(new AlphaDecayPointer(1, 0.2, 0, aoeCircle.pColor));
            aoeCircle.base.addObject(new AlphaDecayPointer(1, 0.5, 0, aoeCircle.pFillColor));

            tower.base.addObject(aoeCircle);

            return hit; //Can probably just return targets...
        },
        this.draw = function (pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "A", pen);
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