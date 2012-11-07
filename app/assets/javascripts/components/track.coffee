Crafty.c("Track",

  segments: Config.cycleSegments
  _segments: []
  _player: null

  Track: ->
    @_segments = []
    _.times(@segments, (index) =>
      @_segments.push(Crafty.e("Segment").pivot(@pivot).angle(index * 360 / @segments).Segment())
    )
    @

  pivot: (pivot)->
    @attr("pivot", pivot)
    @

  color: (color) ->
    @_color = color
    @

  player: (player)->
    @attr("player", player)
    @

  currentSegment: (foreward = 0 )->
    a = @player.angle() + foreward
    x = 360 / @segments
    d = Math.round(a/x) % @segments
    @_segments[d]
)
