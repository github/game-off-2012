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
      this.parent();
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
      this.parent();
      if(this.active) {
        if(this.currentTextIndex < this.text.length) {
          var line = this.text[this.currentTextIndex]
            , entity = line.entity
            , x
            , y;

          if (line.entity === 'center') {
            x = ig.system.width / 2 - ( ig.game.font.widthForString( line.text ) / 2 );
            y = ig.system.height / 2 - 20;

            ig.game.font.draw( line.text, x, y);
          } else {
            entity = this.findEntity(line.entity);

            // translate points to camera XY
            x = ig.game.camera.calculateMove( 'x', entity.pos.x, entity.size.x );
            y = ig.game.camera.calculateMove( 'y', entity.pos.y, entity.size.y );

            //x -= (ig.game.font.widthForString( line.text ));
            //y -= (ig.game.font.heightForString( line.text ));

            console.log({ x: ig.system.width, y: ig.system.height });
            console.log(entity.pos);
            console.log(entity.size);
            console.log( {x: x, y: y } );
            console.log( ig.game.player.pos );
            console.log(line.text);
            ig.game.font.draw( line.text, x - entity.size.x, y - entity.size.y);
          }
        }
      }
    },

    findEntity: function( entityDefinition ) {
      var len = entityDefinition.length,
          entity;
      if( len > entityDefinition.replace(/^type:/ig,'').length ) {
        entity = ig.game.getEntitiesByType( entityDefinition )[0];
      } else {
        entity = ig.game.getEntityByName( entityDefinition );
      }
      return entity;
    }
  });
});
