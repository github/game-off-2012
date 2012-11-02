ig.module(
  'game.entities.enemy-boss-hamster'
)
.requires(
  'impact.entity'
)
.defines( function() {
  EntityEnemyBossHamster = ig.Entity.extend({
    deathSFX: new ig.Sound('media/sounds/enemy_death.*'),
    hitSFX: new ig.Sound('media/sounds/enemy_hit.*'),
    animSheet: new ig.AnimationSheet( 'media/hamster.png', 82, 82 ),
    size: { x: 82, y: 82 },
    offset: { x: 0, y: 0 },
    maxVel: { x: 100, y: 100 },
    flip: false,
    friction: { x: 150, y: 100 },
    speed: 20,
    health: 200,
    jump: 20,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.addAnim( 'walk', .1, [0,1,2]);
      // this.addAnim( 'jump', .07, [0]);
    },

    update: function() {
      var xdir = this.flip ? -1 : 1;
      this.vel.x = this.speed * xdir;
      this.currentAnim.flip.x = this.flip;
      this.parent();
    },

    kill: function() {
      this.parent();
      this.deathSFX.play();
      ig.game.spawnEntity( EntityEffectDeathExplosion,
          this.pos.x + this.size.x/2,
          this.pos.y + this.size.y/2, {
        particles: 30,
        colorOffset: 1
      });
    },

    receiveDamage: function(value) {
      this.parent(value);
      if(this.health > 0) {
        this.hitSFX.play();
        ig.game.spawnEntity( EntityEffectDeathExplosion,
          this.pos.x + this.size.x/2,
          this.pos.y + this.size.y/2, {
          particles: value,
          colorOffset: 1
        });
      }
    },

    handleMovementTrace: function( res ) {
      this.parent(res);
      if( res.collision.x ) {
        this.flip = !this.flip;
      }
    },

    check: function( other ) {
      other.receiveDamage( 10, this );
    }
  });
})
