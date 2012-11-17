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

  utils.isInt = function(number) {
    return parseFloat(number) === parseInt(number);
  };

  utils.toRadian = function(degree) {
    return (degree * Math.PI/180);
  };

  utils.toDegree = function(radian) {
    return (radian * 180/Math.PI);
  };

}());