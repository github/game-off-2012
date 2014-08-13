goog.provide('ForkFruit.Game');

goog.require('lime.GlossyButton');
goog.require('lime.Layer');
goog.require('lime.Scene');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.ScaleBy');
goog.require('lime.animation.Spawn');
goog.require('ForkFruit.Bubble');
goog.require('ForkFruit.Button');
goog.require('ForkFruit.Progress');
goog.require('ForkFruit.dialogs');
goog.require('lime.CanvasContext');

/**
 * @constructor
 * @extends lime.Scene
 */
ForkFruit.Game = function(level) {
    lime.Scene.call(this);

    this.WIDTH = 600;
    //this.RANGE = 7; //defines number of steps between loss-neutral-win
    this.LIFE = .9;
    this.MAX = .15;


    this.level = level;
    //this.magic = 6 + Math.round(((level - 1) / 20) * (15 - 6));
    ForkFruit.RELOAD_TIME = 6800 - level * 120;
    ForkFruit.BUBBLE_SPEED = 75 + this.level * 1.4;


    this.mask = new lime.Sprite().setFill(new lime.fill.LinearGradient().addColorStop(0, 0, 0, 0, 0).addColorStop(.95, 0, 0, 0, .9).addColorStop(1, 1, 1, 0, .0)).setSize(768, 760).setAnchorPoint(0, 0).setPosition(0, 130);
    this.appendChild(this.mask);

    this.mask = new lime.Sprite().setSize(768, 760).setAnchorPoint(0, 0).setPosition(0, 130);
    this.appendChild(this.mask);


    this.layer = new lime.Layer();
    //if(ForkFruit.isBrokenChrome()) this.layer.setRenderer(lime.Renderer.CANVAS);
    this.appendChild(this.layer);
    this.layer.setMask(this.mask);
    this.layer.setOpacity(.5);

    this.bubbles = [];
    this.addBubbles(1);

    //lime.scheduleManager.scheduleWithDelay(this.reload, this, ForkFruit.RELOAD_TIME);
    lime.scheduleManager.scheduleWithDelay(this.checkDeletions, this, 200);
	lime.scheduleManager.callAfter(this.reload, this,  ForkFruit.RELOAD_TIME);
	//setTimeout(this.reload,ForkFruit.RELOAD_TIME);
    this.progress = new ForkFruit.Progress().setProgress(.5).setPosition(20, 50);
    this.appendChild(this.progress);


    this.points = 25;
    this.addPoints(0);

    this.cover = new lime.Layer().setPosition(ForkFruit.director.getSize().width / 2, 0);
    this.appendChild(this.cover);

    /*var btn = new ForkFruit.Button('Back to menu').setSize(270, 70).setPosition(150, 945);
    this.appendChild(btn);
    goog.events.listen(btn, 'click', function() {ForkFruit.loadMenuScene(lime.transitions.MoveInUp);});
	*/
    //this.startup();
    this.start();
    //only needed to use pointInPath() function. no actual drawing.
    var canvas = goog.dom.createDom('canvas');
    this.ctx = canvas.getContext('2d');
    
	//lime logo
	//ForkFruit.builtWithLime(this);
};
goog.inherits(ForkFruit.Game, lime.Scene);


ForkFruit.Game.prototype.addBubbles = function(count,x,y,opt_offset) {
    var offset = opt_offset || 50;
	if(this.bubbles.length > 20) {
		return;
	}
    for (var i = 0; i < count; i++) {
        var b = ForkFruit.Bubble.random();
        //b.setPosition(Math.random() * this.WIDTH + 100, offset - Math.random() * 100);
		if(x && i==0) {
			x+=offset;
		}else if(x && i==1){
			x -= offset;
		}
		var dx = x ||(Math.random() * this.WIDTH + 100),
		dy=y||100;
		b.setPosition(dx, dy);
        this.layer.appendChild(b);
        this.bubbles.push(b);
		
    }
    lime.scheduleManager.callAfter(this.updateFloaters, this, 100);
};

ForkFruit.Game.prototype.reload = function(dt) {
   this.changeSpeed();
   lime.scheduleManager.callAfter(this.reload2, this,  ForkFruit.RELOAD_TIME);
   //setTimeout(this.reload,ForkFruit.RELOAD_TIME);
};
ForkFruit.Game.prototype.changeSpeed = function() {
   if(ForkFruit.BUBBLE_SPEED < 2000) {
		ForkFruit.BUBBLE_SPEED +=20;
   }
   if(ForkFruit.RELOAD_TIME > 600) {
		ForkFruit.RELOAD_TIME -= 200;
   }
   console.log(this.bubbles.length);
   
   var num = Math.random() * 3 + 1;
   this.addBubbles(num);
   
}
ForkFruit.Game.prototype.reload2 = function(dt) {
   this.changeSpeed();
   lime.scheduleManager.callAfter(this.reload, this,  ForkFruit.RELOAD_TIME);
   //setTimeout(this.reload,ForkFruit.RELOAD_TIME);
};
ForkFruit.Game.prototype.addPoints = function(p) {
    this.points += p;
    if (this.points < 0) this.points = 0;
    var progress = this.points / 50;
    if (progress > 1) progress = 1;
    this.progress.setProgress(progress);
    //this.lblScore.setText(this.points+'_#'+this.magic+'_L'+this.level);
    if (progress <= 0 || progress >= 1) {
        this.showEndDialog();
    }
};

ForkFruit.Game.prototype.start = function() {
    this.touches = [];

    //this.layer.runAction(new lime.animation.FadeTo(1));
    
    this.graphics = new lime.CanvasContext().setSize(ForkFruit.director.getSize().clone()).setAnchorPoint(0,0).setQuality(.5);
    this.appendChild(this.graphics);
    //this.graphics.draw = goog.bind(this.drawTouches_,this);

   
    this.isdown = false;
	
    goog.events.listen(this, ['mousedown', 'touchstart'],
         this.downHandler_, false, this);
	
    lime.scheduleManager.schedule(function(){
     this.graphics.setDirty(lime.Dirty.CONTENT);
     }, this);
};

ForkFruit.Game.prototype.downHandler_ = function(e) {
        var b = this.bubbles,
		p,dx,dy,lensq,
        j = b.length;
        while (--j >= 0) {
            if (b.value == 1) continue;
            p = b[j].getPosition();
            dx = p.x - e.position.x;
            dy = p.y - e.position.y;
            lensq = dx * dx + dy * dy;
            if (lensq < 1000) {
                this.removeBubble(b[j],true);
                break;
            }
        }
    
};

ForkFruit.Game.prototype.showEndDialog = function() {
    this.done = 1;
    lime.scheduleManager.unschedule(this.reload, this);
    lime.scheduleManager.unschedule(this.checkDeletions, this);

   for (var i = 0; i < this.bubbles; i++) {
       lime.animation.actionManager.stopAll(this.bubbles[i]);
   }

   var dialog = new lime.RoundedRect().setRadius(30).setFill(new lime.fill.LinearGradient().addColorStop(0, 0, 0, 0, .5).addColorStop(1, 0, 0, 0, .7)).setSize(400, 400).setPosition(400, 200).setAnchorPoint(.5, 0);
   this.appendChild(dialog);
   var title = new lime.Label().setText('Thank you Tom!').setFontColor('#fff').setFontSize(46).setPosition(0, 70);
   dialog.appendChild(title);
  

   if (this.points <= 0) {
       
	   var btn = new ForkFruit.Button().setText('TRY AGAIN').setSize(300, 90).setPosition(0, 200);
	   dialog.appendChild(btn);
	   title.setText('You lost');
   }
   

   goog.events.listen(btn, lime.Button.Event.CLICK, function() {
       ForkFruit.loadGame(6);
   },false, this);
};

ForkFruit.Game.prototype.removeBubble = function(b,isFork) {
    goog.array.remove(this.bubbles, b);
    this.layer.removeChild(b);
	var p = b.getPosition(),
	value = b.value;
	if(isFork) {
		
		this.addPoints(value);
		if(b.title == 'Branch') {
			this.addBubbles(2,p.x,p.y,50);
		}
	}else if(b.isFruit) {
		this.addPoints(-value);
	}
	
	//console.log(p);
    var lbl = new lime.Label().setText(b.title).setFontColor('#c00').setFontSize(20)
        .setOpacity(1).setPosition(p).setFontWeight(300);
    this.appendChild(lbl);

	
    var show = new lime.animation.Spawn(
      new lime.animation.MoveBy(0, -60),
      new lime.animation.FadeTo(0),
      new lime.animation.ScaleBy(2)
    );
    lbl.runAction(show);
    goog.events.listen(show, lime.animation.Event.STOP, function() {
        this.removeChild(lbl);
    },false, this);
	
    
};

ForkFruit.Game.prototype.checkDeletions = function() {
    var i = this.bubbles.length;
    while (--i >= 0) {
     if (this.bubbles[i].getPosition().y > 840 || this.bubbles[i].getPosition().x < 0 || this.bubbles[i].getPosition().x > 700) {
         this.removeBubble(this.bubbles[i]);
     }
    }
};
ForkFruit.Game.prototype.returnPoints = function(b) {
    var hide = new lime.animation.Spawn(
         new lime.animation.ScaleBy(2),
         new lime.animation.FadeTo(0)
      );
      goog.events.listen(hide, lime.animation.Event.STOP, function() {
          this.layer.removeChild(b);
      },false, this);
      b.runAction(hide);
      this.addPoints(b.value);
      var lbl = new lime.Label().setText(b.value).setFontColor('#060').setFontSize(40)
          .setOpacity(0.5).setPosition(b.getPosition().clone()).setFontWeight(700);
      this.appendChild(lbl);
      var show = new lime.animation.Spawn(
        new lime.animation.MoveBy(0, -60),
        new lime.animation.FadeTo(0),
        new lime.animation.ScaleBy(2)
      );
      lbl.runAction(show);
      goog.events.listen(show, lime.animation.Event.STOP, function() {
          this.removeChild(lbl);
      },false, this);
};

ForkFruit.Game.prototype.updateFloaters = function(dt) {
    for (var i = 0; i < this.bubbles.length; i++) {
        this.bubbles[i].updateFloatingSpeed();
    }
};

