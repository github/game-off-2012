ig.module(
  'game.entities.powerup-pistol'
)
.requires(
  'impact.impact',
  'impact.entity',
  'game.weapons.pistol'
)
.defines(function() {
  EntityPowerupPistol = ig.Entity.extend({
    size: { x: 16, y: 16 },
    offset: { x: 0, y: 0 },
    pickupSFX: new ig.Sound('media/sounds/powerup_pickup.*'),
    animSheet: new ig.AnimationSheet( 'media/powerup_pistol.png', 16, 16 ),
    maxVel: { x: 0, y: 0 },
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      // create the entity in the game world
      this.addAnim( 'idle', 0.3, [0,1,2,1]);
    },
    check: function(player) {
      // we know that other is going to be the player
      // add the "pistol" to their inventory if they don't have it already
      // also, add some bullets
      if( player instanceof EntityPlayer ) {
        var weapon = new WeaponPistol(player.pos.x, player.pos.y, player.settings);
        ig.game.playerController.addWeapon(weapon.getForInventory(), 50);
        this.kill();
        this.pickupSFX.play();
      }
    }
  });
});
