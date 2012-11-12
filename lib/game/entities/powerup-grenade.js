ig.module(
  'game.entities.powerup-grenade'
)
.requires(
  'impact.impact',
  'impact.entity',
  'game.weapons.grenade'
)
.defines(function() {
  EntityPowerupGrenade = ig.Entity.extend({
    size: { x: 10, y: 10 },
    offset: { x: 0, y: 0 },
    pickupSFX: new ig.Sound('media/sounds/powerup_pickup.*'),
    animSheet: new ig.AnimationSheet( 'media/powerup_grenade.png', 10, 10 ),
    maxVel: { x: 0, y: 0 },
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      // create the entity in the game world
      this.addAnim( 'idle', 0.4, [0,1,2,1]);
    },
    check: function(player) {
      if( player instanceof EntityPlayer ) {
        var weapon = new WeaponGrenade(player.pos.x, player.pos.y, player.settings);
        ig.game.playerController.addWeapon(weapon.getForInventory(), 50);
        this.kill();
        this.pickupSFX.play();
      }
    }
  });
});
