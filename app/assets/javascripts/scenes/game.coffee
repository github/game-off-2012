Crafty.scene("game", ->
  Crafty.background("#000")

  @polygons = []

  originX = Crafty.viewport.width / 2
  originY = Crafty.viewport.height / 2
  radius  = Config.cycleInnerRadius

  _.times(Config.cycleSegments, (index) =>
    angle = (index * 360 / Config.cycleSegments)
    attributes =
      x: originX + (radius * Math.cos(angle * Math.PI / 180))
      y: originY + (radius * Math.sin(angle * Math.PI / 180))
      w: 100
      h: 5
      origin: 'center'
      rotation: angle + 90
    segment = Crafty.e("2D, DOM, Color, Collision").attr(attributes).color("#ffffff")
    @polygons.push(segment)
  )
)

