ig.module(
  'game.weapons.shotgun'
)
.requires(
  'impact.entity'
)
.defines(function() {
  WeaponShotgun = ig.Entity.extend({
    getForInventory: function() {
      return {
        name: 'WeaponShotgun',
        playerAnimOffset: 2
      };
    },
    size: { x: 5, y: 3 },
    animSheet: new ig.AnimationSheet( 'media/bullet.png', 5, 3 ),
    maxVel: { x: 140, y: 0 },
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function(x, y, settings) {
      this.parent( x + (settings.flip ? -4 : 8), y + 8, settings);
      this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
      this.addAnim( 'idle', 0.2, [0] );
    },

    handleMovementTrace: function(res) {
      this.parent(res);
      if(res.collision.x || res.collision.y) {
        this.kill();
      }
    },

    check: function( other ) {
      other.receiveDamage(20, this);
      this.kill();
    }
  });
});
