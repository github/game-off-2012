ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

  'game.director.player-controller',
  'game.director.camera',

  'game.levels.lab1',
  'game.levels.dorm1',
  'game.levels.dorm2',
  'game.levels.dorm3',
  'game.levels.dorm4',

  'impact.debug.debug'
)
.defines(function() {

MyGame = ig.Game.extend({

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	intructionText: new ig.Font( 'media/04b03.font.png' ),
	gravity: 350,
  camera: null,

	init: function() {
		var q = {};
		if(window.location.href.indexOf("?") > -1) {
			var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          q[pair[0]] = pair[1];
      }
		}

		ig.game.playerController = new ig.PlayerController();
    
    this.camera = new ig.Camera( ig.system.width/4, ig.system.height/3, 5 );
    this.camera.trap.size.x = ig.system.width/10;
    this.camera.trap.size.y = ig.system.height/3;
    this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;

		// Initialize your game here; bind keys etc.
		this.loadLevel( q.level ? ig.global[q.level] : LevelLab1 );

    ig.game.bindInput = this.bindInput;
    ig.game.bindInput();
	},

  bindInput: function() {
    ig.input.bind( ig.KEY.ESC, 'esc' );

    ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
    ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
    ig.input.bind( ig.KEY.UP_ARROW, 'jump' );
    ig.input.bind( ig.KEY.SPACE, 'shoot' );
    ig.input.bind( ig.KEY.TAB, 'switch' );
  },

  loadLevel: function( level ) {        
      this.parent( level );

      this.player = this.getEntitiesByType( EntityPlayer )[0];
      
      // Set camera max and reposition trap
      this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
      this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
      
      this.camera.set( this.player );
  },

	update: function() {
		// Update all entities and backgroundMaps
    this.camera.follow( this.player );
    this.parent();

		// Add your own, additional update code here
		var player = this.getEntitiesByType( EntityPlayer )[0];
  	if( player ) {
  		if( player.accel.x > 0 && this.intructionText ) {
  			this.intructionText = null;
  		}
  	}
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();

		if(this.intructionText) {
      var x = ig.system.width/2,
      y = ig.system.height - 10;
      this.intructionText.draw( 'ARROWs move and jump, SPACE Fires & TAB cycles weapons.', x, y, ig.Font.ALIGN.CENTER );
    }
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
