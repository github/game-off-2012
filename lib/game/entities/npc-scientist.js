ig.module(
  'game.entities.npc-scientist'
)
.requires(
  'impact.entity'
)
.defines( function() {
  EntityNpcScientist = ig.Entity.extend({
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,

    size: {x: 25, y: 41},
    
    animSheet: new ig.AnimationSheet( 'media/scientist1.png', 26, 41 ),
    
    init: function( x, y, settings ) {
      this.addAnim( 'idle', 0.1, [0] );
      // this.addAnim( 'jump', 0.1, [3,4,5] );
      
      this.parent( x, y, settings );
    },
    
    update: function() {
      this.parent(); 
    }
  });
})
