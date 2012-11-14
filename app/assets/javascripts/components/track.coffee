Crafty.c("Track",

  segments: Config.cycle.segments
  _segments: []
  _player: null

  Track: ->
    @_segments = []
    _.times(@segments, (index) =>
      prevSegment = @_segments[index - 1]
      segment = Crafty.e("Segment").angle(index * 360 / @segments).preceeding(prevSegment).Segment()
      @_segments.push(segment)
    )
    _.first(@_segments).preceeding(_.last(@_segments))
    @bind('LevelUp', => @upgrade())
    @

  color: (color) ->
    @_color = color
    @each("color", @_color)
    @

  player: (player)->
    @attr("player", player)
    @

  currentSegment: (forward = 0 )->
    a = @player.angle()
    x = 360 / @segments
    d = (Math.floor(a/x) + forward) % @segments
    @_segments[d]

  upgrade: ->
    @each("upgrade")

  reset: ->
    @each("reset")

  each: (funcName, argument = null) ->
    _.each(@_segments, (segment) -> segment[funcName](argument))
)
