Crafty.c("Track",
  prepare: ->
    @_polygons = []
    _.times(@_attrs.segments, (index) =>
      segment = Crafty.e("Segment").attrs(index, @_attrs).paint(@_color, index)
      @_polygons.push(segment)
    )

  attrs: (hash) ->
    @_attrs = hash
    @

  color: (color) ->
    @_color = color
    @
)
