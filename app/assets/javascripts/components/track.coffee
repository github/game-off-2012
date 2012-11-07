Crafty.c("Track",
  prepare: ->
    @_polygons = []
    _.times(@_segments, (index) =>
      innerSegment = Crafty.e("Obstacle").attr(@_attrsFor(index, @_innerRadius)).color(Utils.increase_brightness(@_color, index))
      outerSegment = Crafty.e("Obstacle").attr(@_attrsFor(index, @_outerRadius)).color(Utils.increase_brightness(@_color, index))
      @_polygons.push({inner: innerSegment, outer: outerSegment})
    )
    @

  attrs: (hash) ->
    @_pivot       = hash.pivot
    @_innerRadius = hash.innerRadius
    @_outerRadius = hash.outerRadius
    @_segments    = hash.segments
    @_player      = hash.player
    @

  color: (color) ->
    @_color = color
    @

  _attrsFor: (index, radius) ->
    angle = (index * 360 / Config.cycleSegments)
    {
      x: @_pivot.x + (radius * Math.cos(angle * Math.PI / 180))
      y: @_pivot.y + (radius * Math.sin(angle * Math.PI / 180))
      w: 30
      h: 5
      origin: 'center'
      rotation: angle + 0
    }

  currentSegment: ->
    a = @_player.angle() + 20
    x = 360 / @_polygons.length
    d = Math.round(a/x) % @_polygons.length
    @_polygons[d].inner
)
