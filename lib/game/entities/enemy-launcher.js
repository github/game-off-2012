ig.module(
  'game.entities.enemy-launcher'
)
.requires(
  'impact.entity',
  'game.entities.effect-death-explosion',
  'game.weapons.enemy-grenade'
)
.defines( function() {
  EntityEnemyLauncher = ig.Entity.extend({
    shootSFX: new ig.Sound('media/sounds/shoot.*'),
    deathSFX: new ig.Sound('media/sounds/enemy_death.*'),
    hitSFX: new ig.Sound('media/sounds/enemy_hit.*'),
    animSheet: new ig.AnimationSheet( 'media/grenade-mine-sprite.png', 32, 32 ),
    size: { x: 32, y: 32 },
    offset: { x: 0, y: 0 },
    gunOffset: { x: 6, y: -1 },
    flip: false,
    health: 20,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    mainShotTimer: new ig.Timer(),
    preShotTimer: null,
    shotDelay: 4,
    preShotDelay: 3,
    postShotDelay:5,

    scoreValue: 2000,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      this.addAnim( 'idle', 0.5, [0], true);
      this.addAnim( 'firing', 1, [0,1,2,1,0], true);


      this.mainShotTimer.set(this.shotDelay);
    },

    playerNear: function(px) {
      return ig.game.player.pos.x < (this.pos.x - px) ||
                        ig.game.player.pos.x > (this.pos.x + px);
    },

    update: function() {
      this.parent();

      shouldFire = this.playerNear(10);

      if( shouldFire ) {
        if( this.mainShotTimer.delta() > 0 ) {
          ig.game.spawnEntity( 'WeaponEnemyGrenade',
                                this.pos.x + this.gunOffset.x,
                                this.pos.y + this.gunOffset.y,
                                { flip: ig.game.player.pos.x < this.pos.x });
          this.shootSFX.play();
          this.mainShotTimer.set(4);
        }
      }
    },

    kill: function() {
      this.parent();

      ig.game.playerController.score += this.scoreValue;

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
