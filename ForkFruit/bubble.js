goog.provide('ForkFruit.Bubble');

goog.require('lime.Sprite');

ForkFruit.Bubble = function(value) {
    lime.Sprite.call(this);

    this.value = ForkFruit.Bubble.setValue_(value);
	this.title = ForkFruit.Bubble.titles[value];
	this.isFruit = ForkFruit.Bubble.isFruit_(value);
    this.circle = new lime.Sprite().setFill('assets/'+value+'.gif').setSize(70, 70);
    this.appendChild(this.circle);

    /*this.lbl = new lime.Label().setFontSize(34).setFontColor('#fff').setFontWeight(700).setFontFamily('Impact');
    this.appendChild(this.lbl);*/

    this.GRAVITY = 2.5;

    this.setAnchorPoint(0, 0);
    this.setScale(1.2);

    //this.setRenderer(lime.Renderer.CANVAS);

    this.v = new goog.math.Vec2(0, this.GRAVITY);

	
};
goog.inherits(ForkFruit.Bubble, lime.Sprite);
ForkFruit.Bubble.titles = {
	0:"Water-drop is not fruit ",
	1:'Apple',
	2:'Butterfly is not fruit',
	3:'Apple',
	4:'Branch',
	5:'Pudding is not fruit',
	6:'Pear',
	7:'Bread is not fruit',
	8:'Egg is not fruit',
	9:'You should not hurt kit.Game Over',
	10:'Water-drop is not fruit'
	
	
	
}
ForkFruit.Bubble.setValue_ = function(value) {
		if(value == 1 || value == 3|| value == 6) {
			return 1;
		} else if (value == 9) {
			return -500;
		}else {
			return -1;
		}
}
ForkFruit.Bubble.isFruit_ = function(value) {
		
		return value == 1 || value == 3|| value == 6;
}
ForkFruit.Bubble.random = function() {
    var value = Math.ceil(Math.random() * 10);
    return new ForkFruit.Bubble(value);
};


ForkFruit.Bubble.prototype.updateFloatingSpeed = function() {

    this.v.add(new goog.math.Vec2((Math.random() * 2 - 1) * .6, Math.random() * .1));

    var delta = this.v.clone().scale(ForkFruit.BUBBLE_SPEED);

    this.move = new lime.animation.MoveBy(delta.x, delta.y).setDuration(20).enableOptimizations().setEasing(lime.animation.Easing.LINEAR);
    this.runAction(this.move);
};
