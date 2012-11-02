ig.module(
  'game.weapons.baseball'
)
.requires(
  'impact.entity'
)
.defines(function() {
  WeaponBaseball = ig.Entity.extend({
    getForInventory: function() {
      return {
        name: 'WeaponBaseball',
        playerAnimOffset: 1
      };
    },
    size: { x: 6, y: 6 },
    offset: { x: 0, y: 0 },
    animSheet: new ig.AnimationSheet( 'media/baseball.png', 6, 6 ),
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,
    maxVel: { x: 190, y: 0 },
    friction: {x: 0, y: 0},

    init: function( x, y, settings ) {
      this.parent( x + (settings.flip ? -4 : 7), y + 4, settings);
      this.vel.x  = (settings.flip ? -this.maxVel.x : this.maxVel.x);
      this.addAnim( 'idle', 0.2, [0]);
    },

    handleMovementTrace: function( res ) {
      this.parent(res);
      if( res.collision.x || res.collision.y ) {
        this.kill();
      }
    },

    check: function(other) {
      other.receiveDamage(3, this);
      this.kill();
    }
  });
});
