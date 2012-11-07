Crafty.scene("game", ->
  Crafty.background("#000")

  @polygons = []

  _.times(Config.cycleSegments, (index) =>
    attributes =
      x: 0
      y: 0
      w: 100
      h: 5
      rotation: index * 360 / Config.cycleSegments
    segment = Crafty.e("2D, DOM, Color, Collision").attr(attributes).color("#ffffff")
    @polygons.push(segment)
  )
)