var targetStrategies = {
    Closest: function Closest () {
        this.extra_Range = 0; //Just to demonstrate what is possible, will be removed later
        this.run = function (attacker) {
            var targetType = getRealType(attacker) == "Bug" ? "Tower" : "Bug";

            var target = findClosest(attacker.base.rootNode, targetType,
                            attacker.tPos.getCenter(), attacker.attr.range + this.extra_Range);
            return target;
        }
    },
    Random: function Random () {
        this.run = function (attacker) {
            var targetType = getRealType(attacker) == "Bug" ? "Tower" : "Bug";

            var targets = findAllWithin(attacker.base.rootNode, targetType, 
                            attacker.tPos.getCenter(), attacker.attr.range);
        
            if(targets.length == 0)
                return;

            var randomPos = Math.floor(Math.random() * targets.length);

            return targets[randomPos];        
        }
    },
};