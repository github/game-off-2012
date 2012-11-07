Crafty.scene("game", ->
  Crafty.background("#000")

  originX = Crafty.viewport.width / 2
  originY = Crafty.viewport.height / 2

  window.player = Crafty.e("2D, DOM, Color, MoveInCircle, Collision").attr(h:10, w:10).color("#Fff").origin(x: originX, y:originY)

  @polygons = []



  @attributesFor = (index, radius) ->
    angle = (index * 360 / Config.cycleSegments)
    attributes =
      x: originX + (radius * Math.cos(angle * Math.PI / 180))
      y: originY + (radius * Math.sin(angle * Math.PI / 180)) 
      w: 30
      h: 5
      origin: 'center'
      rotation: angle + 0

  _.times(Config.cycleSegments, (index) =>
    segment = Crafty.e("2D, DOM, Color, Collision").attr(@attributesFor(index, Config.cycleInnerRadius)).color("#ffffff")
    @polygons.push(segment)
  )

  _.times(Config.cycleSegments, (index) =>
    segment = Crafty.e("2D, DOM, Color, Collision").attr(@attributesFor(index, Config.cycleOuterRadius)).color("#ffffff")
    @polygons.push(segment)
  )
)

