ig.module(
  'game.entities.enemy-turret-multi'
)
.requires(
  'impact.entity',
  'game.entities.effect-death-explosion',
  'game.weapons.enemy-pea'
)
.defines( function() {
  EntityEnemyTurretMulti = ig.Entity.extend({
    shootSFX: new ig.Sound('media/sounds/shoot.*'),
    deathSFX: new ig.Sound('media/sounds/enemy_death.*'),
    hitSFX: new ig.Sound('media/sounds/enemy_hit.*'),
    animSheet: new ig.AnimationSheet( 'media/turret.png', 64, 64 ),
    size: { x: 40, y: 44 },
    offset: { x: 12, y: 20 },
    gunOffset: { x: 0, y: 5 },
    flip: false,
    health: 20,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    mainShotTimer: null,
    midShotTimer: null,
    shotDelay: 2,
    midShotDelay: 0.1,
    midShotMaxCount: 3,
    midShotCount: 0,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      this.addAnim( 'idle', 1, [0]);

      this.mainShotTimer = new ig.Timer();
      this.midShotTimer = new ig.Timer();
    },

    update: function() {
      this.parent();

      this.flip = ig.game.player.pos.x < this.pos.x;

      this.currentAnim.flip.x = this.flip;
      
      if( this.mainShotTimer.delta() > this.shotDelay ) {
        if( this.midShotTimer.delta() > this.midShotDelay ) {
          this.midShotTimer.reset();
          
          this.midShotCount++;

          ig.game.spawnEntity( 'WeaponEnemyPea', this.pos.x + this.gunOffset.x, this.pos.y + this.gunOffset.y, { flip: this.flip });
          ig.game.spawnEntity( 'WeaponEnemyPea', this.pos.x + this.gunOffset.x, this.pos.y + this.gunOffset.y, { flip: this.flip, vel: { x: 300, y: -100 } });
          ig.game.spawnEntity( 'WeaponEnemyPea', this.pos.x + this.gunOffset.x, this.pos.y + this.gunOffset.y, { flip: this.flip, vel: { x: 300, y: 100 } });
          this.shootSFX.play();

          if(this.midShotCount >= this.midShotMaxCount) {
            this.mainShotTimer.reset();
            this.midShotCount = 0;
          }
        }
      }
    },

    kill: function() {
      this.parent();

      this.deathSFX.play();
      ig.game.spawnEntity( EntityEffectDeathExplosion, this.pos.x, this.pos.y, { colorOffset: 1 });
    },

    receiveDamage: function(value) {
      this.parent(value);

      if(this.health > 0) {
        this.hitSFX.play();
        ig.game.spawnEntity( EntityEffectDeathExplosion, this.pos.x, this.pos.y, {
          particles: value,
          colorOffset: 1
        });
      }
    }
  });
})
