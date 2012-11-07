Crafty.scene("game", ->
  Crafty.background("#000")

  window.player = Crafty.e("2D, DOM, Color, MoveInCircle, Collision").attr(x: 480/2, y:320/2, h:10, w:10).color("#Fff")

  @polygons = []

  originX = Crafty.viewport.width / 2
  originY = Crafty.viewport.height / 2

  @attributesFor = (index, radius) ->
    angle = (index * 360 / Config.cycleSegments)
    attributes =
      x: originX + (radius * Math.cos(angle * Math.PI / 180))
      y: originY + (radius * Math.sin(angle * Math.PI / 180))
      w: 30
      h: 5
      origin: 'center'
      rotation: angle + 90

  _.times(Config.cycleSegments, (index) =>
    segment = Crafty.e("2D, DOM, Color, Collision").attr(@attributesFor(index, Config.cycleInnerRadius)).color("#ffffff")
    @polygons.push(segment)
  )

  _.times(Config.cycleSegments, (index) =>
    segment = Crafty.e("2D, DOM, Color, Collision").attr(@attributesFor(index, Config.cycleOuterRadius)).color("#ffffff")
    @polygons.push(segment)
  )
)

