ig.module(
  'game.entities.score-pellet'
)
.requires(
  'impact.entity'
)
.defines( function() {
  EntityScorePellet = ig.Entity.extend({
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.NEVER,

    size: {x: 16, y: 16},

    animSheet: new ig.AnimationSheet( 'media/scorePellet.png', 16, 16 ),

    init: function( x, y, settings ) {
      this.addAnim( 'idle', 0.1, [0] );

      this.parent( x, y, settings );
    },

    update: function() {
    },

    receiveDamage: function( amount, from ) {
      return;
    },

    check: function( other ) { 
      if( other instanceof EntityPlayer ) {
        this.kill();
        ig.game.playerController.score += 100;
      }
    }
  });
})
