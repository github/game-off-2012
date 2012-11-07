Crafty.c("Track",
  init: ->
    @_polygons = []
    start_color = "#002200"

    origin =
      x: Crafty.viewport.width / 2
      y: Crafty.viewport.height / 2

    @attributesFor = (index, radius) ->
      angle = (index * 360 / Config.cycleSegments)
      attributes =
        x: origin.x + (radius * Math.cos(angle * Math.PI / 180))
        y: origin.y + (radius * Math.sin(angle * Math.PI / 180))
        w: 30
        h: 5
        origin: 'center'
        rotation: angle + 0

    _.times(Config.cycleSegments, (index) =>
      segment = Crafty.e("2D, DOM, Color, Collision").attr(@attributesFor(index, Config.cycleInnerRadius))
      .color(Utils.increase_brightness(start_color, index))
      @_polygons.push(segment)

    )

    _.times(Config.cycleSegments, (index) =>
      segment = Crafty.e("2D, DOM, Color, Collision").attr(@attributesFor(index, Config.cycleOuterRadius))
      .color(Utils.increase_brightness(start_color, index))
      @_polygons.push(segment)
    )
)
