(function() {

  window.utils = window.utils || {};

  utils.randomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

}());