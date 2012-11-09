ig.module(
  'game.entities.infobox'
)
.requires(
  'impact.entity'
)
.defines(function() {
  EntityInfobox = ig.Entity.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
    size: {x: 32, y: 32},
    checkAgainst: ig.Entity.TYPE.A,
    on: false,
    text: null,

    check: function( other ) {
      if( other instanceof EntityPlayer ) {
        this.on = true;
      }
      else {
        this.on = false;
      }
    },

    draw: function() {
      if(ig.game.player && this.touches(ig.game.player)) {
        var x = ig.system.width / 2,
        y = ig.system.height - 10;
        ig.game.font.draw( this.text, x, y, ig.Font.ALIGN.CENTER );
      }
    }
  });
});
