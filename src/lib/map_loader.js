function loadMap(file, callback) {
  $.get(file,function(data) {
    var level = [];
    // Split out each row
    $.each(data.split("\n"),function(y,row) {
      var columns = row.split("\t");
      level.push(columns);
      // Then split out each column
      $.each(columns,function(x,column) {
        if(column) {
          Crafty.e("2D, Canvas, floor, Floor").attr({x:x * 32, y: y * 32});
        } else {
          Crafty.e("2D, Canvas, wall1, Wall").attr({x:x * 32, y: y * 32});
        }
      });

    });
    callback(level);
  });
}
