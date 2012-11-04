ig.module(
  'game.entities.cutscene'
)
.requires(
  'impact.entity'
)
.defines(function() {
  EntityCutscene = ig.Entity.extend({
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
    size: {x: 8, y: 8},
    active: false,
    complete: false,
    checkAgainst: ig.Entity.TYPE.A,

    cutsceneTimer: null,

    update: function() {
      if( this.active ) {
        if( ig.input.state('esc') ) {
          this.end();
        } else {
          // Update cut scene
          if( this.cutsceneTimer.delta() > 2 ) {
            this.end();
          }
        }
      }
    },

    check: function( other ) {
      if( other instanceof EntityPlayer ) {
        if( !this.active && !this.complete ) {
          this.start();
        }
      }
    },

    start: function() {
      this.cutsceneTimer = new ig.Timer();

      this.active = true;
      this.complete = true;

      this.suspendInput();
    },

    suspendInput: function() {
      // prevent all user interaction except esc
      ig.input.unbindAll();

      ig.input.bind( ig.KEY.ESC, 'esc' );
    },

    restoreInput: function() {
      // restore all user interaction
      ig.game.bindInput();
    },

    end: function() {
      this.active = false;

      this.restoreInput();
    }
  });
});
