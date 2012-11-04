ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
  'game.levels.lab1',
  'game.levels.dorm1',
	'game.levels.dorm2',
	'game.levels.dorm3',
	'game.levels.dorm4',


	'game.director.player-controller',
	'game.director.camera',
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
		this.camera = new ig.Camera();
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

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		// Add your own, additional update code here
		var player = this.getEntitiesByType( EntityPlayer )[0];
  	if( player ) {
  		this.screen.x = player.pos.x - ig.system.width/2;
  		this.screen.y = player.pos.y - ig.system.height/2;

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
