var targetStrategies = {
    Closest: function Closest () {
        //this.extra_Range = 0; //Just to demonstrate what is possible, will be removed later
        this.run = function (attacker, prevTarget) {
            //Just trust me
            var targetType = prevTarget ? getRealType(prevTarget) : (getRealType(attacker) == "Bug" ? "Tower" : "Bug");

            if(prevTarget)
                prevTarget.hidden = true;
            
            var target = findClosestToPoint(attacker.base.rootNode, targetType,
                                attacker.tPos.getCenter(), attacker.attr.range);
            
            if(prevTarget)
                prevTarget.hidden = false;

            return target;
        },
        this.drawGlyph = function(pen, tPos) {
	        var color = "grey";

            tPos.x += tPos.w * 0.4;
            tPos.y += tPos.h * 0.7;

            tPos.w *= 0.6;
            tPos.h *= 0.8;

            var circlePos = [-0.1, 0.5, 0.2];

            pen.beginPath();

            for(var i = 0; i < circlePos.length; i += 3)
            {
                pen.strokeStyle = "black";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.circ(tPos.x+(tPos.w*circlePos[i]), tPos.y-(tPos.w*circlePos[i + 1]), 
                    tPos.w * circlePos[i + 2], pen);
            }


            var rectPos = [0.2, 0.75, 0.5];

            for(var i = 0; i < rectPos.length; i += 3)
            {
                pen.strokeStyle = "white";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.rect(tPos.x+(tPos.w*rectPos[i]), tPos.y-(tPos.w*rectPos[i + 1]), 
                    tPos.w * rectPos[i + 2], tPos.w * rectPos[i + 2], pen);
            }

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

            if(!targets || !(targets.length > 0))
                return;

            var randomPos = Math.floor(Math.random() * targets.length);

            return targets[randomPos];        
        },
        this.drawGlyph = function(pen, tPos) {
            var color = "grey";

            pen.beginPath();

            var circlePos = [0.0, 0.4, 0.1,
                             0.6, 0.7, 0.1,
                             0.0, 0.8, 0.1,];

            for(var i = 0; i < circlePos.length; i += 3)
            {
                pen.strokeStyle = "black";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.circ(tPos.x+(tPos.w*circlePos[i]), tPos.y-(tPos.w*circlePos[i + 1]), 
                    tPos.w * circlePos[i + 2], pen);
            }


            var rectPos = [0.2, 0.80, 0.3];

            for(var i = 0; i < rectPos.length; i += 3)
            {
                pen.strokeStyle = "white";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.rect(tPos.x+(tPos.w*rectPos[i]), tPos.y-(tPos.w*rectPos[i + 1]), 
                    tPos.w * rectPos[i + 2], tPos.w * rectPos[i + 2], pen);
            }
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
            var color = "grey";

            var circlePos = [0.7, 0.9, 0.1];

            pen.beginPath();

            for(var i = 0; i < circlePos.length; i += 3)
            {
                pen.strokeStyle = "black";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.circ(tPos.x+(tPos.w*circlePos[i]), tPos.y-(tPos.w*circlePos[i + 1]), 
                    tPos.w * circlePos[i + 2], pen);
            }


            var rectPos = [-0.3, 0.3, 0.3];

            for(var i = 0; i < rectPos.length; i += 3)
            {
                pen.strokeStyle = "white";
                pen.fillStyle = color;
	            pen.lineWidth = 1;
                ink.rect(tPos.x+(tPos.w*rectPos[i]), tPos.y-(tPos.w*rectPos[i + 1]), 
                    tPos.w * rectPos[i + 2], tPos.w * rectPos[i + 2], pen);
            }
        };
    },
};