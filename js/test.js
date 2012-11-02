/*Filename: test.js
  Coded by: James Standeven for bit phlippers
  Date: November 1, 2012
*/

var container;

function init() {
  var canvas = document.getElementById("bg");
  container = new CanvasLayers.Container(canvas, false);

  container.onRender = function(layer, rect, context) {
    context.fillStyle = '#000';
    context.fillRect(0, 0, layer.getWidth(), layer.getHeight());
  }
  container.redraw();
}

onload=init;

