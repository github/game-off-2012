var targetStrategies = {
    Closest: function Closest () {
        this.extra_Range = 0; //Just to demonstrate what is possible, will be removed later
        this.run = function (attacker) {
            var targetType = getRealType(attacker) == "Bug" ? "Tower" : "Bug";

            var target = findClosest(attacker.base.rootNode, targetType,
                            attacker.tPos.getCenter(), attacker.attr.range + this.extra_Range);
            return target;
        },
        this.drawGlyph = function(pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "C", pen);
        };
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
        },
        this.draw = function(pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "R", pen);
        };
    },
};