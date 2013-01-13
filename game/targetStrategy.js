var targetStrategies = {
    Closest: function Closest () {
        //this.extra_Range = 0; //Just to demonstrate what is possible, will be removed later
        this.run = function (attacker, prevTarget) {
            //Just trust me
            var targetType = prevTarget ? getRealType(prevTarget) : (getRealType(attacker) == "Bug" ? "Tower" : "Bug");

            if (prevTarget) {
                prevTarget.hidden = true;
            }
            
            var target = findClosestToPoint(attacker.base.rootNode, targetType, attacker.tpos.center(), attacker.attr.range);
            
            if (prevTarget) {
                prevTarget.hidden = false;
            }

            return target;
        };
        this.drawGlyph = function (pen, box) {
	        var color = "grey";

            box.x += box.w * 0.4;
            box.y += box.h * 0.7;

            box.w *= 0.6;
            box.h *= 0.8;

            var circlePos = [-0.1, 0.5, 0.2];

            pen.beginPath();

            for (var i = 0; i < circlePos.length; i += 3) {
                pen.strokeStyle = "black";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.circ(box.x + (box.w * circlePos[i]), box.y - (box.w * circlePos[i + 1]), box.w * circlePos[i + 2], pen);
            }


            var recbox = [0.2, 0.75, 0.5];

            for (var i = 0; i < recbox.length; i += 3) {
                pen.strokeStyle = "white";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.rect(box.x + (box.w * recbox[i]), box.y - (box.w * recbox[i + 1]), box.w * recbox[i + 2], box.w * recbox[i + 2], pen);
            }

        };
    },
    Random: function Random () {
        this.run = function (attacker, prevTarget) {
            //Just trust me
            var targetType = prevTarget ? getRealType(prevTarget) : (getRealType(attacker) == "Bug" ? "Tower" : "Bug");

            if (prevTarget) {
                prevTarget.hidden = true;
            }

            var targets = findAllWithin(attacker.base.rootNode, targetType, 
                            attacker.tpos.center(), attacker.attr.range);
        
            if (prevTarget) {
                prevTarget.hidden = false;
            }

            if (!targets || !(targets.length > 0)) {
                return;
            }

            var randomPos = Math.floor(Math.random() * targets.length);

            return targets[randomPos];        
        };
        this.drawGlyph = function(pen, box) {
            var color = "grey";

            pen.beginPath();

            var circlePos = [0.0, 0.4, 0.1,
                             0.6, 0.7, 0.1,
                             0.0, 0.8, 0.1,];

            for (var i = 0; i < circlePos.length; i += 3) {
                pen.strokeStyle = "black";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.circ(box.x + (box.w * circlePos[i]), box.y - (box.w * circlePos[i + 1]), box.w * circlePos[i + 2], pen);
            }


            var recbox = [0.2, 0.80, 0.3];

            for(var i = 0; i < recbox.length; i += 3) {
                pen.strokeStyle = "white";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.rect(box.x + (box.w * recbox[i]), box.y - (box.w * recbox[i + 1]), box.w * recbox[i + 2], box.w * recbox[i + 2], pen);
            }
        };
    },
    Farthest: function farthestOnPath () {
        this.run = function (attacker, prevTarget) {
            //Just trust me
            var targetType = prevTarget ? getRealType(prevTarget) : (getRealType(attacker) == "Bug" ? "Tower" : "Bug");
            var targetLoc = prevTarget ? getRealType(prevTarget) : (getRealType(attacker) == "Path" ? "Tower" : "Path");

            var targets = findAllWithin(attacker.base.rootNode, targetLoc, attacker.tpos.center(), attacker.attr.range);
                            
            //Now sort targets by pathPos
            var pathObjs = []
            for (var key in targets) {
                var obj = {};
                obj.pathPos = targets[key].pathPos;
                obj.path = targets[key];
                pathObjs.push(obj);
            }

            pathObjs.sort(function(a,b){return a.pathPos && b.pathPos ? b.pathPos - a.pathPos : 0});

            for (var key in pathObjs) {
                var curPath = pathObjs[key].path;
                
                var targebox = curPath.tpos;

                if (curPath.nextPath) {
                    targebox = curPath.nextPath.tpos;
                }

                var targets = findAllWithin(attacker.base.rootNode, targetType, curPath.tpos.center(), curPath.tpos.w / 2);

                if (!targets || !(targets.length > 0)) {
                    continue;
                }

                targets.sort(function (a,b) {
                    return vecToRect(targebox, a.tpos).magSq() - vecToRect(targebox, b.tpos).magSq();
                });

                return targets[0];
            }
        };
        this.drawGlyph = function (pen, box) {
            var color = "grey";

            var circlePos = [0.7, 0.9, 0.1];

            pen.beginPath();

            for (var i = 0; i < circlePos.length; i += 3) {
                pen.strokeStyle = "black";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.circ(box.x + (box.w * circlePos[i]), box.y - (box.w * circlePos[i + 1]), box.w * circlePos[i + 2], pen);
            }

            var recbox = [-0.3, 0.3, 0.3];

            for (var i = 0; i < recbox.length; i += 3) {
                pen.strokeStyle = "white";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.rect(box.x + (box.w * recbox[i]), box.y - (box.w * recbox[i + 1]), box.w * recbox[i + 2], box.w * recbox[i + 2], pen);
            }
        };
    },

};