ig.module(
  'game.entities.enemy-boss-basher'
)
.requires(
  'impact.entity'
)
.defines( function() {
  EntityEnemyBossBasher = ig.Entity.extend({
    deathSFX: new ig.Sound('media/sounds/enemy_death.*'),
    hitSFX: new ig.Sound('media/sounds/enemy_hit.*'),
    animSheet: new ig.AnimationSheet( 'media/basher.png', 64, 64 ),
    size: { x: 64, y: 64 },
    offset: { x: 0, y: 0 },
    maxVel: { x: 500, y: 0 },
    hestationTime: 2,
    hesitationTimer: new ig.Timer(),
    flip: false,
    friction: { x: 50, y: 0 },
    speed: 300,
    health: 600,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    scoreValue: 100000,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.addAnim( 'idle', 0.5, [0,1] );
      this.addAnim( 'charge', 0.1, [2,3], true);
    },
    setIdle: function() {
      this.hesitationTimer.set( this.hestationTime ); // set the rest timer
      this.currentAnim = this.anims.idle; // set the animation to idle
    },
    update: function() {
      if( this.hesitationTimer.delta() > 0 ) {
        // animate the boss, making him charge at RK
        var xdir = this.flip ? -1 : 1;
        this.vel.x = this.speed * xdir;
        this.currentAnim = this.anims.charge;
      }

      this.currentAnim.flip.x = this.flip;

      this.parent();
    },

    kill: function() {
      this.parent();

      ig.game.playerController.score += this.scoreValue;

      this.deathSFX.play();
      ig.game.spawnEntity( EntityEffectDeathExplosion, this.pos.x, this.pos.y, { colorOffset: 1 });
    },

    receiveDamage: function(value) {
      // basher can only be damaged when he isn't charging
      if(this.health > 0 && this.currentAnim !== this.anims.charge ) {
        this.parent(value);
        this.hitSFX.play();
        ig.game.spawnEntity( EntityEffectDeathExplosion, this.pos.x, this.pos.y, {
          particles: value,
          colorOffset: 1
        });
      }
    },

    handleMovementTrace: function( res ) {
      this.parent(res);
      if( res.collision.x ) {
        this.flip = !this.flip;
        this.setIdle();
      }
    },

    check: function( other ) {
      other.receiveDamage( 1000, this );
    }
  });
})
