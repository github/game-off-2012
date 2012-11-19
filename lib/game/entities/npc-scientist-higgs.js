ig.module(
  'game.entities.npc-scientist-higgs'
)
.requires(
  'impact.entity'
)
.defines( function() {
  EntityNpcScientistHiggs = ig.Entity.extend({
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,
    flip: false,
    size: {x: 41, y: 64},
    offset: { x: 0, y: 1 },

    animSheet: new ig.AnimationSheet( 'media/scientist1.png', 41, 64 ),

    init: function( x, y, settings ) {
      this.addAnim( 'idle', 0.1, [0] );

      this.parent( x, y, settings );

      this.flip = settings.flip || false;
    },

    update: function() {
      this.parent();
    },

    draw: function() {
      this.parent();

      this.currentAnim.flip.x = this.flip;
    },

    receiveDamage: function( amount, from ) {
      return;
    },
  });
})
