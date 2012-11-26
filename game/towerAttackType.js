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
        }
    },
    Aoe: function area_of_effect() {
        this.radius = 50;
        this.percent_damage = 50;
        this.run = function (tower, target) {
            var targets = findAllWithin(tower.base.rootNode, "Bug", target.tPos.getCenter(), this.radius);

            var hit = [];

            for (var key in targets) {
                var target = targets[key];

                var damage = tower.attr.damage * this.percent_damage / 100;

                target.attr.hp -= damage;
                tower.attr.hitcount += 1;

                tower.base.addObject(MakeLaser(tower, target, damageToTime(damage)));

                hit.push(target);
            }

            return hit; //Can probably just return targets...
        }
    }
};