//set main namespace
goog.provide('ForkFruit');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.transitions.MoveInUp');

goog.require('ForkFruit.Game');

//constant iPad size
ForkFruit.WIDTH = 720;
ForkFruit.HEIGHT = 1004;

// entrypoint
ForkFruit.start = function(){

	ForkFruit.director = new lime.Director(document.body,ForkFruit.WIDTH,ForkFruit.HEIGHT),
	ForkFruit.director.makeMobileWebAppCapable();   
	
	ForkFruit.director.replaceScene(new ForkFruit.Game(6));

}
ForkFruit.loadGame = function(level) {
    ForkFruit.activeGame = new ForkFruit.Game(level);
    ForkFruit.director.replaceScene(ForkFruit.activeGame, lime.transitions.MoveInUp);
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('ForkFruit.start', ForkFruit.start);
