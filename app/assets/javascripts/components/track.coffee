Crafty.c("Track",

  segments: Config.cycleSegments
  _segments: []
  _player: null

  Track: ->
    @_segments = []
    _.times(@segments, (index) =>
      prevSegment = @_segments[index - 1]
      segment = Crafty.e("Segment").pivot(@pivot).angle(index * 360 / @segments).preceeding(prevSegment).Segment()
      @_segments.push(segment)
    )
    _.first(@_segments).preceeding(_.last(@_segments))
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

  currentSegment: (forward = 0 )->
    a = @player.angle()
    x = 360 / @segments
    d = (Math.floor(a/x) + forward) % @segments
    @_segments[d]

  reset: ->
    _.each(@_segments, (segment) -> segment.reset())
)
