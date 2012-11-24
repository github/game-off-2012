ig.module(
  'game.entities.effect-death-explosion'
)
.requires(
  'impact.entity'
)
.defines(function() {
  EntityEffectDeathExplosion = ig.Entity.extend({
    lifetime: 1,
    callback: null,
    particles: 13,

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      for( var i = 0; i < this.particles; i++ ) {
        ig.game.spawnEntity(EntityEffectDeathExplosionParticle, x, y, { colorOffset: settings.colorOffset ? settings.colorOffset : 0 });
        this.idleTimer = new ig.Timer();
      }
      this.callback = settings.callback;
    },

    update: function() {
      if( this.idleTimer.delta() > this.lifetime ) {
        this.kill();
        if(this.callback)
          this.callback();
        return;
      }
    }
  });

  EntityEffectDeathExplosionParticle = ig.Entity.extend({
    size: {x: 2, y: 2},
    maxVel: {x: 160, y: 200},
    lifetime: 2,
    fadetime: 1,
    bounciness: 0,
    vel: {x: 100, y: 30},
    friction: {x:100, y: 0},
    collides: ig.Entity.COLLIDES.LITE,
    colorOffset: 0,
    totalColors: 7,
    animSheet: new ig.AnimationSheet( 'media/blood.png', 2, 2 ),
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
        this.addAnim( 'idle', 0.2, [frameID] );
        this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
        this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
        this.idleTimer = new ig.Timer();
    },
    update: function() {
        if( this.idleTimer.delta() > this.lifetime ) {
            this.kill();
            return;
        }
        this.currentAnim.alpha = this.idleTimer.delta().map(
            this.lifetime - this.fadetime, this.lifetime,
            1, 0
        );
        this.parent();
    }
  });
});
