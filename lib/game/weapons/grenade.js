ig.module(
  'game.weapons.grenade'
)
.requires(
  'impact.entity'
)
.defines(function() {
  WeaponGrenade = ig.Entity.extend({
    getForInventory: function() {
      return {
        name: 'WeaponGrenade',
        playerAnimOffset: 1
      };
    },
    explodeSFX: new ig.Sound('media/sounds/grenade_explode.*'),
    hitSFX: new ig.Sound('media/sounds/grenade_touch.*'),
    size: { x: 4, y: 4 },
    offset: { x: 2, y: 2 },
    animSheet: new ig.AnimationSheet( 'media/grenade.png', 8, 8 ),
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.BOTH,
    collides: ig.Entity.COLLIDES.PASSIVE,
    maxVel: { x: 100, y: 200 },
    bounciness: 0.5,
    bounceCounter: 0,
    friction: {x: 75, y: 0},
    particles: 20,
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
        ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x, this.pos.y);
      // ig.game.spawnEntity(EntityGrenadeScreenShake, this.pos.x, this.pos.y);
      this.parent();
    }
  });

  EntityGrenadeParticle = ig.Entity.extend({
    size: {x: 1, y: 1},
    maxVel: {x: 160, y: 200},
    lifetime: 1,
    fadetime: 1,
    bounciness: 0.3,
    vel: {x: 60, y: 60},
    friction: {x:20, y: 20},
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.LITE,
    animSheet: new ig.AnimationSheet( 'media/explosion.png', 1, 1 ),
    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
      this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
      this.idleTimer = new ig.Timer();
      var frameID = Math.round(Math.random()*7);
      this.addAnim( 'idle', 0.1, [frameID] );
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
      other.receiveDamage(1, this);
      this.kill();
    }
  });

  EntityGrenadeScreenShake = ig.Entity.extend({
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(80, 130, 170, 0.7)',
    size: {
      x: 8,
      y: 8
    },
    duration: 2,
    strength: 50,
    screen: {
      x: 0,
      y: 0
    },
    quakeTimer: null,
    init: function (x, y, settings) {
      this.quakeTimer = new ig.Timer();
      this.quakeTimer.set(this.duration);
      this.parent(x, y, settings);
    },
    kill: function () {
      this.parent();
    },
    update: function () {
      var delta = this.quakeTimer.delta();
      if (delta < 0) {
        var s = this.strength * 0.10;
        ig.game.screen.x += Math.random().map(0, 1, -s, s);
        ig.game.screen.y += Math.random().map(0, 1, -s, s);
      }
      if (delta > 0) {
        this.quakeTimer = null;
        this.kill();
      }
    }
  });
});
