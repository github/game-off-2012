/*Filename: test.js
  Coded by: James Standeven for bit phlippers
  Date: November 1, 2012
*/

var container; //background layer
var sprite; //character layer
var layer1; //another layer

function init() {
  var canvas = document.getElementById("bg"); //get canvas element bg
  container = new CanvasLayers.Container(canvas, false); //allocate mem for container

  /*Give container initial action*/
  container.onRender = function(layer, rect, context) {
    context.fillStyle = "#000"; //black
    context.fillRect(0, 0, layer.getWidth(), layer.getHeight()); //fill the window
  }

  sprite = new CanvasLayers.Layer(0, 100, 100, 100); //(positionx, positiony, heightx, heighty)
  container.getChildren().add(sprite);

  sprite.onRender = function(layer, rect, context) {
    context.fillStyle = "#00f";
    context.fillRect(0, 0, layer.getWidth(), layer.getHeight());
  }
  
  layer1 = new CanvasLayers.Layer(100, 50, 100, 100);
  container.getChildren().add(layer1);

  layer1.onRender = function(layer, rect, context) {
  context.fillStyle = '#0f0';
  context.fillRect(0, 0, layer.getWidth(), layer.getHeight());
  }

  layer1.lowerToBottom();

  var timer = setInterval("changeScene()", 10)
}

function changeScene() {
  layer1.moveTo(layer1.getRelativeX() + 1, layer1.getRelativeY());
  container.redraw();
}

onload=init; //start this script after it has loaded

