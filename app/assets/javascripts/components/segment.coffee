Crafty.c("Segment",

  innerRadius: Config.cycleInnerRadius
  outerRadius: Config.cycleOuterRadius
  _inner: null
  _outer: null

  Segment: () ->
    @_inner = Crafty.e("Obstacle").radius(@innerRadius).pivot(@pivot).angle(@angle).Obstacle().onHit("Player", => @reset())
    @_outer = Crafty.e("Obstacle").radius(@outerRadius).pivot(@pivot).angle(@angle).Obstacle().onHit("Player", => @reset())
    @

  pivot: (pivot)->
    @attr('pivot', pivot)
    @

  angle: (angle)->
    @attr('angle', angle)
    @

  reset: ->
    @_inner.reset()
    @_outer.reset()

  perform: (action) ->
    switch action
      when "Pull"
        @_inner.shiftRadius(-30)
        @_outer.shiftRadius(-30)
      when "Pull"
        @_inner.shiftRadius(+30)
        @_outer.shiftRadius(+30)
      when "Fork"
        @_inner.shiftRadius(-20)
        @_outer.shiftRadius(+20)
      when "Merge"
        @_inner.shiftRadius(+20)
        @_outer.shiftRadius(-20)
)
