ig.module(
  'game.weapons.enemy-grenade'
)
.requires(
  'impact.entity'
)
.defines(function() {
  WeaponEnemyGrenade = ig.Entity.extend({
    explodeSFX: new ig.Sound('media/sounds/grenade_explode.*'),
    hitSFX: new ig.Sound('media/sounds/grenade_touch.*'),
    size: { x: 16, y: 16 },
    offset: { x: -4, y: -4 },
    animSheet: new ig.AnimationSheet( 'media/grenade.png', 16, 16 ),
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    maxVel: { x: 100, y: 200 },
    bounciness: 0.5,
    bounceCounter: 0,
    friction: {x: 75, y: 0},
    particles: 30,
    detonationTimer: null,
    prevCollisionPos: null,

    init: function( x, y, settings ) {
      this.parent( x + (settings.flip ? -4 : 7), y, settings);
      this.vel.x  = (settings.flip ? -this.maxVel.x : this.maxVel.x);
      this.vel.y = -(50 + (Math.random()*100));
      this.addAnim( 'idle', 0.4, [0,1]);
      this.addAnim( 'landed', 0.4, [1]);
      this.detonationTimer = new ig.Timer();
      this.detonationTimer.set(3);
    },

    handleMovementTrace: function( res ) {
      this.parent(res);
      if( res.collision.x || res.collision.y ) {
        this.bounceCounter++;

        if( this.prevCollisionPos ) {
          // check the position that the
          // movement trace is reporting
          // if it is not the same as the last position (exactly)
          // then the grende is still moving
          // and we should play the "clink" sound
          if( ! (this.prevCollisionPos.x === res.pos.x && this.prevCollisionPos.y === res.pos.y) ) {
            this.hitSFX.play();
          } else {
            this.currentAnim = this.anims.landed;
          }
        } else {
          this.hitSFX.play();
        }

        if(this.bounceCounter === 100) {
          this.kill();
        }

        this.prevCollisionPos = res.pos;
      }
    },

    draw: function() {
      if(this.detonationTimer.delta() > -1) {
        this.kill();
      }
      this.parent();
    },

    kill: function(){
      this.explodeSFX.play();
      for(var i = 0; i < this.particles; i++)
        ig.game.spawnEntity(EntityEnemyGrenadeParticle, this.pos.x, this.pos.y);
      this.parent();
    }
  });

  EntityEnemyGrenadeParticle = ig.Entity.extend({
    size: {x: 4, y: 4},
    maxVel: {x: 200, y: 250},
    lifetime: 1,
    fadetime: 1,
    bounciness: 0.3,
    vel: {x: 60, y: 200},
    friction: {x:20, y: 20},
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.LITE,
    animSheet: new ig.AnimationSheet( 'media/explosion.png', 4, 4 ),
    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
      this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
      this.idleTimer = new ig.Timer();
      var frameID = Math.round(Math.random()*7);
      this.addAnim( 'idle', 0.1, [frameID], true );
    },
    update: function() {
      if( this.idleTimer.delta() > this.lifetime ) {
        this.kill();
        return;
      }
      this.currentAnim.alpha = this.idleTimer.delta().map(
        this.lifetime - this.fadetime, this.lifetime, 1, 0
      );
      this.parent();
    },
    check: function(other) {
      other.receiveDamage(2, this);
      this.kill();
    }
  });
});
