var targetStrategies = {
//Capitalized as that is how we want to display it!
    Closest: function (tower) {
        var target = findClosest(tower.base.rootNode, "Bug", tower.tPos.getCenter(), tower.attr.range);
        return target;
    },
    Random: function (tower) {
        var targets = findAllWithin(tower.base.rootNode, "Bug", tower.tPos.getCenter(), tower.attr.range);
        
        if(targets.length == 0)
            return;

        var randomPos = Math.floor(Math.random() * targets.length);

        return targets[randomPos];        
    },
};