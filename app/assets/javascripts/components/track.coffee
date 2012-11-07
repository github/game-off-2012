Crafty.c("Track",
  prepare: ->
    @_polygons = []
    _.times(@_segments, (index) =>
      innerSegment = Crafty.e("Obstacle").attrs(index, @_pivot, @_innerRadius, @_segments).paint(@_color, index)
      outerSegment = Crafty.e("Obstacle").attrs(index, @_pivot, @_outerRadius, @_segments).paint(@_color, index)
      @_polygons.push({inner: innerSegment, outer: outerSegment})
    )

  attrs: (hash) ->
    @_pivot       = hash.pivot
    @_innerRadius = hash.innerRadius
    @_outerRadius = hash.outerRadius
    @_segments    = hash.segments
    @

  color: (color) ->
    @_color = color
    @
)
