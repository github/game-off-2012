ig.module(
    'game.director.player-controller'
)
.requires(
    'impact.impact',
    'game.weapons.pea'
)
.defines(function(){
  ig.PlayerController = ig.Class.extend({
    lives: 3,
    score: 0,
    extraLife: 10000,
    currentLevel: 0,
    weapons: [],
    activeWeaponIndex: 0,
    nextWeapon: function() {
      this.activeWeaponIndex++;
      if(this.activeWeaponIndex >= this.weapons.length) {
        this.activeWeaponIndex = 0;
      }
      return this.weapons[this.activeWeaponIndex];
    },
    addWeapon: function(weapon, ammo) {
      if(this.weapons.length > 0) {
        for (var i = this.weapons.length - 1; i >= 0; i--) {
          if( this.weapons[i].name === weapon.name ) {
            return;
          }
        };
      }
      this.weapons.push(weapon);
    },
    init: function() {
      this.addWeapon( new WeaponPea(0, 0, {}).getForInventory(), -1 );
    },
    getWeaponAnimationOffset: function() {
      return this.weapons[this.activeWeaponIndex].playerAnimOffset;
    },
    getCurrentWeapon: function() {
      return this.weapons[this.activeWeaponIndex];
    }
  });
});
