var through = require("through2");
var PluginError = require("gulp-util").PluginError;

var PLUGIN_NAME = "process-maps";

module.exports = function () {
  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit("error", new PluginError(PLUGIN_NAME, "Streams not supported!"));
    } else if (file.isBuffer()) {
      // use a cursor to process the file
      var c = 0;
      var lines = file.contents.toString().split("\n");

      var sizes = lines[c].split(",");
      c++;

      var numRows = parseInt(sizes[0]);
      var numCols = parseInt(sizes[1]);
      var mapObj = {};
      var layerIndex = 0;

      // is an array of arrays to store layers
      mapObj.layers = [];
      while (lines[c].length === numCols) { // scary, I know
        mapObj.layers.push([]);
        var lastRow = c + numRows;

        for (; c < lastRow; c++) {
          var row = [];
          for (var i = 0; i < numCols; i++) {
            row.push(lines[c][i]);
          }
          mapObj.layers[layerIndex].push(row);
        }
        layerIndex++;
      }

      // advance cursor until we get to the METADATA section
      while(lines[c].indexOf("METADATA") < 0) { c++; }
      c++; // once more to skip over the METADATA header

      // process the rest of the METADATA section directly into mapObj
      mapObj.metadata = {};
      for(; c < lines.length; c++) {
        // SO shoutout for greedy operator use: http://stackoverflow.com/a/4607799/1159255
        var keyVal = lines[c].split(/: (.+)/);
        if (keyVal[0] === "link_items") {
          mapObj.metadata[keyVal[0]] = JSON.parse(keyVal[1]);
        } else {
          mapObj.metadata[keyVal[0]] = keyVal[1];
        }
      }

      file.contents = new Buffer(JSON.stringify(mapObj));
      file.path = file.path.replace(/map(\d+)\.txt$/, "$1");
      return callback(null, file);
    }
  });
};
