(function() {

  window.utils = window.utils || {};

  /*
  Random Number Generator.
  
  Pretty awesome explanation here:
  http://stackoverflow.com/a/1527820
  */
  utils.randomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

}());