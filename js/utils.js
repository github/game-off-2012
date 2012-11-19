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

  utils.intersect = function(bounds1, bounds2) {

    return !(
      bounds1.end_x < bounds2.start_x ||
      bounds2.end_x < bounds1.start_x ||
      bounds1.end_y < bounds2.start_y ||
      bounds2.end_y < bounds1.start_y
    );
    
  };

}());