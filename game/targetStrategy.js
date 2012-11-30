var targetStrategies = {
    Closest: function Closest () {
        //this.extra_Range = 0; //Just to demonstrate what is possible, will be removed later
        this.run = function (attacker, prevTarget) {
            //Just trust me
            var targetType = prevTarget ? getRealType(prevTarget) : (getRealType(attacker) == "Bug" ? "Tower" : "Bug");

            if(prevTarget)
                prevTarget.hidden = true;
            
            var target = findClosest(attacker.base.rootNode, targetType,
                                attacker.tPos.getCenter(), attacker.attr.range);
            
            if(prevTarget)
                prevTarget.hidden = false;

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
        this.run = function (attacker, prevTarget) {
            //Just trust me
            var targetType = prevTarget ? getRealType(prevTarget) : (getRealType(attacker) == "Bug" ? "Tower" : "Bug");

            if(prevTarget)
                prevTarget.hidden = true;

            var targets = findAllWithin(attacker.base.rootNode, targetType, 
                            attacker.tPos.getCenter(), attacker.attr.range);
        
            if(prevTarget)
                prevTarget.hidden = false;

            if(!(targets.length > 0))
                return;

            var randomPos = Math.floor(Math.random() * targets.length);

            return targets[randomPos];        
        },
        this.drawGlyph = function(pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "R", pen);
        };
    },
    Farthest: function farthestOnPath () {
        this.run = function (attacker, prevTarget) {
            //Just trust me
            var targetType = prevTarget ? getRealType(prevTarget) : (getRealType(attacker) == "Bug" ? "Tower" : "Bug");
            var targetLoc = prevTarget ? getRealType(prevTarget) : (getRealType(attacker) == "Path" ? "Tower" : "Path");

            var targets = findAllWithin(attacker.base.rootNode, targetLoc, 
                            attacker.tPos.getCenter(), attacker.attr.range);
                            
            //Now sort targets by pathPos
            var pathObjs = []
            for(var key in targets)
            {
                var obj = {};
                obj.pathPos = targets[key].pathPos;
                obj.path = targets[key];
                pathObjs.push(obj);
            }

            pathObjs.sort(function(a,b){return a.pathPos && b.pathPos ? b.pathPos - a.pathPos : 0});

            for(var key in pathObjs)
            {
                var curPath = pathObjs[key].path;
                
                var targetPos = curPath.tPos;

                if(curPath.nextPath)
                    targetPos = curPath.nextPath.tPos;

                var targets = findAllWithin(attacker.base.rootNode, targetType,
                            curPath.tPos.getCenter(), curPath.tPos.w / 2);

                if(!targets || !(targets.length > 0))
                    continue;

                targets.sort(function(a,b){return vecToRect(targetPos, a.tPos).magSq() - vecToRect(targetPos, b.tPos).magSq();});                

                return targets[0];
            }
        },
        this.drawGlyph = function(pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "R", pen);
        };
    },
};