var targetStrategies = {
    Closest: function Closest () {
        this.extra_Range = 0; //Just to demonstrate what is possible, will be removed later
        this.run = function (tower) {
            var target = findClosest(tower.base.rootNode, "Bug", tower.tPos.getCenter(), tower.attr.range + this.extra_Range);
            return target;
        }
    },
    Random: function Random () {
        this.run = function (tower) {
            var targets = findAllWithin(tower.base.rootNode, "Bug", tower.tPos.getCenter(), tower.attr.range);
        
            if(targets.length == 0)
                return;

            var randomPos = Math.floor(Math.random() * targets.length);

            return targets[randomPos];        
        }
    },
};