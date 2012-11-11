ig.module(
	'game.main'
)
.requires(
  'plugins.impact-splash-loader',
  'plugins.timeslower',
	'impact.game',
	'impact.font',

  'game.director.player-controller',
  'game.director.camera',

  'game.levels.lab1',
  'game.levels.lab2',
  'game.levels.lab3',

  'game.levels.lobby1',

  'game.levels.kitchen1',
  'game.levels.kitchen2',
  'game.levels.kitchen3',

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
	gravity: 700,
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
    ig.input.bind( ig.KEY.F5, 'reset' );

    // General input
    ig.input.bind( ig.KEY.ESC, 'esc' );

    // player actions
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
    this.camera.update();
    this.parent();

    if( ig.input.state('reset') ) {
      this.loadLevel( LevelLab1 );
    }
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	}
});


StartScreen = ig.Game.extend({
  introTimer: null,
  font: new ig.Font( 'media/04b03.font.png' ),
  background: new ig.Image('media/rockkickass-marketing.png'),
  menuMusic: new ig.Sound('media/sounds/music/02 Underclocked (underunderclocked mix).*'),
  init: function() {
      ig.input.bind( ig.KEY.SPACE, 'start' );

      ig.music.add(this.menuMusic, "menu");
      ig.music.play();
  },
  update: function() {
    if( ig.input.pressed('start') ) {
      console.log('starting MyGame');
      ig.system.setGame(MyGame);
    }
    this.parent();
  },
  draw: function() {
    var x = ig.system.width/2,
        y = ig.system.height - 20,
        scale = ig.system.width/this.background.width;

    this.parent();

    if( !isNaN(scale) ) {
      this.background.resize(scale);
      this.background.width *= scale;
      this.background.height *= scale;
      this.background.draw(0,0);
    }

    this.font.draw("Press Spacebar To Start", x, y, ig.Font.ALIGN.CENTER );
  }
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', StartScreen, 60, 640, 480, 1, ig.ImpactSplashLoader );

});

window.addEventListener("blur", function () {
  if (ig.system) {
    ig.music.pause();
    ig.system.stopRunLoop();
  }
}, false);

window.addEventListener("focus", function () {
  if (ig.system) {
    ig.music.play();
    ig.system.startRunLoop();
  }
}, false);
