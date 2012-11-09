ig.module(
  'game.entities.cutscene'
)
.requires(
  'impact.entity'
)
.defines(function() {
  EntityCutscene = ig.Entity.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
    size: {x: 8, y: 8},
    active: false,
    complete: false,
    checkAgainst: ig.Entity.TYPE.A,

    currentTextIndex: 0,

    textTimer: null,

    update: function() {
      if ( this.active ) {
        if ( ig.input.pressed('esc') ) {
          this.end();
        } else if( ig.input.pressed('skip') ) {
          this.next();
        } else {
          // Update cut scene
          if( this.currentTextIndex >= this.text.length ) {
            this.end();
          }

          if(this.textTimer.delta() > 3) {
            this.next();
          }
        }
      }
    },

    next: function() {
      this.currentTextIndex++;
      this.textTimer.reset();
    },

    check: function( other ) {
      if( other instanceof EntityPlayer ) {
        if( !this.active && !this.complete ) {
          this.start();
        }
      }
    },

    start: function() {
      this.textTimer = new ig.Timer();

      this.active = true;
      this.complete = true;

      ig.game.camera.move(100, 100);

      this.suspendInput();
    },

    suspendInput: function() {
      // prevent all user interaction except esc
      ig.input.unbindAll();

      ig.input.bind( ig.KEY.ESC, 'esc' );
      ig.input.bind( ig.KEY.SPACE, 'skip' );
    },

    restoreInput: function() {
      // restore all user interaction
      ig.game.bindInput();
    },

    end: function() {
      this.active = false;
      
      ig.game.camera.set(ig.game.player);

      this.restoreInput();
    },

    draw: function() {
      if(this.active) {
        if(this.currentTextIndex < this.text.length) {
          var entity = ig.game.getEntityByName(this.text[this.currentTextIndex].entity);

          //var x = ig.system.width / 2,
          //y = ig.system.height - 10;
          
          console.log(entity.pos.x, entity.pos.y);

          ig.game.font.draw( this.text[this.currentTextIndex].text, entity.pos.x - entity.size.x, entity.pos.y - entity.size.y - entity.size.y - 50, ig.Font.ALIGN.CENTER );
        }
      }
    }
  });
});
