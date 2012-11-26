//Takes tower and target, does the attack, and returns everything it hit (as an array)

var attackTypes = {
    Normal: function normal() {
        this.run = function (tower, target) {
            target.hp -= tower.attr.damage;
            tower.attr.hitcount += 1;

            tower.base.addObject(MakeTowerLaser(tower, target));

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

                target.hp -= tower.attr.damage * this.percent_damage / 100;
                tower.attr.hitcount += 1;

                tower.base.addObject(MakeTowerLaser(tower, target));

                hit.push(target);
            }

            return hit; //Can probably just return targets...
        }
    }
};