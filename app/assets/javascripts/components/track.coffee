Crafty.c("Track",
  prepare: ->
    @_polygons = []

    _.times(@_segments, (index) =>
      segment = Crafty.e("2D, DOM, Color, Collision").attr(@_attrsFor(index, @_innerRadius))
      .color(Utils.increase_brightness(@_color, index))
      @_polygons.push(segment)
    )

    _.times(@_segments, (index) =>
      segment = Crafty.e("2D, DOM, Color, Collision").attr(@_attrsFor(index, @_outerRadius))
      .color(Utils.increase_brightness(@_color, index))
      @_polygons.push(segment)
    )

  attrs: (hash) ->
    @_origin = hash.origin
    @_innerRadius = hash.innerRadius
    @_outerRadius = hash.outerRadius
    @_segments    = hash.segments
    @

  color: (color) ->
    @_color = color
    @

  _attrsFor: (index, radius) ->
    angle = (index * 360 / Config.cycleSegments)
    {
      x: @_origin.x + (radius * Math.cos(angle * Math.PI / 180))
      y: @_origin.y + (radius * Math.sin(angle * Math.PI / 180))
      w: 30
      h: 5
      origin: 'center'
      rotation: angle + 0
    }
)
