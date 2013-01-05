//Takes tower and target, does the attack, and returns everything it hit (as an array, or a single object)

//This function grows too slowly!
function damageToTime(damage) {
    damage += 1;
    return (Math.log(Math.log(damage)) / Math.E + 1) / 2;
}

function applyAttack(attackTemplate) {
    var target = attackTemplate.target;
    var attacker = attackTemplate.attacker;
    var damage = attackTemplate.damage;
    var baseAttacker = attackTemplate.baseAttacker;
    
    if(!assertDefined(target, attacker, damage, baseAttacker))
        return;

    if(isNaN(target.attr.currentHp)) {
        fail("darn it! got to figure out how this happens.");
    }

    target.attr.currentHp -= damage;    
    baseAttacker.attr.hitCount++;

    var newAttackType = baseAttacker.attr.attackTypes[attackTemplate.currentAtbox + 1];

    if(newAttackType) {
        var newAttTemplate = cloneObject(attackTemplate); //Clone it just incase it has its own attributes
        newAttTemplate.attackType = newAttackType;
        newAttTemplate.attacker = attackTemplate.target;
        newAttTemplate.currentAtbox++;
        startAttack(newAttTemplate);
    }

    if(target.attr.currentHp <= 0) {
        var game = getGame(target) || getGame(attacker) || getGame(baseAttacker);

        var sound = new Sound("snd/die.wav");
        target.base.destroySelf();

        baseAttacker.attr.kills++;

        if(getRealType(target) != "Tower" && game)
            game.money += target.attr.value;
    }
}

function startAttack(attackTemplate) {
    if(!assertDefined(attackTemplate))
        return;

    if(!assertDefined(attackTemplate.attacker))
        return;
    
    if(attackTemplate.damage < 0)
        return;

    var eng = attackTemplate.attacker.base.rootNode;
    var attackType = attackTemplate.attackType;

    var realAttacker = attackTemplate.baseAttacker;
    var attacker = attackTemplate.attacker;
    var prevTarget = attackTemplate.target;
    if (realAttacker.attr.targetStrategy) {
        attackTemplate.target = realAttacker.attr.targetStrategy.run(attacker, prevTarget);
    } else {
        attackTemplate.target = new targetStrategies.Random().run(attacker, prevTarget);
    }

    if (attackTemplate.target) {
        var attackNode = new attackType.AttackNode(attackTemplate);

        eng.base.addChild(attackNode);
    }
}

function AttackTemplate(attackType, attacker, target, damage, baseAttacker, currentAtbox)
{
    this.attackType = attackType;

    this.attacker = attacker; 
    this.target = target; 
    this.damage = damage; 

    this.baseAttacker = baseAttacker;
    this.currentAtbox = currentAtbox;    
}

//Each glyph should illustrate
//1) charge (user.attackCycle.chargePercent)
//2) damage (user.attr.damage

//Attacks shouldn't modify the attacker's attribute (unless that is really the goal)
//If the attack does partial damage then it should create a copy and pass that on.
var allAttackTypes = {
    //Each charge bar is constant damage, number of rows relates to charge speed (1 row per constant time)
    Laser: function laser() {
        this.damagePercent = 200;
        this.drawGlyph = function (pen, box, user) {
            var baseColor = globalColorPalette.laser;

            var bufferPercent = 0.15;

            box.x += box.w * bufferPercent;
            box.y += box.h * bufferPercent;

            box.w *= (1 - bufferPercent * 2);
            box.h *= (1 - bufferPercent * 2);

            var percentCharge = user.attackCycle.chargePercent;
            var damage = user.attr.damage;

            var damagePerModule = 0.1;

            var damageModules = Math.ceil(damage / damagePerModule);
            var modulesFilled = damage * percentCharge / damagePerModule;

            var timePerRow = 0.5;

            var rows = user.attackCycle.maxCounter / timePerRow;



            var posX = 0;
            var posY = 0;
            var width = rows / damageModules;
            var height = 1 / rows;



            var widthBuffer = 0.2;
            var heightBuffer = 0.1;

            while(damageModules > 0) {
                function drawPart(color) {
                    DRAW.rect(pen, new Rect(
                        posX + width * widthBuffer,
                        posY + height * heightBuffer,
                        width * (1 - widthBuffer * 2),
                        height * (1 - heightBuffer * 2)).project(box), color);
                }

                if(modulesFilled >= 1) {
                    drawPart("blue");
                } else {
                    drawPart("grey");
                }

                posX += width;

                if(posX >= 1) {
                    posX = 0;
                    posY += height;
                }

                modulesFilled--;
                damageModules--;
            }

            //Original glyph code
            /*
             var start = new Vector(box.x + box.w * 0.1, box.y - box.h * 0.2);
             var end = new Vector(box.x + (box.w*0.7), box.y - box.h);

             pen.strokeStyle = baseColor;
             pen.lineWidth = 2;
             ink.line(start.x, start.y, end.x, end.y, pen);

             pen.lineWidth = 0.8;

             var dist = cloneObject(start);
             dist.sub(end);
             dist = dist.mag() * 0.3;

             end = start;

             for(var i = 0; i <= Math.PI * 2; i += Math.PI / 3 * 0.5)
             {
             start = cloneObject(end);

             var delta = new Vector(Math.cos(i) * dist, Math.sin(i) * dist);
             start.add(delta);

             pen.strokeStyle = globalColorPalette.laser;
             pen.lineWidth = 2;
             ink.line(start.x, start.y, end.x, end.y, pen);
             }
             */
        };
        this.AttackNode = function(attackTemplate)
        {
            this.base = new BaseObj(this, 15);         
            this.attackTemplate = attackTemplate;

            var ourStats = attackTemplate.attackType;
            attackTemplate.damage *= ourStats.damagePercent / 100;

            var attacker = attackTemplate.attacker;
            var realAttacker = attackTemplate.baseAttacker;
            var target = attackTemplate.target;
            var damage = attackTemplate.damage;            

            this.color = getRealType(realAttacker) == "Bug" ? "rgba(255,0,0,0)" : globalColorPalette.laser;
            
            //AlphaDecay destroys us
            var line = new SLine(attacker.box.center(), target.box.center(), this.color, 12);        
            this.base.addChild(new AlphaDecay(damageToTime(realAttacker.attr.damage), 1, 0));

            this.base.addChild(line);

            applyAttack(this.attackTemplate);

            this.sound = new Sound("snd/Laser_Shoot.wav");
            this.sound.play();
        
            this.update = function()
            {
                line.color = this.color;
            };
        };
    },
    Bullet: function bullet() {
        this.bulletSpeed = 50;
        this.damagePercent = 300;
        this.drawGlyph = function (pen, box, user) {
            var baseColor = globalColorPalette.laser;

            var percentCharge = user.attackCycle.chargePercent;

            var damage = user.attr.damage;

            var damagePerModule = 0.1;

            var damageModules = Math.ceil(damage / damagePerModule);
            var modulesFilled = damage * percentCharge / damagePerModule;

            //Hexagon fill is:
            //Layer size = layer * 6, layer 0 is 1... but we exclude layer 0 for now
            //So layer number = (width - 1) / 2
            //number = ((layer number) * 6 + 6) / 2 * (layer number)
            //number = ((layer number) + 1) * 3 * (layer number)
            //number/3 = lr^2 + lr
            //x = (-b +- sqrt(b^2 - 4ac))/(2a)
            //x = (sqrt(1 + 4n/3) - 1) / 2... rounded up
            //1, 6, 12, 18
            //So total width is:

            var circleWidths = Math.ceil(Math.sqrt(1 + 4 * damageModules / 3)) + 1;

            //damageModules = 18;

            box.x += box.w * 0.07;
            box.y += box.h * 0.01;

            box.w *= 0.85;
            box.h *= 0.85;

            var width = 1 / circleWidths / 2;
            var height = 1 / circleWidths / 2;
            var posX = 0.5 - width * 1.5;
            var posY = 0.5 - height * 1.5;

            var moveDelta = width * 2;

            var angle = 0;
            var curDist = 0;
            var curMove = 1;

            var angleIncrement = Math.PI / 3;
            var angleChanges = 5.5;

            while(damageModules > 0) {

                function drawPart(color) {
                    DRAW.arcRect(pen, new Rect(posX, posY, width, height).project(box), color);
                }

                drawPart("grey");

                if(modulesFilled >= 1) {
                    drawPart("yellow");
                }

                posX += Math.cos(angle) * moveDelta;
                posY += Math.sin(angle) * moveDelta;

                curDist++;

                if(curDist >= curMove) {
                    curDist = 0;
                    angle += angleIncrement;

                    if(angle > angleIncrement * angleChanges) {
                        angle = 0;
                        curDist = 0;
                        curMove++;

                        posX += Math.cos(angleIncrement * 4) * moveDelta;
                        posY += Math.sin(angleIncrement * 4) * moveDelta;
                    }
                }

                modulesFilled--;
                damageModules--;
            }

            /*
	        pen.lineWidth = 0;
	        pen.fillStyle = "#ffffff";        
            pen.strokeStyle = "transparent";
	        ink.circ(box.x+(box.w*0.35), box.y-(box.w*0.5), box.w*0.4, pen);

    	    pen.strokeStyle = "transparent";
            pen.fillStyle = "orange";
	        ink.circ(box.x+(box.w*0.35), box.y-(box.w*0.5), box.w*0.3, pen);
            */
        };
        this.AttackNode = function(attackTemplate)
        {
            this.base = new BaseObj(this, 15);         
            this.attackTemplate = attackTemplate;

            var ourStats = attackTemplate.attackType;
            attackTemplate.damage *= ourStats.damagePercent / 100;

            var realAttacker = attackTemplate.baseAttacker;
            var attacker = attackTemplate.attacker;
            var target = attackTemplate.target;
            var damage = attackTemplate.damage;            

            this.color = "Orange";

            var bulletSpeed = attackTemplate.attackType.bulletSpeed;

            var dis = attacker.box.center();
            dis.sub(target.box.center());
            dis = Math.sqrt(dis.magSq());

            var us = this;
            function onImpact()
            {
                //A hackish way to check if both still exist
                if(target.base.rootNode == attacker.base.rootNode)
                    applyAttack(attackTemplate);
                us.base.destroySelf();
            }

            var r = 5;
            if(realAttacker.base.type == "Bug")
                r = 2;

            var bullet = new SCircle(attacker.box.center(), r, "White", "Orange", 15);
            var motionDelay = new MotionDelay(attacker.box.center(), target.box.center(),
                                    dis / bulletSpeed, onImpact);
            bullet.base.addChild(motionDelay);

            this.base.addChild(bullet);

            this.sound = new Sound("snd/Laser_Shoot.wav");
            this.sound.play();            

            this.update = function()
            {
                motionDelay.end = target.box.center();
            }
        };
    },
    //Average best case (so enough enemies to fully chain) is:
    // - chance / (chance - 1)
    Chain: function chainLightning() {
        this.chainChance = 80;
        this.repeatDelay = 0.3;
        this.drawGlyph = function (pen, box) {
            var w = box.w;
            var h = box.h;

            var offsetList = 
                [3, 2, -3, 0, 5, 3, -4, 0, 5, 3,
                2, 0,
                -5, -3, 3, 0, -4, -3, 2, 0, -4, -2];

            var start = new Vector(box.x, box.y);
            var end = new Vector(box.x, box.y);

            var scale = 8;

            pen.beginPath();

            pen.fillStyle = globalColorPalette.chainLightning;
            pen.strokeStyle = globalColorPalette.chainLightning;

            pen.moveTo(start.x, start.y);

            for(var i = 0; i < offsetList.length; i += 2)
            {
                start = cloneObject(end);
                end = new Vector(start.x + w * (offsetList[i] / scale), start.y - h * (offsetList[i + 1] / scale));
                pen.strokeStyle = globalColorPalette.chainLightning;
	            pen.lineWidth = 0.5;	            
                pen.lineTo(end.x, end.y);   
                pen.stroke();             
            }             

            pen.closePath();
            pen.fill();

        };
        this.AttackNode = function(attackTemplate)
        {
            this.base = new BaseObj(this, 15);         
            this.attackTemplate = attackTemplate;

            var attacker = attackTemplate.attacker;
            var realAttacker = attackTemplate.baseAttacker;
            var target = attackTemplate.target;
            var damage = attackTemplate.damage;

            this.chainChance = attackTemplate.attackType.chainChance;
            this.repeatDelay = attackTemplate.attackType.repeatDelay;

            this.color = globalColorPalette.chainLightning;
            
            //AlphaDecay destroys us
            var line = new SLine(attacker.box.center(), target.box.center(), this.color, 12);        
            this.base.addChild(new AlphaDecay(this.repeatDelay, 1, 0));

            this.base.addChild(line);

            applyAttack(this.attackTemplate);

            this.sound = new Sound("snd/Laser_Shoot.wav");
            this.sound.play();
        
            this.update = function()
            {
                line.color = this.color;
            };

            this.die = function()
            {
                if(Math.random() < this.chainChance / 100)
                {
                    //This is basically just a custom targeting strategy
                    this.attackTemplate.attacker = this.attackTemplate.target;
                    var attacker = this.attackTemplate.target;
                    var rootAttacker = this.attackTemplate.target;
                    var prevTarget = this.attackTemplate.target;

                    if(!this.attackTemplate.prevList)
                        this.attackTemplate.prevList = [];
                    this.attackTemplate.prevList.push(this.attackTemplate.target);

                    //Make all previous targets hidden so we don't target them again
                    for(var key in this.attackTemplate.prevList)
                        this.attackTemplate.prevList[key].hidden = true;

                    var targetType = prevTarget ? getRealType(prevTarget) : (getRealType(attacker) == "Bug" ? "Tower" : "Bug");
                    var targets = findAllWithin(attacker.base.rootNode, targetType, 
                            attacker.box.center(), rootAttacker.attr.range);

                    for(var key in this.attackTemplate.prevList)
                        this.attackTemplate.prevList[key].hidden = false;

                    if(!targets || !(targets.length > 0)) //Nothing left to chain to!
                        return;

                    var randomPos = Math.floor(Math.random() * targets.length);
                    this.attackTemplate.target = targets[randomPos];


                    var eng = this.attackTemplate.attacker.base.rootNode;
                    //Resurrect ourself
                    eng.base.addChild(new attackTemplate.attackType.AttackNode(this.attackTemplate));
                }
            };
        };
    },
    Pulse: function pulse() {
        this.damagePercent = 30;
        this.effectRange = 50;
        this.chargeTime = 1;
        this.drawGlyph = function (pen, box) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = box.h + "px arial";
            pen.textAlign = 'left';

	        pen.fillStyle = setAlpha(globalColorPalette.pulse, 0.5);
	        pen.strokeStyle = "transparent";
	        ink.circ(box.x+(box.w*0.3), box.y-(box.w*0.5), box.w*0.5, pen);

            pen.fillStyle = setAlpha(globalColorPalette.pulse, 0.5);
	        pen.strokeStyle = "transparent";
	        ink.circ(box.x+(box.w*0.3), box.y-(box.w*0.5), box.w*0.4, pen);

            pen.fillStyle = setAlpha(globalColorPalette.pulse, 0.5);
	        pen.strokeStyle = "transparent";
	        ink.circ(box.x+(box.w*0.3), box.y-(box.w*0.5), box.w*0.2, pen);

            pen.fillStyle = setAlpha(globalColorPalette.pulse, 0.5);
	        pen.strokeStyle = "transparent";
	        ink.circ(box.x+(box.w*0.3), box.y-(box.w*0.5), box.w*0.1, pen);
        };
        this.AttackNode = function(attackTemplate)
        {         
            this.base = new BaseObj(this, 8);
            
            this.attackTemplate = attackTemplate ;

            var ourStats = attackTemplate.attackType;
            attackTemplate.damage *= ourStats.damagePercent / 100;

            var attacker = attackTemplate.attacker;
            var realAttacker = attackTemplate.baseAttacker;
            var target = attackTemplate.target;
            var prevTarget = this.attackTemplate.target;

            var effectRange = attackTemplate.attackType.effectRange;
            var chargeTime = attackTemplate.attackType.chargeTime;

            this.color = getRealType(realAttacker) == "Bug" ? "rgba(255,0,0,0)" : "rgba(0,0,255,0)";

            //AlphaDecay destroys us
            var circle = new SCircle(attacker.box.center(), effectRange, this.color, this.color, 8);
            this.base.addChild(new AttributeTween(0.2, 0.6, chargeTime, "charged", "alpha"));

            this.base.addChild(circle);

            
            this.sound = new Sound("snd/Laser_Shoot.wav");
            this.sound.play();
        
            this.alpha = 0;
            this.update = function()
            {
                circle.color = setAlpha(circle.color, this.alpha);
                circle.fillColor = setAlpha(circle.color, this.alpha);
            };
            
            this.charged = function()
            {
                this.base.addChild(new SimpleCallback(0.1, "fire"));
                circle.color = "rgba(255,255,255,0.6)";
            };

            this.fire = function()
            {
                attackTemplate = this.attackTemplate;

                var attacker = attackTemplate.attacker;
                var realAttacker = attackTemplate.baseAttacker;
                var target = attackTemplate.target;
                attackTemplate.damage *= attackTemplate.attackType.damagePercent / 100;
                var prevTarget = this.attackTemplate.target;
                
                var chargeTime = attackTemplate.attackType.chargeTime;
                //We do our own targeting (we hit everything around the attacker)
                            
                //This is basically just a custom targeting strategy
                var targetType = prevTarget ? getRealType(prevTarget) : (getRealType(attacker) == "Bug" ? "Tower" : "Bug");
                var targets = findAllWithin(attacker.base.rootNode, targetType, 
                        attacker.box.center(), effectRange);

                this.targets = targets;

                for(var key in this.targets)
                {
                    this.attackTemplate.target = this.targets[key];
                    applyAttack(this.attackTemplate);
                }
                this.base.destroySelf();
            };
        };
    },
    //Average is (basically its a best case chain):
    // - chance / (chance - 1)
    DOT: function poison() {
        this.repeatChance = 80;
        this.repeatDelay = 0.3;
        this.damagePercent = 30;
        this.drawGlyph = function (pen, box) {

            var circlePos = [0.2, 0.25, 0.1, 
                            0.5, 0.1, 0.1, 
                            0.8, 0.25, 0.1,
                            0.2, 0.65, 0.1,
                            0.5, 0.5, 0.1,
                            0.8, 0.65, 0.1,
                            0.5, 0.85, 0.1];

            for(var i = 0; i < circlePos.length; i += 3)
            {
                pen.strokeStyle = globalColorPalette.poison;
                pen.fillStyle = globalColorPalette.poison;
	            pen.lineWidth = 1;
                ink.circ(box.x+(box.w*circlePos[i]), box.y-(box.w*circlePos[i + 1]), 
                    box.w * circlePos[i + 2], pen);
            }
            
            
            //ink.text(box.x, box.y, "PO", pen);
        };
        this.AttackNode = function(attackTemplate)
        {
            this.base = new BaseObj(this, 15);         
            this.attackTemplate = attackTemplate;

            var ourStats = attackTemplate.attackType;
            attackTemplate.damage *= ourStats.damagePercent / 100;

            var attacker = attackTemplate.attacker;
            var realAttacker = attackTemplate.baseAttacker;
            var target = attackTemplate.target;
            var damage = attackTemplate.damage;

            this.repeatChance = attackTemplate.attackType.repeatChance;
            this.repeatDelay = attackTemplate.attackType.repeatDelay;

            this.color = globalColorPalette.poison;
            
            //AlphaDecay destroys us
            var line = new SLine(attacker.box.center(), target.box.center(), this.color, 12);
            this.base.addChild(new AttributeTween(1, 0, this.repeatDelay, "tick", "alpha"));

            this.base.addChild(line);
            
            var poisonIndicator = new SCircle(target.box.center(), 8, this.color, this.color, 14);
            this.base.addChild(poisonIndicator);            
      
            this.alpha = 0;
            this.poisonAlpha = 0;
            this.update = function()
            {
                line.color = setAlpha(line.color, this.alpha);
                poisonIndicator.color = setAlpha(poisonIndicator.color, this.poisonAlpha);
                poisonIndicator.fillColor = setAlpha(poisonIndicator.fillColor, this.alpha);
                poisonIndicator.box.x = target.box.center().x;
                poisonIndicator.box.y = target.box.center().y;
            };

            this.nothing = function(){}

            this.tick = function()
            {
                var eng = this.base.rootNode;

                if(target.base.rootNode == eng &&
                    Math.random() < this.repeatChance / 100)
                {                    
                    this.base.addChild(new AttributeTween(1, 0, this.repeatDelay * 0.5, "nothing", "poisonAlpha"));
                    this.base.addChild(new SimpleCallback(this.repeatDelay, "tick"));

                    applyAttack(this.attackTemplate);
                }
                else
                {
                    this.base.destroySelf();
                }
            };
        };
    },
    Slow: function slow() {
        this.slowPercent = 50;
        this.slowTime = 2.5;
        this.drawGlyph = function (pen, box) {
            var w = box.w;
            var h = box.h;

            var offsetList = 
                [5, -20, 5, 20,   
                10, -50, 10, 30,
                5, -50, 7, 50,
                5, -90, 7, 100,
                5, -50, 7, 50,
                7, -50, 7, 30,
                10, -50, 10, 30,
                10, 60, -110, 0
                ];

            var start = new Vector(box.x - w * 0.1, box.y - w);
            var end = new Vector(box.x - w * 0.1, box.y - w);

            var scale = 100;

            pen.beginPath();

            pen.fillStyle = globalColorPalette.slow;
            pen.strokeStyle = "rgba(255, 255, 255, 1)";

            pen.moveTo(start.x, start.y);

            for(var i = 0; i < offsetList.length; i += 2)
            {
                start = cloneObject(end);
                end = new Vector(start.x + w * (offsetList[i] / scale), start.y - h * (offsetList[i + 1] / scale));
                pen.strokeStyle = globalColorPalette.chainLightning;
	            pen.lineWidth = 0.5;	            
                pen.lineTo(end.x, end.y);   
                pen.stroke();             
            }             

            pen.closePath();
            pen.fill();
        };
        this.AttackNode = function(attackTemplate)
        {
            this.base = new BaseObj(this, 15);         
            this.attackTemplate = attackTemplate;

            var attacker = attackTemplate.attacker;
            var realAttacker = attackTemplate.baseAttacker;
            var target = attackTemplate.target;
            var damage = attackTemplate.damage;

            var slow = attackTemplate.attackType.slowPercent / 100;
            var slowTime = attackTemplate.attackType.slowTime;

            this.color = globalColorPalette.slow;

            var line = new SLine(attacker.box.center(), target.box.center(), this.color, 12);        
            line.base.addChild(new AlphaDecay(slowTime, 1, 0));
            this.base.addChild(line);            
            
            var slow = new SlowEffect(slow);
            slow.base.addChild(new Lifetime(slowTime));

            target.base.addChild(slow);

            applyAttack(this.attackTemplate);

            this.update = function()
            {
                line.end = target.box.center();
            };
        };
    },
};

var towerAttackTypes = {
    Laser: allAttackTypes.Laser,
    Bullet: allAttackTypes.Bullet,
    Chain: allAttackTypes.Chain,
    Pulse: allAttackTypes.Pulse,
    DOT: allAttackTypes.DOT,
    Slow: allAttackTypes.Slow
}

//Not needed anymore... but if you have a radio option for something this
//is how you would set up the underlying attack types for it
var bugAttackTypes = {
    BugBullet: allAttackTypes.Bullet
};


function drawAttributes(user, pen) {
    if(user.lineWidth) {
        user.box.x += user.lineWidth;
        user.box.y += user.lineWidth;
        user.box.w -= Math.ceil(user.lineWidth * 2);
        user.box.h -= Math.ceil(user.lineWidth * 2);
    }

    makeTiled(pen,
        function (obj, pen, pos) {
            if (typeof obj == "number")
                return false;
            if(!obj.drawGlyph)
                fail("not good");            

            obj.drawGlyph(pen, pos, user);
            return true;
        },
        user.attr,
        user.box.clone(),
        2, 2,
        0.01);

    makeTiled(pen,
        function (obj, pen, pos) {
            if (typeof obj == "number")
                return false;

            pen.beginPath();

            pen.strokeStyle = "rgba(255, 255, 255, 0.5)";
            pen.fillStyle = "transparent";

            pen.lineWidth = 1;
            ink.rect(pos.x, pos.y, pos.w, pos.h, pen);

            pen.closePath();

            return true;
        },
        user.attr,
        user.box.clone(),
        2, 2,
        0.01);

    if(user.lineWidth) {
        user.box.x -= user.lineWidth;
        user.box.y -= user.lineWidth;
        user.box.w += Math.ceil(user.lineWidth * 2);
        user.box.h += Math.ceil(user.lineWidth * 2);
    }
}
