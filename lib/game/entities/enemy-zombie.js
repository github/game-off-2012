ig.module(
  'game.entities.enemy-zombie'
)
.requires(
  'impact.entity'
)
.defines( function() {
  EntityEnemyZombie = ig.Entity.extend({
    deathSFX: new ig.Sound('media/sounds/enemy_death.*'),
    hitSFX: new ig.Sound('media/sounds/enemy_hit.*'),
    animSheet: new ig.AnimationSheet( 'media/zombie.png', 16, 16 ),
    size: { x: 8, y: 14 },
    offset: { x: 4, y: 2 },
    maxVel: { x: 100, y: 100 },
    flip: false,
    friction: { x: 150, y: 0 },
    speed: 14,
    health: 20,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.addAnim( 'walk', .07, [0,1,2,3,4,5]);
    },

    update: function() {
      var isNearWall = !ig.game.collisionMap.getTile(
          this.pos.x + (this.flip ? +4 : this.size.x - 4),
          this.pos.y + this.size.y+1
        );
      if( isNearWall ) {
        this.flip = !this.flip;
      }
      var xdir = this.flip ? -1 : 1;
      this.vel.x = this.speed * xdir;
      this.currentAnim.flip.x = this.flip;
      this.parent();
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
