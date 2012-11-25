(function() {

  /*
  We'll have some collectibles:

  - Ones that give 50, 100, 500, 1000 points.
    50 and 100 points one will also prevent
    pakias from comin for sometime.

  - One to clone pappu that'll kill all
    forks, branches, pakias.
  */
  
  mit.Collectible = function() {

  };


  mit.CollectibleUtils = {

    count: 2,

    types: ['point', 'clone'],

    sub_types: {
      point: [50, 100, 500, 1000]
    },

    create: function() {

    },

    draw: function() {

    }

  };

}());