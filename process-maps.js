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

      // is an array of arrays b/c we probably initially wanted to support layered maps
      mapObj.layers = [[]];
      for (; c <= numRows; c++) {
        var row = [];
        for (var i = 0; i < numCols; i++) {
          row.push(lines[c][i]);
        }
        // existing maps only support one layer, so hardcode this for now
        mapObj.layers[0].push(row);
      }

      // advance cursor until we get to the METADATA section
      while(lines[c].indexOf("METADATA") < 0) { c++; }
      c++; // once more to skip over the METADATA header

      // process the rest of the METADATA section directly into mapObj
      mapObj.metadata = {};
      for(; c < lines.length; c++) {
        var keyVal = lines[c].split(": ");
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
