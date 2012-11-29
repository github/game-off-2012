//Takes tower and target, does the attack, and returns everything it hit (as an array, or a single object)

//This function grows too slowly!
function damageToTime(damage) {
    damage += 1;
    return (Math.log(Math.log(damage)) / Math.E + 1) / 2;
}

//Should really make attacks have delay between
//attack trigger and damage time (impact).

//Normal
//Aoe
//Slow
//Arcing (delay arcs also)
//DOT

function applyAttack(attackTemplate) {
    var target = attackTemplate.target;
    var attacker = attackTemplate.attacker;
    var damage = attackTemplate.damage;
    var baseAttacker = attackTemplate.baseAttacker;

    if(!assertDefined(target, attacker, damage, baseAttacker))
        return;

    target.attr.hp -= damage;    
    baseAttacker.attr.hitcount++;

    var newAttackType = baseAttacker.attr.attack_types[attackTemplate.currentAttPos + 1];

    if(newAttackType)
    {
        attackTemplate.attackType = newAttackType;
        attackTemplate.attacker = attackTemplate.target;
        attackTemplate.currentAttPos++;
        startAttack(attackTemplate);
    }

    if(target.attr.hp < 0)
    {
        var sound = new Sound("snd/die.wav");
        target.base.destroySelf();

        if(getRealType(target) != "Tower")
            attacker.base.rootNode.money += target.attr.value;
    }
}

function startAttack(attackTemplate) {
    if(!assertDefined(attackTemplate))
        return;

    if(!assertDefined(attackTemplate.attacker))
        return;

    var eng = attackTemplate.attacker.base.rootNode;
    var attackType = attackTemplate.attackType;

    var realAttacker = attackTemplate.baseAttacker;
    var attacker = attackTemplate.attacker;
    var prevTarget = attackTemplate.target;
    attackTemplate.target = realAttacker.attr.target_Strategy.run(attacker, prevTarget);

    if(attackTemplate.target)
    {
        var attackNode = new attackType.AttackNode(attackTemplate);

        eng.base.addObject(attackNode);
    }
}

function AttackTemplate(attackType, attacker, target, damage, baseAttacker, currentAttPos)
{
    this.attackType = attackType;

    this.attacker = attacker; 
    this.target = target; 
    this.damage = damage; 

    this.baseAttacker = baseAttacker;
    this.currentAttPos = currentAttPos;    
}

//Attacks shouldn't modify the attacker's attribute (unless that is really the goal)
//If the attack does partial damage then it should create a copy and pass that on.
var allAttackTypes = {
    Laser: function laser() {
        this.drawGlyph = function (pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "N", pen);
        };
        this.AttackNode = function(attackTemplate)
        {
            this.base = new baseObj(this, 15);         
            this.attackTemplate = attackTemplate;

            var attacker = attackTemplate.attacker;
            var realAttacker = attackTemplate.baseAttacker;
            var target = attackTemplate.target;
            var damage = attackTemplate.damage;

            this.color = getRealType(realAttacker) == "Bug" ? "rgba(255,0,0,0)" : "rgba(0,0,255,0)";
            
            //AlphaDecay destroys us
            var line = new Line(attacker.tPos.getCenter(), target.tPos.getCenter(), this.color, 12);        
            this.base.addObject(new AlphaDecay(damageToTime(realAttacker.attr.damage), 1, 0));

            this.base.addObject(line);

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
        this.bullet_speed = 50;
        this.drawGlyph = function (pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "B", pen);
        };
        this.AttackNode = function(attackTemplate)
        {
            this.base = new baseObj(this, 15);         
            this.attackTemplate = attackTemplate;

            var realAttacker = attackTemplate.baseAttacker;
            var attacker = attackTemplate.attacker;
            var target = attackTemplate.target;
            var damage = attackTemplate.damage;            

            this.color = "Orange";

            var bulletSpeed = attackTemplate.attackType.bullet_speed;

            var dis = attacker.tPos.getCenter();
            dis.sub(target.tPos.getCenter());
            dis = Math.sqrt(dis.magSq());

            var us = this;
            function onImpact()
            {
                //A hackish way to check if both still exist
                if(target.base.rootNode == attacker.base.rootNode)
                    applyAttack(attackTemplate);
                us.base.destroySelf();
            }

            var bullet = new Circle(attacker.tPos.getCenter(), 5, "White", "Orange", 15);
            var motionDelay = new MotionDelay(attacker.tPos.getCenter(), target.tPos.getCenter(),
                                    dis / bulletSpeed, onImpact);
            bullet.base.addObject(motionDelay);

            this.base.addObject(bullet);

            this.sound = new Sound("snd/Laser_Shoot.wav");
            this.sound.play();            

            this.update = function()
            {
                motionDelay.end = target.tPos.getCenter();
            }
        };
    },
    Chain: function chain_lightning() {
        this.chain_chance = 0.5;
        this.repeat_delay = 0.1;
        this.drawGlyph = function (pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "CL", pen);
        };
        this.AttackNode = function(attackTemplate)
        {
            this.base = new baseObj(this, 15);         
            this.attackTemplate = attackTemplate;

            var attacker = attackTemplate.attacker;
            var realAttacker = attackTemplate.baseAttacker;
            var target = attackTemplate.target;
            var damage = attackTemplate.damage;

            this.chain_chance = attackTemplate.attackType.chain_chance;
            this.repeat_delay = attackTemplate.attackType.repeat_delay;

            this.color = getRealType(realAttacker) == "Bug" ? "rgba(255,0,0,0)" : "rgba(0,0,255,0)";
            
            //AlphaDecay destroys us
            var line = new Line(attacker.tPos.getCenter(), target.tPos.getCenter(), this.color, 12);        
            this.base.addObject(new AlphaDecay(this.repeat_delay, 1, 0));

            this.base.addObject(line);

            applyAttack(this.attackTemplate);

            this.sound = new Sound("snd/Laser_Shoot.wav");
            this.sound.play();
        
            this.update = function()
            {
                line.color = this.color;
            };

            this.die = function()
            {
                if(Math.random() < this.chain_chance)
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
                            attacker.tPos.getCenter(), attacker.attr.range);

                    for(var key in this.attackTemplate.prevList)
                        this.attackTemplate.prevList[key].hidden = false;

                    if(!targets || !(targets.length > 0)) //Nothing left to chain to!
                        return;

                    var randomPos = Math.floor(Math.random() * targets.length);
                    this.attackTemplate.target = targets[randomPos];


                    var eng = this.attackTemplate.attacker.base.rootNode;
                    //Resurrect ourself
                    eng.base.addObject(new attackTemplate.attackType.AttackNode(this.attackTemplate));
                }
            };
        };
    },
    /*
    Aoe: function area_of_effect() {
        this.radius = 15;
        this.percent_damage = 1;
        this.run = function (tower, target) {
            var targets = findAllWithin(tower.base.rootNode, "Bug", target.tPos.getCenter(), this.radius);

            var hit = [];

            var damage = tower.attr.damage;

            for (var key in targets) {
                applyDamage(targets[key], tower, damage);
                hit.push(targets[key]);
            }

            var aoeCircle = new Circle(
                    target.tPos.getCenter(),
                    this.radius,
                    "rgba(255,255,255,0)",
                    "rgba(0,255,0,255)",
                    12);

            var line = new Line(tower.tPos.getCenter(), target.tPos.getCenter(), "rgba(0,255,0,255)", 13);

            aoeCircle.base.addObject(new AlphaDecayPointer(1, 0.2, 0, new Pointer(aoeCircle, "color")));
            aoeCircle.base.addObject(new AlphaDecayPointer(1, 0.5, 0, new Pointer(aoeCircle, "fillColor")));

            line.base.addObject(new AlphaDecay(1, 1, 0));

            tower.base.addObject(aoeCircle);
            tower.base.addObject(line);

            return hit; //Can probably just return targets...
        },
        this.draw = function (pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "A", pen);
        },
        this.applyAttrMods = function(attr) {
            attr.damage *= this.percent_damage / 100
        }
    },
    Slow: function slow() {        
        this.percent_slow = 50;
        this.duration = 2;
        this.run = function (tower, target) {
            var slowEffect = new SlowEffect(this.percent_slow / 100);
            slowEffect.base.addObject(new Lifetime(this.duration));

            target.base.addObject(slowEffect);

            var line = new Line(tower.tPos.getCenter(), target.tPos.getCenter(), "rgba(10,50,250,255)", 13);
            line.base.addObject(new AlphaDecay(1, 1, 0));
            tower.base.addObject(line);

            return target;
        },
        this.draw = function (pen, tPos) {
            //Draw text
            pen.fillStyle = "#000000";
            pen.font = tPos.h + "px arial";
            pen.textAlign = 'left';

            ink.text(tPos.x, tPos.y, "S", pen);
        }
    },
    */
};

//Not needed anymore... but if you have a radio option for something this
//is how you would set up the underlying attack types for it
var bugAttackTypes = {
    Laser: allAttackTypes.Laser
};


function drawAttributes(user, pen) {
    makeTiled(pen,
        function (obj, pen, pos) {
            if (typeof obj == "number")
                return false;
            if(!obj.drawGlyph)
                fail("not good");
            obj.drawGlyph(pen, pos);
            return true;
        },
        user.attr,
        new temporalPos(
            user.tPos.x + user.tPos.w * 0.15,
            user.tPos.y + user.tPos.h * 0.4,
            user.tPos.w * 0.85,
            user.tPos.h * 0.6),
        2, 2,
        0.1);
}