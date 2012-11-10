Crafty.c("Segment",

  innerRadius: Config.cycleInnerRadius
  outerRadius: Config.cycleOuterRadius
  _inner: null
  _outer: null

  Segment: () ->
    @_inner = Crafty.e("Obstacle").radius(@innerRadius).pivot(@pivot).angle(@angle).Obstacle()
    @_outer = Crafty.e("Obstacle").radius(@outerRadius).pivot(@pivot).angle(@angle).Obstacle()
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
        @_inner.shiftRadius(-10)
        @_outer.shiftRadius(+10)
      when "Merge"
        @_inner.shiftRadius(+15)
        @_outer.shiftRadius(-15)
)
